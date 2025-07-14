const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { validateFile } = require('../middleware/fileValidation');
const { analyzeImage, startChat, sendMessage } = require('../services/geminiService');
const { logUserActivity } = require('../services/activityLogger');
const logger = require('../utils/logger');

const router = express.Router();

// 📁 CONFIGURACIÓN MULTER SEGURA
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// 🔍 ANÁLISIS DE IMAGEN
router.post('/analyze', 
  authenticateToken,
  upload.single('image'),
  validateFile,
  async (req, res) => {
    try {
      const { file, user } = req;
      
      if (!file) {
        return res.status(400).json({ error: 'No se proporcionó imagen' });
      }

      logger.info(`🔍 Análisis iniciado por usuario ${user.id}`);
      
      // Log de actividad
      await logUserActivity(user.id, 'image_analysis', {
        fileSize: file.size,
        mimeType: file.mimetype,
        ip: req.ip
      });

      // Análisis con Gemini
      const analysis = await analyzeImage(file);
      
      logger.info(`✅ Análisis completado para usuario ${user.id}`);
      
      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('💥 Error en análisis:', error);
      
      if (error.message.includes('rate limit')) {
        return res.status(429).json({ error: 'Límite de API alcanzado. Intenta más tarde.' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// 💬 CHAT INTERACTIVO
router.post('/chat/start',
  authenticateToken,
  upload.single('image'),
  validateFile,
  [body('analysisContext').notEmpty().withMessage('Contexto de análisis requerido')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { file, user, body: { analysisContext } } = req;
      
      const chatSession = await startChat(file, JSON.parse(analysisContext));
      
      // Guardar sesión de chat (en producción usarías Redis)
      req.session.chatId = chatSession.id;
      
      await logUserActivity(user.id, 'chat_started', { ip: req.ip });
      
      res.json({
        success: true,
        chatId: chatSession.id,
        message: 'Chat iniciado correctamente'
      });

    } catch (error) {
      logger.error('💥 Error iniciando chat:', error);
      res.status(500).json({ error: 'Error al iniciar chat' });
    }
  }
);

router.post('/chat/message',
  authenticateToken,
  [
    body('message')
      .isLength({ min: 1, max: 500 })
      .withMessage('Mensaje debe tener entre 1 y 500 caracteres')
      .matches(/^[^<>]*$/)
      .withMessage('Mensaje contiene caracteres no permitidos')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user, body: { message, chatId } } = req;
      
      const response = await sendMessage(chatId, message);
      
      await logUserActivity(user.id, 'chat_message', { 
        messageLength: message.length,
        ip: req.ip 
      });
      
      res.json({
        success: true,
        response: response.text,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('💥 Error en chat:', error);
      res.status(500).json({ error: 'Error al procesar mensaje' });
    }
  }
);

module.exports = router;