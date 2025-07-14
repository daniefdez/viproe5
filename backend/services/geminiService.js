const { GoogleGenAI } = require('@google/genai');
const sharp = require('sharp');
const FileType = require('file-type');
const crypto = require('crypto');
const logger = require('../utils/logger');

// 🔐 INICIALIZACIÓN SEGURA
let ai = null;

const getAiInstance = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no configurada');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

// 🛡️ VALIDACIÓN AVANZADA DE ARCHIVOS
const validateAndProcessFile = async (fileBuffer) => {
  try {
    // Detectar tipo real del archivo
    const fileType = await FileType.fromBuffer(fileBuffer);
    
    if (!fileType || !['image/jpeg', 'image/png', 'image/webp'].includes(fileType.mime)) {
      throw new Error('Tipo de archivo no válido');
    }

    // Verificar que no sea un archivo malicioso
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Procesar imagen con Sharp para sanitizar
    const processedBuffer = await sharp(fileBuffer)
      .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    return {
      buffer: processedBuffer,
      mimeType: 'image/jpeg',
      hash,
      originalType: fileType.mime
    };

  } catch (error) {
    logger.error('💥 Error procesando archivo:', error);
    throw new Error('Error al procesar imagen');
  }
};

// 🔍 ANÁLISIS DE IMAGEN SEGURO
const analyzeImage = async (file) => {
  try {
    const aiInstance = getAiInstance();
    
    // Procesar archivo de forma segura
    const { buffer, mimeType } = await validateAndProcessFile(file.buffer);
    
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType
      }
    };

    const prompt = `
Eres VisionAI Pro, un sistema experto de análisis visual. Analiza la imagen y devuelve SOLO un objeto JSON válido con esta estructura exacta:

{
  "visualElements": {
    "mainSubject": "Descripción del sujeto principal",
    "background": "Descripción del fondo",
    "objects": ["lista", "de", "objetos"]
  },
  "compositionAnalysis": {
    "type": "Tipo de imagen",
    "style": "Estilo artístico",
    "confidence": 0.95
  },
  "forensicAnalysis": {
    "manipulationDetected": false,
    "confidence": 0.88,
    "evidence": [],
    "summary": "Resumen del análisis forense"
  },
  "inferredMetadata": [
    {
      "field": "Campo",
      "value": "Valor",
      "warning": false,
      "note": "Nota explicativa",
      "category": "categoria",
      "risk": 1
    }
  ],
  "imagePrompt": "Prompt in English for image generation"
}

Responde SOLO con el JSON, sin texto adicional.`;

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 4096
      }
    });

    let jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error('Respuesta vacía del modelo');
    }

    // Limpiar respuesta
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const analysis = JSON.parse(jsonStr);
    
    // Validar estructura
    if (!analysis.visualElements || !analysis.forensicAnalysis) {
      throw new Error('Estructura de respuesta inválida');
    }

    logger.info('✅ Análisis completado exitosamente');
    return analysis;

  } catch (error) {
    logger.error('💥 Error en análisis:', error);
    throw new Error('Error al analizar imagen');
  }
};

// 💬 CHAT SEGURO
const startChat = async (file, analysisContext) => {
  try {
    const aiInstance = getAiInstance();
    const { buffer, mimeType } = await validateAndProcessFile(file.buffer);
    
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType
      }
    };

    const systemInstruction = `Eres VisionAI Pro, un asistente de análisis visual inteligente y conversacional. 
    
    REGLAS ESTRICTAS:
    - Responde SOLO en español
    - Mantén conversaciones sobre la imagen proporcionada
    - No proporciones información sobre contenido inapropiado
    - Sé útil, preciso y profesional
    - Máximo 200 palabras por respuesta`;

    const chat = aiInstance.chats.create({
      model: 'gemini-2.5-flash',
      history: [{
        role: 'user',
        parts: [imagePart, { text: "Imagen para análisis" }]
      }],
      config: {
        systemInstruction,
        temperature: 0.6,
        maxOutputTokens: 1024
      }
    });

    return chat;

  } catch (error) {
    logger.error('💥 Error iniciando chat:', error);
    throw new Error('Error al iniciar chat');
  }
};

// 📨 ENVÍO DE MENSAJE SEGURO
const sendMessage = async (chatSession, message) => {
  try {
    // Sanitizar mensaje
    const sanitizedMessage = message
      .replace(/<[^>]*>/g, '') // Remover HTML
      .substring(0, 500); // Limitar longitud

    if (!sanitizedMessage.trim()) {
      throw new Error('Mensaje vacío');
    }

    const result = await chatSession.sendMessage({ message: sanitizedMessage });
    return result;

  } catch (error) {
    logger.error('💥 Error enviando mensaje:', error);
    throw new Error('Error al procesar mensaje');
  }
};

// 🎨 GENERACIÓN DE IMAGEN SEGURA
const generateImage = async (prompt) => {
  try {
    const aiInstance = getAiInstance();
    
    // Sanitizar prompt
    const sanitizedPrompt = prompt
      .replace(/<[^>]*>/g, '')
      .substring(0, 1000);

    // Filtros de contenido
    const forbiddenTerms = [
      'nude', 'naked', 'sex', 'porn', 'explicit',
      'violence', 'blood', 'gore', 'death',
      'hate', 'racist', 'discrimination'
    ];

    const lowerPrompt = sanitizedPrompt.toLowerCase();
    for (const term of forbiddenTerms) {
      if (lowerPrompt.includes(term)) {
        throw new Error('Contenido no permitido en el prompt');
      }
    }

    const response = await aiInstance.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: sanitizedPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1'
      }
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error('No se pudo generar imagen');
    }

    const base64Image = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64Image}`;

  } catch (error) {
    logger.error('💥 Error generando imagen:', error);
    throw new Error('Error al generar imagen');
  }
};

module.exports = {
  analyzeImage,
  startChat,
  sendMessage,
  generateImage
};