const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const creativeRoutes = require('./routes/creative');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { setupDatabase } = require('./config/database');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// 🔒 SEGURIDAD HARDCORE
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// 🚀 PERFORMANCE Y LOGGING
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// 🛡️ RATE LIMITING AGRESIVO
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: { error: 'Demasiadas solicitudes. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 análisis por 15 min
  message: { error: 'Límite de análisis alcanzado. Espera 15 minutos.' }
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10,
  delayMs: 500
});

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
app.use('/api/auth', authRoutes);
app.use('/api/analysis', apiLimiter, analysisRoutes);
app.use('/api/creative', apiLimiter, creativeRoutes);

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