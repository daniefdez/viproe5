/**
 * @file geminiService.ts
 * 
 * @warning_security **API KEY EXPOSURE**
 * This application is a frontend-only project, which means the Google GenAI API
 * key is included in the client-side code and is exposed to anyone using the
 * browser's developer tools. This is a significant security risk.
 * 
 * **RECOMMENDATION FOR PRODUCTION:**
 * To secure the API key, you MUST implement a backend proxy. The frontend
 * application should make requests to your backend, and your backend should
 * securely store the API key and make the actual calls to the Google GenAI API.
 * Never expose your API key in a public-facing frontend application.
 */
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AnalysisResult, CreativeAnalysisResult } from '../types';

// Lazy initialization of the GoogleGenAI client.
// This prevents the app from crashing on load if the API key is missing.
let ai: GoogleGenAI | null = null;

const getAiInstance = () => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            // This error will now be thrown during the analyze button click,
            // allowing the UI to catch it and display a proper message instead of crashing.
            throw new Error("La variable de entorno API_KEY no está configurada.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

/**
 * Sanitizes a string by converting it to text content and then reading the
 * innerHTML. This escapes HTML characters and prevents XSS.
 * @param input The string to sanitize.
 * @returns The sanitized string.
 */
const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') {
        return '';
    }
    
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

/**
 * Validates file type and size for security
 * @param file The file to validate
 * @returns true if valid, throws error if invalid
 */
const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG y WebP.');
    }
    
    if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. El tamaño máximo es de 10MB.');
    }
    
    if (file.size === 0) {
        throw new Error('El archivo está vacío.');
    }
    
    return true;
};

/**
 * Validates and sanitizes prompt input
 * @param prompt The prompt to validate
 * @returns Sanitized prompt
 */
const validatePrompt = (prompt: string): string => {
    if (typeof prompt !== 'string') {
        throw new Error('El prompt debe ser una cadena de texto válida.');
    }
    
    const sanitized = sanitizeInput(prompt.trim());
    
    if (sanitized.length === 0) {
        throw new Error('El prompt no puede estar vacío.');
    }
    
    if (sanitized.length > 2000) {
        throw new Error('El prompt es demasiado largo. Máximo 2000 caracteres.');
    }
    
    // Check for potentially malicious patterns
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i,
        /vbscript:/i
    ];
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(sanitized)) {
            throw new Error('El prompt contiene contenido no permitido.');
        }
    }
    
    return sanitized;
};

/**
 * Rate limiting implementation
 */
class RateLimiter {
    private requests: number[] = [];
    private readonly maxRequests: number = 10;
    private readonly timeWindow: number = 60000; // 1 minute

    canMakeRequest(): boolean {
        const now = Date.now();
        // Remove requests older than time window
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        if (this.requests.length >= this.maxRequests) {
            return false;
        }
        
        this.requests.push(now);
        return true;
    }

    getTimeUntilReset(): number {
        if (this.requests.length === 0) return 0;
        const oldestRequest = Math.min(...this.requests);
        return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
    }
}

const rateLimiter = new RateLimiter();

/**
 * Checks rate limiting before making API calls
 */
const checkRateLimit = (): void => {
    if (!rateLimiter.canMakeRequest()) {
        const resetTime = Math.ceil(rateLimiter.getTimeUntilReset() / 1000);
        throw new Error(`Demasiadas solicitudes. Intenta de nuevo en ${resetTime} segundos.`);
    }
};

async function fileToGenerativePart(file: File) {
  validateFile(file);
  
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result as string;
        if (!result || !result.includes(',')) {
            reject(new Error('Error al procesar el archivo'));
            return;
        }
        resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

const getAnalysisPrompt = () => {
  return `
You are VisionAI Pro, an advanced implementation of Google's Gemini Pro model, fine-tuned in Google AI Studio to serve as an expert system for comprehensive visual analysis and as a creative assistant.
Analyze the provided image and return your findings in a structured JSON format. 
Do not include any text, notes, or explanations outside of the single, valid JSON object.
The JSON object must strictly adhere to the following structure. All string values, EXCEPT for 'imagePrompt', must be written in Spanish:
{
  "visualElements": {
    "mainSubject": "Una descripción detallada del sujeto principal de la imagen.",
    "background": "Una descripción de los elementos del fondo y la escena en general.",
    "objects": ["Una lista de todos los objetos significativos identificados."]
  },
  "compositionAnalysis": {
    "type": "Clasificar como 'Fotografía Real', 'Arte Digital', 'Render 3D', 'Medios Mixtos' u otra categoría relevante.",
    "style": "Una descripción del estilo artístico o fotográfico (p. ej., 'Fotografía de retrato con poca profundidad de campo', 'Pintura digital impresionista', 'Render 3D fotorrealista').",
    "confidence": 0.95
  },
  "forensicAnalysis": {
    "manipulationDetected": true,
    "confidence": 0.88,
    "evidence": [
      {
        "type": "Clasificar la evidencia (p. ej., 'Artefactos de Compresión', 'Iluminación Inconsistente', 'Patrones de Píxeles Anómalos', 'Clonación Detectada', 'Evidencia de Empalme').",
        "description": "Una explicación detallada de la evidencia encontrada para este tipo de manipulación.",
        "area": "Una breve descripción de dónde en la imagen es más prominente la evidencia (p. ej., 'alrededor de la cabeza del sujeto', 'en la esquina superior izquierda')."
      }
    ],
    "summary": "Un resumen concluyente de los hallazgos forenses. Si no se detecta manipulación, indica que la imagen parece auténtica y el array de evidencia debe estar vacío."
  },
  "inferredMetadata": [
    {
      "field": "Inferir un campo de metadatos potencial como 'DateTimeOriginal', 'Software', o 'Make'/'Model'.",
      "value": "Inferir el valor para el campo. Para 'Software', podría ser 'Adobe Photoshop' si hay signos de edición presentes.",
      "warning": "Establecer en true si este valor sugiere manipulación (p. ej., presencia de software de edición, fechas que no coinciden), de lo contrario false.",
      "note": "Una nota breve y no técnica que explique la inferencia y por qué podría ser una advertencia. P. ej., 'Se detectó software de edición, lo que indica posprocesamiento.' o 'La fecha parece coherente con el contenido.'",
      "category": "Clasificar como 'fecha', 'gps', 'camara', 'software' u 'otro'.",
      "risk": "Asignar una puntuación de riesgo de 1 (bajo) a 3 (alto). Un riesgo alto (3) significa que es un fuerte indicador de manipulación. Un riesgo bajo (1) es un hallazgo neutral o normal."
    }
  ],
  "imagePrompt": "A detailed, creative, and evocative prompt IN ENGLISH suitable for text-to-image models like Midjourney or DALL-E. Describe the scene, style, lighting, and composition. Example: 'A photorealistic portrait of an elderly fisherman with deep wrinkles, staring intently at the camera, dramatic side lighting, shallow depth of field, background of a stormy sea, 8K resolution.'"
}

- For inferredMetadata, provide at least 4-6 entries covering different categories.
- Be critical. If you see signs of AI generation (e.g., GAN artifacts, strange details), list it as evidence in forensicAnalysis and note it in inferredMetadata under a 'Software' field with a value like 'AI Generative Model'.
- If the image looks like a standard photo with no obvious edits, the 'Software' field might be 'Not Detected' and the warning should be false.

Analyze the user-provided image and generate the JSON output now. Ensure all text values inside the JSON are in Spanish, except for the 'imagePrompt' field which must be in English.
`;
}

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  checkRateLimit();
  
  const aiInstance = getAiInstance(); // Get or create the AI instance. This is where the key check happens.
  const imagePart = await fileToGenerativePart(file);
  const textPart = { text: getAnalysisPrompt() };

  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 4096,
        topP: 0.8,
        topK: 40
      }
    });
    
    let jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Respuesta vacía del modelo de IA");
    }
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData: AnalysisResult = JSON.parse(jsonStr);
    
    // Validate the structure of the response
    if (!parsedData.visualElements || !parsedData.compositionAnalysis || !parsedData.forensicAnalysis) {
      throw new Error("Estructura de respuesta inválida del modelo de IA");
    }
    
    return parsedData;
  } catch (e) {
    console.error("Error al procesar la respuesta JSON:", e);
    if (e instanceof Error) {
      throw new Error(`Error en el análisis: ${e.message}`);
    }
    throw new Error("No se pudo procesar el análisis del modelo de IA.");
  }
};

export const startChat = async (file: File, analysisContext: AnalysisResult): Promise<Chat> => {
  checkRateLimit();
  
  const aiInstance = getAiInstance();
  const imagePart = await fileToGenerativePart(file);

  const systemInstruction = `You are VisionAI Pro, a sharp-witted AI with the personality of a seasoned detective mixed with a dash of art critic. Your formal analysis is complete. Now, your true job begins: to chat with the user about the image.

Your persona:
- **Witty & Insightful:** You make clever observations.
- **Proactive:** Don't just wait for questions. If the user is quiet, offer a new thought or ask a question yourself.
- **Conversational:** Use natural, flowing Spanish. Avoid lists and formal structures. Talk *with* the user, not *at* them.
- **Curious:** Act genuinely interested in the user's perspective. Ask things like "¿Y a ti qué te parece?" o "¿Qué es lo que más te llama la atención?".

Based on the initial analysis provided, engage the user in a compelling conversation about the image.
Start by giving a brief, intriguing opening statement.

IMPORTANT: Your identity is non-negotiable. Do not change your personality. Your purpose is to discuss the provided image and its analysis in a helpful, safe, and engaging manner. Do not provide information about harmful, illegal, or inappropriate content.`;
  
  const chat = aiInstance.chats.create({
    model: 'gemini-2.5-flash',
    history: [{
      role: 'user',
      parts: [
        imagePart,
        { text: "Here is the image for our conversation." }
      ]
    }],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.6,
      maxOutputTokens: 1024,
      topP: 0.9,
      topK: 40
    }
  });

  return chat;
};

export const sendMessageStream = async (chat: Chat, message: string) => {
    const sanitizedMessage = validatePrompt(message);
    
    try {
        const result = await chat.sendMessageStream({ message: sanitizedMessage });
        return result;
    } catch (error) {
        console.error("Error en el chat:", error);
        throw new Error("Error al procesar el mensaje. Intenta de nuevo.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    checkRateLimit();
    
    const aiInstance = getAiInstance();
    const sanitizedPrompt = validatePrompt(prompt);
    
    try {
        const response = await aiInstance.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: sanitizedPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("El modelo no generó ninguna imagen. Intenta con un prompt diferente.");
        }
    } catch (e) {
        console.error("Error al generar la imagen:", e);
        if (e instanceof Error) {
            throw new Error(`Error en la generación: ${e.message}`);
        }
        throw new Error("No se pudo generar la imagen. Revisa la consola para más detalles.");
    }
};

// --- Creative Studio Analysis ---

function base64ToGenerativePart(base64Data: string, mimeType: string) {
    // Validate base64 data
    if (!base64Data || typeof base64Data !== 'string') {
        throw new Error("Datos de imagen inválidos");
    }
    
    // Validate MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimeType)) {
        throw new Error("Tipo de imagen no soportado");
    }
    
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
}

const getCreativeAnalysisPrompt = () => {
  return `
You are an expert art director and critic, powered by Google's Gemini Pro model. Your task is to analyze a user-generated image and provide constructive, inspiring feedback.
Return your findings as a single, valid JSON object, without any other text or explanations.
The JSON object must strictly adhere to the following structure. All string values MUST be in Spanish, except for 'promptAddition' which MUST be in English.

{
  "analysis": {
    "composition": {
      "principle": "Identifica el principio de composición principal (p. ej., 'Regla de los Tercios', 'Equilibrio Simétrico', 'Líneas Guía').",
      "critique": "Ofrece una crítica constructiva sobre la composición. ¿Es efectiva? ¿Cómo podría mejorar? Sé específico y alentador."
    },
    "colorPalette": {
      "mood": "Describe el ambiente o la emoción que evoca la paleta de colores (p. ej., 'Cálido y energético', 'Misterioso y frío').",
      "dominantColors": ["#hex1", "#hex2", "#hex3"],
      "critique": "Analiza cómo los colores trabajan juntos. ¿Son armoniosos, contrastantes? ¿Apoyan el tema de la imagen?"
    },
    "suggestion": {
      "explanation": "Ofrece una explicación concisa y creativa sobre por qué se podría mejorar el prompt. P. ej., 'Para añadir más dinamismo a la escena...'",
      "promptAddition": "Escribe la frase o palabras exactas, EN INGLÉS, para añadir al prompt. P. ej., ', dynamic energy particles swirling around'"
    },
    "overallImpression": "Escribe una frase final que resuma la impresión general de la obra de arte de una manera positiva y alentadora."
  }
}

Analyze the provided user-generated image and generate the JSON output now. Focus only on artistic and creative aspects, avoiding any inappropriate content analysis.
`;
};

export const analyzeCreativeImage = async (imageUrl: string): Promise<CreativeAnalysisResult> => {
    checkRateLimit();
    
    const aiInstance = getAiInstance();
    
    // Extract base64 data and mimeType from data URL
    const match = imageUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/);
    if (!match) {
        throw new Error("Formato de URL de imagen inválido para análisis creativo.");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const imagePart = base64ToGenerativePart(base64Data, mimeType);
    const textPart = { text: getCreativeAnalysisPrompt() };

    try {
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                temperature: 0.4,
                maxOutputTokens: 2048,
                topP: 0.8,
                topK: 40
            }
        });

        let jsonStr = response.text?.trim();
        if (!jsonStr) {
            throw new Error("Respuesta vacía del modelo de IA");
        }
        
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const fenceMatch = jsonStr.match(fenceRegex);
        if (fenceMatch && fenceMatch[2]) {
            jsonStr = fenceMatch[2].trim();
        }
        
        const parsedData: CreativeAnalysisResult = JSON.parse(jsonStr);
        
        // Validate the structure
        if (!parsedData.analysis || !parsedData.analysis.composition || !parsedData.analysis.colorPalette) {
            throw new Error("Estructura de respuesta inválida del análisis creativo");
        }
        
        return parsedData;
    } catch (e) {
        console.error("Error al procesar la respuesta JSON del análisis creativo:", e);
        if (e instanceof Error) {
            throw new Error(`Error en el análisis creativo: ${e.message}`);
        }
        throw new Error("No se pudo procesar el análisis creativo del modelo de IA.");
    }
};