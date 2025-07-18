const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// 🛡️ IMPORTAR SISTEMAS DE SEGURIDAD MILITAR
const { 
  globalLimiter, 
  authLimiter, 
  apiLimiter, 
  uploadLimiter,
  speedLimiter,
  suspiciousBehaviorDetection,
  advancedInputValidation,
  csrfProtection,
  autoBlacklist,
  extremeHelmet,
  honeypotMiddleware
} = require('./middleware/securityMiddleware');
const { ddosMiddleware } = require('./middleware/ddosProtection');
const { intrusionDetectionMiddleware } = require('./middleware/intrusionDetection');
const { encryptResponse, decryptRequest } = require('./middleware/encryptionMiddleware');

const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const creativeRoutes = require('./routes/creative');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { setupDatabase } = require('./config/database');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ SEGURIDAD NIVEL MILITAR - ORDEN CRÍTICO
app.use(extremeHelmet);
app.use(honeypotMiddleware);
app.use(autoBlacklist);
app.use(ddosMiddleware);
app.use(intrusionDetectionMiddleware);
app.use(suspiciousBehaviorDetection);

// 🚀 PERFORMANCE Y LOGGING
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// 🛡️ RATE LIMITING MILITAR
app.use(globalLimiter);
app.use('/api', speedLimiter);

// 🌐 CORS CONFIGURADO
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://visionai-pro.com', 'https://www.visionai-pro.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔐 PROTECCIÓN CSRF Y ENCRIPTACIÓN
app.use(csrfProtection);
app.use(decryptRequest);
app.use(encryptResponse);

// 🛡️ VALIDACIÓN AVANZADA GLOBAL
app.use(advancedInputValidation);

// 📊 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV 
  });
});

// 🛣️ RUTAS
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/analysis', apiLimiter, analysisRoutes);
app.use('/api/creative', apiLimiter, uploadLimiter, creativeRoutes);

// 📊 ENDPOINT DE ESTADÍSTICAS DE SEGURIDAD (SOLO ADMIN)
app.get('/api/security/stats', (req, res) => {
  // TODO: Añadir autenticación de admin
  const { ddosProtection } = require('./middleware/ddosProtection');
  const { ids } = require('./middleware/intrusionDetection');
  
  res.json({
    ddos: ddosProtection.getStats(),
    intrusion: ids.getStats(),
    timestamp: new Date().toISOString()
  });
});

// 🚨 ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// 🚀 STARTUP
const startServer = async () => {
  try {
    await setupDatabase();
    
    app.listen(PORT, () => {
      logger.info(`🚀 VisionAI Pro Backend ROCK AND ROLL en puerto ${PORT}`);
      logger.info(`🌍 Entorno: ${process.env.NODE_ENV}`);
      logger.info(`🔐 Seguridad: MÁXIMA`);
    });
  } catch (error) {
    logger.error('💥 Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// 🛡️ GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  logger.info('🛑 Cerrando servidor gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('💥 Excepción no capturada:', error);
  process.exit(1);
});

startServer();