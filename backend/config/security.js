// 🛡️ CONFIGURACIÓN DE SEGURIDAD CENTRALIZADA

const securityConfig = {
  // 🔐 Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-in-production',
    expiresIn: '15m', // Token corto
    refreshExpiresIn: '7d', // Refresh token más largo
    algorithm: 'HS256',
    issuer: 'visionai-pro',
    audience: 'visionai-users'
  },
  
  // 🛡️ Rate Limiting
  rateLimiting: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // requests por ventana
      message: 'Demasiadas solicitudes globales'
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5, // intentos de login
      message: 'Demasiados intentos de autenticación'
    },
    api: {
      windowMs: 15 * 60 * 1000,
      max: 20, // llamadas a API
      message: 'Límite de API alcanzado'
    },
    upload: {
      windowMs: 60 * 1000, // 1 minuto
      max: 3, // subidas por minuto
      message: 'Demasiadas subidas de archivos'
    }
  },
  
  // 📁 Validación de archivos
  fileValidation: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    scanForMalware: true,
    quarantineSuspicious: true
  },
  
  // 🔒 Encriptación
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
    saltLength: 32,
    iterations: 100000
  },
  
  // 🛡️ Headers de seguridad
  securityHeaders: {
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true
    }
  },
  
  // 🕵️ Detección de intrusiones
  intrusionDetection: {
    enabled: true,
    alertThresholds: {
      sqlInjection: 3,
      xss: 3,
      pathTraversal: 2,
      commandInjection: 1,
      bruteForce: 5
    },
    autoBlock: true,
    blockDuration: 60 * 60 * 1000, // 1 hora
    alertEmail: process.env.SECURITY_ALERT_EMAIL
  },
  
  // 🚫 DDoS Protection
  ddosProtection: {
    enabled: true,
    maxRequestsPerMinute: 100,
    maxRequestsPerSecond: 10,
    maxTotalRequests: 500,
    timeWindow: 5 * 60 * 1000, // 5 minutos
    banDuration: 60 * 60 * 1000 // 1 hora
  },
  
  // 🍯 Honeypots
  honeypots: {
    enabled: true,
    paths: [
      '/admin',
      '/wp-admin',
      '/.env',
      '/config',
      '/backup',
      '/phpmyadmin',
      '/administrator',
      '/.git',
      '/api/v1/admin'
    ]
  },
  
  // 📊 Logging de seguridad
  securityLogging: {
    enabled: true,
    logLevel: 'info',
    logSensitiveData: false,
    alertOnCritical: true,
    retentionDays: 90
  },
  
  // 🔐 Validación de passwords
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128,
    preventCommon: true
  },
  
  // 🌐 CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.CORS_ORIGINS || '').split(',')
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 horas
  },
  
  // 🔍 Input validation
  inputValidation: {
    maxStringLength: 10000,
    maxArrayLength: 1000,
    maxObjectDepth: 10,
    sanitizeHtml: true,
    stripControlChars: true
  }
};

// Validar configuración en startup
const validateConfig = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'GEMINI_API_KEY'
  ];
  
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (securityConfig.jwt.secret === 'change-this-in-production') {
      console.error('❌ JWT_SECRET must be changed in production');
      process.exit(1);
    }
  }
  
  console.log('✅ Security configuration validated');
};

module.exports = {
  securityConfig,
  validateConfig
};