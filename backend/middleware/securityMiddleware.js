const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const logger = require('../utils/logger');

// 🛡️ SISTEMA ANTI-HACKS NIVEL MILITAR

// Rate Limiting Agresivo por IP
const createRateLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`🚨 Rate limit exceeded: ${req.ip} - ${req.originalUrl}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    res.status(429).json({ error: message });
  }
});

// Rate Limiters Específicos
const globalLimiter = createRateLimiter(15 * 60 * 1000, 100, 'Demasiadas solicitudes globales');
const authLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Demasiados intentos de autenticación');
const apiLimiter = createRateLimiter(15 * 60 * 1000, 20, 'Límite de API alcanzado');
const uploadLimiter = createRateLimiter(60 * 1000, 3, 'Demasiadas subidas de archivos');

// Slow Down para ataques graduales
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10,
  delayMs: 500,
  maxDelayMs: 20000
});

// 🔒 DETECCIÓN DE PATRONES MALICIOSOS
const maliciousPatterns = [
  // SQL Injection
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /('|(\\x27)|(\\x2D\\x2D)|(%27)|(%2D%2D))/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  
  // XSS
  /(<script[^>]*>.*?<\/script>)/gi,
  /(javascript:|vbscript:|onload=|onerror=|onclick=)/i,
  /(<iframe|<object|<embed|<link|<meta)/i,
  
  // Path Traversal
  /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\)/i,
  /(\/etc\/passwd|\/etc\/shadow|\/proc\/|\/sys\/)/i,
  
  // Command Injection
  /(\||&|;|\$\(|\`|<|>)/,
  /(nc |netcat |wget |curl |chmod |rm |mv |cp )/i,
  
  // LDAP Injection
  /(\*|\)|\(|\||&)/,
  
  // NoSQL Injection
  /(\$ne|\$gt|\$lt|\$regex|\$where)/i
];

// Función para detectar patrones maliciosos
const detectMaliciousContent = (input) => {
  if (typeof input !== 'string') return false;
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

// 🕵️ FINGERPRINTING Y DETECCIÓN DE BOTS
const suspiciousBehaviorDetection = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip;
  
  // Detectar User Agents sospechosos
  const suspiciousUAs = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java|go-http/i,
    /^$/,  // User Agent vacío
    /.{500,}/  // User Agent muy largo
  ];
  
  const isSuspiciousUA = suspiciousUAs.some(pattern => pattern.test(userAgent));
  
  if (isSuspiciousUA) {
    logger.warn(`🤖 Suspicious User Agent detected: ${ip} - ${userAgent}`);
    // No bloquear inmediatamente, solo loggear
  }
  
  // Detectar headers faltantes (comportamiento de bot)
  const requiredHeaders = ['accept', 'accept-language', 'accept-encoding'];
  const missingHeaders = requiredHeaders.filter(header => !req.get(header));
  
  if (missingHeaders.length > 1) {
    logger.warn(`🚨 Missing headers detected: ${ip} - Missing: ${missingHeaders.join(', ')}`);
  }
  
  next();
};

// 🔍 VALIDACIÓN AVANZADA DE INPUTS
const advancedInputValidation = [
  // Sanitización general
  body('*').customSanitizer((value) => {
    if (typeof value === 'string') {
      // Remover caracteres de control
      value = value.replace(/[\x00-\x1F\x7F]/g, '');
      // Limitar longitud
      value = value.substring(0, 10000);
      return value.trim();
    }
    return value;
  }),
  
  // Detección de contenido malicioso
  body('*').custom((value) => {
    if (typeof value === 'string' && detectMaliciousContent(value)) {
      logger.error(`🚨 Malicious content detected: ${value.substring(0, 100)}...`);
      throw new Error('Contenido malicioso detectado');
    }
    return true;
  })
];

// 🛡️ PROTECCIÓN CSRF
const csrfProtection = (req, res, next) => {
  // Verificar origen para requests que modifican datos
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('Origin') || req.get('Referer');
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      logger.warn(`🚨 CSRF attempt detected: ${req.ip} - Origin: ${origin}`);
      return res.status(403).json({ error: 'Origen no autorizado' });
    }
  }
  next();
};

// 🔐 PROTECCIÓN CONTRA TIMING ATTACKS
const constantTimeComparison = (a, b) => {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

// 🚨 SISTEMA DE ALERTAS EN TIEMPO REAL
const securityAlertSystem = {
  alerts: new Map(),
  
  addAlert(ip, type, details) {
    const key = `${ip}-${type}`;
    const existing = this.alerts.get(key) || { count: 0, firstSeen: Date.now() };
    existing.count++;
    existing.lastSeen = Date.now();
    existing.details = details;
    
    this.alerts.set(key, existing);
    
    // Alerta crítica si hay muchos intentos
    if (existing.count >= 5) {
      logger.error(`🚨 CRITICAL SECURITY ALERT: ${type} from ${ip}`, {
        count: existing.count,
        duration: existing.lastSeen - existing.firstSeen,
        details
      });
    }
  },
  
  isBlacklisted(ip) {
    // Verificar si la IP tiene demasiadas alertas
    let totalAlerts = 0;
    for (let [key, alert] of this.alerts) {
      if (key.startsWith(ip) && Date.now() - alert.lastSeen < 3600000) { // 1 hora
        totalAlerts += alert.count;
      }
    }
    return totalAlerts >= 20;
  }
};

// 🚫 BLACKLIST AUTOMÁTICA
const autoBlacklist = (req, res, next) => {
  const ip = req.ip;
  
  if (securityAlertSystem.isBlacklisted(ip)) {
    logger.error(`🚫 BLACKLISTED IP BLOCKED: ${ip}`);
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  next();
};

// 🔒 HELMET CONFIGURACIÓN EXTREMA
const extremeHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true
});

// 📊 HONEYPOT PARA DETECTAR BOTS
const honeypotMiddleware = (req, res, next) => {
  // Rutas honeypot que solo los bots visitarían
  const honeypotPaths = ['/admin', '/wp-admin', '/.env', '/config', '/backup'];
  
  if (honeypotPaths.some(path => req.path.includes(path))) {
    logger.error(`🍯 HONEYPOT TRIGGERED: ${req.ip} accessed ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    securityAlertSystem.addAlert(req.ip, 'HONEYPOT', { path: req.path });
    
    // Respuesta falsa para confundir al atacante
    return res.status(404).send('Not Found');
  }
  
  next();
};

module.exports = {
  globalLimiter,
  authLimiter,
  apiLimiter,
  uploadLimiter,
  speedLimiter,
  suspiciousBehaviorDetection,
  advancedInputValidation,
  csrfProtection,
  constantTimeComparison,
  securityAlertSystem,
  autoBlacklist,
  extremeHelmet,
  honeypotMiddleware,
  detectMaliciousContent
};