const logger = require('../utils/logger');

// 🛡️ PROTECCIÓN ANTI-DDOS AVANZADA

class DDOSProtection {
  constructor() {
    this.connections = new Map();
    this.suspiciousIPs = new Set();
    this.bannedIPs = new Set();
    
    // Limpiar datos antiguos cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  // Detectar patrones de DDoS
  detectDDoS(ip) {
    const now = Date.now();
    const connection = this.connections.get(ip) || {
      requests: [],
      firstRequest: now,
      totalRequests: 0
    };
    
    // Añadir request actual
    connection.requests.push(now);
    connection.totalRequests++;
    
    // Mantener solo requests de los últimos 60 segundos
    connection.requests = connection.requests.filter(time => now - time < 60000);
    
    this.connections.set(ip, connection);
    
    // Detectar patrones sospechosos
    const requestsPerMinute = connection.requests.length;
    const requestsPerSecond = connection.requests.filter(time => now - time < 1000).length;
    
    // Criterios de DDoS
    const isDDoS = 
      requestsPerMinute > 100 ||  // Más de 100 requests por minuto
      requestsPerSecond > 10 ||   // Más de 10 requests por segundo
      (connection.totalRequests > 500 && now - connection.firstRequest < 300000); // 500 requests en 5 minutos
    
    if (isDDoS) {
      this.markAsSuspicious(ip);
      logger.error(`🚨 DDoS ATTACK DETECTED from ${ip}`, {
        requestsPerMinute,
        requestsPerSecond,
        totalRequests: connection.totalRequests,
        duration: now - connection.firstRequest
      });
    }
    
    return isDDoS;
  }
  
  // Marcar IP como sospechosa
  markAsSuspicious(ip) {
    this.suspiciousIPs.add(ip);
    
    // Si ya era sospechosa, banear
    if (this.suspiciousIPs.has(ip)) {
      this.bannedIPs.add(ip);
      logger.error(`🚫 IP BANNED for DDoS: ${ip}`);
      
      // Auto-unban después de 1 hora
      setTimeout(() => {
        this.bannedIPs.delete(ip);
        this.suspiciousIPs.delete(ip);
        logger.info(`🔓 IP UNBANNED: ${ip}`);
      }, 60 * 60 * 1000);
    }
  }
  
  // Verificar si IP está baneada
  isBanned(ip) {
    return this.bannedIPs.has(ip);
  }
  
  // Verificar si IP es sospechosa
  isSuspicious(ip) {
    return this.suspiciousIPs.has(ip);
  }
  
  // Limpiar datos antiguos
  cleanup() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (let [ip, connection] of this.connections) {
      if (now - connection.firstRequest > oneHour) {
        this.connections.delete(ip);
      }
    }
    
    logger.info(`🧹 DDoS Protection cleanup completed. Active connections: ${this.connections.size}`);
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      activeConnections: this.connections.size,
      suspiciousIPs: this.suspiciousIPs.size,
      bannedIPs: this.bannedIPs.size
    };
  }
}

const ddosProtection = new DDOSProtection();

// Middleware de protección DDoS
const ddosMiddleware = (req, res, next) => {
  const ip = req.ip;
  
  // Verificar si está baneada
  if (ddosProtection.isBanned(ip)) {
    logger.warn(`🚫 Blocked banned IP: ${ip}`);
    return res.status(429).json({ 
      error: 'IP temporalmente bloqueada por actividad sospechosa',
      retryAfter: 3600 
    });
  }
  
  // Detectar DDoS
  if (ddosProtection.detectDDoS(ip)) {
    return res.status(429).json({ 
      error: 'Demasiadas solicitudes detectadas',
      retryAfter: 60 
    });
  }
  
  // Añadir delay para IPs sospechosas
  if (ddosProtection.isSuspicious(ip)) {
    setTimeout(next, 1000); // 1 segundo de delay
  } else {
    next();
  }
};

module.exports = {
  ddosProtection,
  ddosMiddleware
};