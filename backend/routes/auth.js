const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { createUser, findUserByEmail, updateUserLastLogin } = require('../services/userService');
const logger = require('../utils/logger');

const router = express.Router();

// 🛡️ RATE LIMITING PARA AUTH
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: { error: 'Demasiados intentos de login. Intenta en 15 minutos.' },
  skipSuccessfulRequests: true
});

// 📝 REGISTRO
router.post('/register',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo'),
    body('name')
      .isLength({ min: 2, max: 50 })
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage('Nombre inválido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Verificar si usuario existe
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Usuario ya existe' });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const user = await createUser({
        email,
        password: hashedPassword,
        name,
        ip: req.ip
      });

      logger.info(`👤 Usuario registrado: ${email}`);

      // JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      logger.error('💥 Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// 🔐 LOGIN
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Buscar usuario
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Actualizar último login
      await updateUserLastLogin(user.id, req.ip);

      logger.info(`🔐 Login exitoso: ${email}`);

      // JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      logger.error('💥 Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// 🔄 REFRESH TOKEN
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;