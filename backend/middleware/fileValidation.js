const sharp = require('sharp');
const FileType = require('file-type');
const crypto = require('crypto');
const logger = require('../utils/logger');

// 🛡️ VALIDACIÓN DE ARCHIVOS HARDCORE
const validateFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // 1. Verificar tipo real del archivo
    const fileType = await FileType.fromBuffer(buffer);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      logger.warn(`🚫 Tipo de archivo rechazado: ${fileType?.mime || 'desconocido'} desde IP: ${req.ip}`);
      return res.status(400).json({ error: 'Tipo de archivo no válido' });
    }

    // 2. Verificar que coincida con el MIME type declarado
    if (fileType.mime !== mimetype) {
      logger.warn(`🚫 MIME type no coincide: declarado ${mimetype}, real ${fileType.mime} desde IP: ${req.ip}`);
      return res.status(400).json({ error: 'Archivo sospechoso detectado' });
    }

    // 3. Verificar tamaño
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (size > maxSize) {
      return res.status(400).json({ error: 'Archivo demasiado grande' });
    }

    // 4. Verificar nombre de archivo sospechoso
    const suspiciousPatterns = [
      /\.(php|jsp|asp|exe|bat|cmd|sh)$/i,
      /\.\./,
      /[<>:"|?*]/,
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(originalname)) {
        logger.warn(`🚫 Nombre de archivo sospechoso: ${originalname} desde IP: ${req.ip}`);
        return res.status(400).json({ error: 'Nombre de archivo no válido' });
      }
    }

    // 5. Verificar que es una imagen válida con Sharp
    try {
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error('Metadatos inválidos');
      }
    } catch (sharpError) {
      logger.warn(`🚫 Imagen corrupta detectada desde IP: ${req.ip}`);
      return res.status(400).json({ error: 'Imagen corrupta o inválida' });
    }

    // 6. Generar hash del archivo para tracking
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    req.file.hash = hash;

    logger.info(`✅ Archivo validado: ${originalname} (${fileType.mime}, ${size} bytes) desde IP: ${req.ip}`);
    next();

  } catch (error) {
    logger.error('💥 Error en validación de archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  validateFile
};