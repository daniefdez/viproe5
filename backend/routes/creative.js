const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { generateImage, analyzeCreativeImage } = require('../services/geminiService');
const { logUserActivity } = require('../services/activityLogger');
const logger = require('../utils/logger');

const router = express.Router();

// 🎨 GENERACIÓN DE IMAGEN
router.post('/generate',
  authenticateToken,
  [
    body('prompt')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Prompt debe tener entre 10 y 1000 caracteres')
      .matches(/^[^<>]*$/)
      .withMessage('Prompt contiene caracteres no permitidos')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { prompt } = req.body;
      const { user } = req;

      logger.info(`🎨 Generación iniciada por usuario ${user.id}`);

      // Log de actividad
      await logUserActivity(user.id, 'image_generation', {
        promptLength: prompt.length,
        ip: req.ip
      });

      // Generar imagen
      const imageUrl = await generateImage(prompt);

      logger.info(`✅ Imagen generada para usuario ${user.id}`);

      res.json({
        success: true,
        imageUrl,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('💥 Error en generación:', error);
      
      if (error.message.includes('contenido no permitido')) {
        return res.status(400).json({ error: 'Contenido no permitido en el prompt' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// 🧠 ANÁLISIS CREATIVO
router.post('/analyze',
  authenticateToken,
  [
    body('imageUrl')
      .isURL()
      .withMessage('URL de imagen inválida')
      .matches(/^data:image\/(jpeg|png|webp);base64,/)
      .withMessage('Formato de imagen no válido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { imageUrl } = req.body;
      const { user } = req;

      logger.info(`🧠 Análisis creativo iniciado por usuario ${user.id}`);

      // Log de actividad
      await logUserActivity(user.id, 'creative_analysis', {
        ip: req.ip
      });

      // Analizar imagen
      const analysis = await analyzeCreativeImage(imageUrl);

      logger.info(`✅ Análisis creativo completado para usuario ${user.id}`);

      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('💥 Error en análisis creativo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;