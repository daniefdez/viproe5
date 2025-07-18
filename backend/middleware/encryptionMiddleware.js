const crypto = require('crypto');
const logger = require('../utils/logger');

// 🔐 SISTEMA DE ENCRIPTACIÓN AVANZADO

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.saltLength = 32;
    
    // Clave maestra desde variable de entorno
    this.masterKey = process.env.ENCRYPTION_KEY || this.generateKey();
    
    if (!process.env.ENCRYPTION_KEY) {
      logger.warn('⚠️ No ENCRYPTION_KEY found, using generated key (not persistent)');
    }
  }
  
  // Generar clave aleatoria
  generateKey() {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }
  
  // Derivar clave usando PBKDF2
  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
  }
  
  // Encriptar datos
  encrypt(data, password = null) {
    try {
      const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Generar salt e IV
      const salt = crypto.randomBytes(this.saltLength);
      const iv = crypto.randomBytes(this.ivLength);
      
      // Derivar clave
      const key = password ? 
        this.deriveKey(password, salt) : 
        Buffer.from(this.masterKey, 'hex');
      
      // Crear cipher
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(salt); // Additional Authenticated Data
      
      // Encriptar
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Obtener tag de autenticación
      const tag = cipher.getAuthTag();
      
      // Combinar todo
      const result = {
        encrypted,
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
      
      return Buffer.from(JSON.stringify(result)).toString('base64');
      
    } catch (error) {
      logger.error('🔐 Encryption error:', error);
      throw new Error('Error en encriptación');
    }
  }
  
  // Desencriptar datos
  decrypt(encryptedData, password = null) {
    try {
      // Decodificar
      const data = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
      
      // Extraer componentes
      const { encrypted, salt, iv, tag, algorithm } = data;
      
      // Derivar clave
      const key = password ? 
        this.deriveKey(password, Buffer.from(salt, 'hex')) : 
        Buffer.from(this.masterKey, 'hex');
      
      // Crear decipher
      const decipher = crypto.createDecipher(algorithm, key);
      decipher.setAAD(Buffer.from(salt, 'hex'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      // Desencriptar
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
      
    } catch (error) {
      logger.error('🔐 Decryption error:', error);
      throw new Error('Error en desencriptación');
    }
  }
  
  // Hash seguro con salt
  hash(data, salt = null) {
    const actualSalt = salt || crypto.randomBytes(this.saltLength);
    const hash = crypto.pbkdf2Sync(data, actualSalt, 100000, 64, 'sha512');
    
    return {
      hash: hash.toString('hex'),
      salt: actualSalt.toString('hex')
    };
  }
  
  // Verificar hash
  verifyHash(data, hash, salt) {
    const computed = crypto.pbkdf2Sync(data, Buffer.from(salt, 'hex'), 100000, 64, 'sha512');
    return crypto.timingSafeEqual(computed, Buffer.from(hash, 'hex'));
  }
  
  // Generar token seguro
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Firmar datos
  sign(data, privateKey) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'hex');
  }
  
  // Verificar firma
  verify(data, signature, publicKey) {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'hex');
  }
}

const encryptionService = new EncryptionService();

// Middleware para encriptar respuestas sensibles
const encryptResponse = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Solo encriptar en endpoints sensibles
    const sensitiveEndpoints = ['/api/auth', '/api/user'];
    const shouldEncrypt = sensitiveEndpoints.some(endpoint => 
      req.originalUrl.startsWith(endpoint)
    );
    
    if (shouldEncrypt && data && !data.error) {
      try {
        const encrypted = encryptionService.encrypt(data);
        return originalJson.call(this, { encrypted: true, data: encrypted });
      } catch (error) {
        logger.error('🔐 Response encryption failed:', error);
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware para desencriptar requests
const decryptRequest = (req, res, next) => {
  if (req.body && req.body.encrypted && req.body.data) {
    try {
      const decrypted = encryptionService.decrypt(req.body.data);
      req.body = JSON.parse(decrypted);
    } catch (error) {
      logger.error('🔐 Request decryption failed:', error);
      return res.status(400).json({ error: 'Datos encriptados inválidos' });
    }
  }
  
  next();
};

module.exports = {
  encryptionService,
  encryptResponse,
  decryptRequest
};