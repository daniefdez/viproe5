const logger = require('../utils/logger');
const crypto = require('crypto');

// 🕵️ SISTEMA DE DETECCIÓN DE INTRUSIONES (IDS)

class IntrusionDetectionSystem {
  constructor() {
    this.attackPatterns = new Map();
    this.ipProfiles = new Map();
    this.alertThresholds = {
      sqlInjection: 3,
      xss: 3,
      pathTraversal: 2,
      commandInjection: 1,
      bruteForce: 5
    };
  }
  
  // Detectar patrones de ataque SQL Injection
  detectSQLInjection(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /('|(\\x27)|(\\x2D\\x2D)|(%27)|(%2D%2D))/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /(\b(OR|AND)\b\s*(\d+\s*=\s*\d+|\w+\s*=\s*\w+))/i,
      /(WAITFOR\s+DELAY|BENCHMARK\s*\(|SLEEP\s*\()/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  // Detectar XSS
  detectXSS(input) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /(javascript:|vbscript:|data:text\/html)/i,
      /(onload=|onerror=|onclick=|onmouseover=)/i,
      /(<iframe|<object|<embed|<applet)/i,
      /(eval\s*\(|setTimeout\s*\(|setInterval\s*\()/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
  
  // Detectar Path Traversal
  detectPathTraversal(input) {
    const pathPatterns = [
      /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\)/i,
      /(\/etc\/passwd|\/etc\/shadow|\/proc\/|\/sys\/)/i,
      /(\\windows\\|\\system32\\|\\boot\\)/i,
      /(\.\.\%2f|\.\.\%5c)/i
    ];
    
    return pathPatterns.some(pattern => pattern.test(input));
  }
  
  // Detectar Command Injection
  detectCommandInjection(input) {
    const cmdPatterns = [
      /(\||&|;|\$\(|\`|<|>)/,
      /(nc |netcat |wget |curl |chmod |rm |mv |cp )/i,
      /(bash|sh|cmd|powershell|python|perl|ruby)/i,
      /(\${|%{|\$\()/
    ];
    
    return cmdPatterns.some(pattern => pattern.test(input));
  }
  
  // Detectar Brute Force
  detectBruteForce(ip, endpoint) {
    const key = `${ip}-${endpoint}`;
    const profile = this.ipProfiles.get(key) || { attempts: 0, firstAttempt: Date.now() };
    
    profile.attempts++;
    profile.lastAttempt = Date.now();
    
    this.ipProfiles.set(key, profile);
    
    // Brute force si más de 10 intentos en 5 minutos
    const timeWindow = 5 * 60 * 1000; // 5 minutos
    const isBruteForce = profile.attempts > 10 && 
                        (profile.lastAttempt - profile.firstAttempt) < timeWindow;
    
    return isBruteForce;
  }
  
  // Analizar request completo
  analyzeRequest(req) {
    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';
    const url = req.originalUrl;
    const method = req.method;
    const body = JSON.stringify(req.body);
    const query = JSON.stringify(req.query);
    
    const threats = [];
    
    // Analizar todos los inputs
    const inputs = [url, body, query, userAgent];
    
    for (let input of inputs) {
      if (this.detectSQLInjection(input)) {
        threats.push({ type: 'SQL_INJECTION', input: input.substring(0, 100) });
      }
      
      if (this.detectXSS(input)) {
        threats.push({ type: 'XSS', input: input.substring(0, 100) });
      }
      
      if (this.detectPathTraversal(input)) {
        threats.push({ type: 'PATH_TRAVERSAL', input: input.substring(0, 100) });
      }
      
      if (this.detectCommandInjection(input)) {
        threats.push({ type: 'COMMAND_INJECTION', input: input.substring(0, 100) });
      }
    }
    
    // Detectar brute force en endpoints sensibles
    const sensitiveEndpoints = ['/api/auth/login', '/api/auth/register'];
    if (sensitiveEndpoints.includes(url) && this.detectBruteForce(ip, url)) {
      threats.push({ type: 'BRUTE_FORCE', endpoint: url });
    }
    
    // Registrar amenazas
    if (threats.length > 0) {
      this.recordThreats(ip, threats);
      
      logger.error(`🚨 INTRUSION DETECTED from ${ip}`, {
        ip,
        userAgent,
        url,
        method,
        threats,
        timestamp: new Date().toISOString()
      });
    }
    
    return threats;
  }
  
  // Registrar amenazas
  recordThreats(ip, threats) {
    const profile = this.attackPatterns.get(ip) || { 
      totalThreats: 0, 
      threatTypes: new Map(),
      firstSeen: Date.now()
    };
    
    profile.totalThreats += threats.length;
    profile.lastSeen = Date.now();
    
    threats.forEach(threat => {
      const count = profile.threatTypes.get(threat.type) || 0;
      profile.threatTypes.set(threat.type, count + 1);
    });
    
    this.attackPatterns.set(ip, profile);
  }
  
  // Verificar si IP debe ser bloqueada
  shouldBlock(ip) {
    const profile = this.attackPatterns.get(ip);
    if (!profile) return false;
    
    // Bloquear si supera umbrales
    for (let [type, count] of profile.threatTypes) {
      const threshold = this.alertThresholds[type.toLowerCase()] || 5;
      if (count >= threshold) {
        return true;
      }
    }
    
    // Bloquear si demasiadas amenazas en total
    return profile.totalThreats >= 10;
  }
  
  // Obtener estadísticas
  getStats() {
    const stats = {
      totalIPs: this.attackPatterns.size,
      threatDistribution: new Map(),
      topAttackers: []
    };
    
    // Distribución de amenazas
    for (let [ip, profile] of this.attackPatterns) {
      for (let [type, count] of profile.threatTypes) {
        const current = stats.threatDistribution.get(type) || 0;
        stats.threatDistribution.set(type, current + count);
      }
    }
    
    // Top atacantes
    stats.topAttackers = Array.from(this.attackPatterns.entries())
      .sort((a, b) => b[1].totalThreats - a[1].totalThreats)
      .slice(0, 10)
      .map(([ip, profile]) => ({ ip, threats: profile.totalThreats }));
    
    return stats;
  }
  
  // Limpiar datos antiguos
  cleanup() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    for (let [ip, profile] of this.attackPatterns) {
      if (now - profile.lastSeen > oneDay) {
        this.attackPatterns.delete(ip);
      }
    }
    
    for (let [key, profile] of this.ipProfiles) {
      if (now - profile.lastAttempt > oneDay) {
        this.ipProfiles.delete(key);
      }
    }
  }
}

const ids = new IntrusionDetectionSystem();

// Limpiar cada hora
setInterval(() => ids.cleanup(), 60 * 60 * 1000);

// Middleware IDS
const intrusionDetectionMiddleware = (req, res, next) => {
  const threats = ids.analyzeRequest(req);
  
  if (threats.length > 0) {
    // Añadir información de amenazas al request
    req.securityThreats = threats;
    
    // Bloquear si es necesario
    if (ids.shouldBlock(req.ip)) {
      logger.error(`🚫 IP BLOCKED by IDS: ${req.ip}`);
      return res.status(403).json({ 
        error: 'Acceso denegado por actividad maliciosa detectada' 
      });
    }
  }
  
  next();
};

module.exports = {
  ids,
  intrusionDetectionMiddleware
};