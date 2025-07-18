const crypto = require('crypto');
const logger = require('./logger');

// 🛡️ UTILIDADES DE SEGURIDAD AVANZADAS

class SecurityUtils {
  
  // Generar nonce criptográficamente seguro
  static generateNonce(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Generar hash seguro con salt
  static secureHash(data, salt = null) {
    const actualSalt = salt || crypto.randomBytes(32);
    const hash = crypto.pbkdf2Sync(data, actualSalt, 100000, 64, 'sha512');
    
    return {
      hash: hash.toString('hex'),
      salt: actualSalt.toString('hex')
    };
  }
  
  // Verificar hash de forma segura (timing-safe)
  static verifyHash(data, hash, salt) {
    const computed = crypto.pbkdf2Sync(data, Buffer.from(salt, 'hex'), 100000, 64, 'sha512');
    return crypto.timingSafeEqual(computed, Buffer.from(hash, 'hex'));
  }
  
  // Comparación timing-safe
  static timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }
    
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
  
  // Sanitizar input para prevenir inyecciones
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    return input
      .replace(/[\x00-\x1F\x7F]/g, '') // Remover caracteres de control
      .replace(/[<>'"&]/g, (match) => { // Escapar caracteres HTML
        const htmlEntities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return htmlEntities[match];
      })
      .trim()
      .substring(0, 10000); // Limitar longitud
  }
  
  // Validar email de forma segura
  static isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  
  // Validar password fuerte
  static isStrongPassword(password) {
    if (typeof password !== 'string' || password.length < 8) {
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }
  
  // Generar token JWT seguro
  static generateSecureToken() {
    return crypto.randomBytes(64).toString('hex');
  }
  
  // Detectar patrones de ataque en URL
  static detectMaliciousURL(url) {
    const maliciousPatterns = [
      /(\.\.|%2e%2e)/i, // Path traversal
      /(script|javascript|vbscript)/i, // Script injection
      /(union|select|insert|delete|drop)/i, // SQL injection
      /(<|%3c|&lt;)/i, // HTML injection
      /(exec|eval|system|cmd)/i // Command injection
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(url));
  }
  
  // Generar CSP nonce
  static generateCSPNonce() {
    return crypto.randomBytes(16).toString('base64');
  }
  
  // Validar origen de request
  static isValidOrigin(origin, allowedOrigins) {
    if (!origin) return false;
    return allowedOrigins.some(allowed => origin.startsWith(allowed));
  }
  
  // Detectar User Agent sospechoso
  static isSuspiciousUserAgent(userAgent) {
    if (!userAgent || userAgent.length === 0) return true;
    if (userAgent.length > 500) return true;
    
    const suspiciousPatterns = [
      /bot|crawler|spider|scraper/i,
      /curl|wget|python|java|go-http/i,
      /scanner|exploit|hack|attack/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }
  
  // Rate limiting por IP
  static createIPRateLimiter() {
    const ipRequests = new Map();
    
    return (ip, maxRequests = 100, windowMs = 15 * 60 * 1000) => {
      const now = Date.now();
      const requests = ipRequests.get(ip) || [];
      
      // Filtrar requests dentro de la ventana de tiempo
      const validRequests = requests.filter(time => now - time < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      ipRequests.set(ip, validRequests);
      
      return true; // Request allowed
    };
  }
  
  // Generar fingerprint del request
  static generateRequestFingerprint(req) {
    const components = [
      req.ip,
      req.get('User-Agent') || '',
      req.get('Accept-Language') || '',
      req.get('Accept-Encoding') || '',
      req.method,
      req.originalUrl
    ];
    
    const fingerprint = components.join('|');
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  }
  
  // Logging seguro (sin datos sensibles)
  static secureLog(level, message, data = {}) {
    // Remover datos sensibles antes de loggear
    const sanitizedData = { ...data };
    
    // Lista de campos sensibles a remover
    const sensitiveFields = [
      'password', 'token', 'apiKey', 'secret', 'key',
      'authorization', 'cookie', 'session'
    ];
    
    const removeSensitiveData = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const cleaned = {};
      for (let [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          cleaned[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          cleaned[key] = removeSensitiveData(value);
        } else {
          cleaned[key] = value;
        }
      }
      return cleaned;
    };
    
    const cleanedData = removeSensitiveData(sanitizedData);
    logger[level](message, cleanedData);
  }
}

module.exports = SecurityUtils;