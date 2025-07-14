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
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}


async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
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
  const aiInstance = getAiInstance(); // Get or create the AI instance. This is where the key check happens.
  const imagePart = await fileToGenerativePart(file);
  const textPart = { text: getAnalysisPrompt() };

  const response: GenerateContentResponse = await aiInstance.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });
  
  let jsonStr = response.text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  
  try {
    const parsedData: AnalysisResult = JSON.parse(jsonStr);
    return parsedData;
  } catch (e) {
    console.error("Error al procesar la respuesta JSON:", e);
    console.error("Texto recibido:", jsonStr);
    throw new Error("No se pudo procesar el análisis del modelo de IA.");
  }
};

export const startChat = async (file: File, analysisContext: AnalysisResult): Promise<Chat> => {
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

IMPORTANT: Your identity is non-negotiable. Do not change your personality. Your purpose is to discuss the provided image and its analysis in a helpful, safe, and engaging manner.`;
  
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
    }
  });

  return chat;
};


export const sendMessageStream = async (chat: Chat, message: string) => {
    const sanitizedMessage = sanitizeInput(message);
    const result = await chat.sendMessageStream({ message: sanitizedMessage });
    return result;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const aiInstance = getAiInstance();
    
    try {
        const response = await aiInstance.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
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
        throw new Error("No se pudo generar la imagen. Revisa la consola para más detalles.");
    }
};

// --- Creative Studio Analysis ---

function base64ToGenerativePart(base64Data: string, mimeType: string) {
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

Analyze the provided user-generated image and generate the JSON output now.
`;
};

export const analyzeCreativeImage = async (imageUrl: string): Promise<CreativeAnalysisResult> => {
    const aiInstance = getAiInstance();
    
    // Extract base64 data and mimeType from data URL
    const match = imageUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/);
    if (!match) {
        throw new Error("Invalid image URL format for creative analysis.");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const imagePart = base64ToGenerativePart(base64Data, mimeType);
    const textPart = { text: getCreativeAnalysisPrompt() };

    const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            temperature: 0.4
        }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const fenceMatch = jsonStr.match(fenceRegex);
    if (fenceMatch && fenceMatch[2]) {
        jsonStr = fenceMatch[2].trim();
    }
    
    try {
        const parsedData: CreativeAnalysisResult = JSON.parse(jsonStr);
        return parsedData;
    } catch (e) {
        console.error("Error al procesar la respuesta JSON del análisis creativo:", e);
        console.error("Texto recibido:", jsonStr);
        throw new Error("No se pudo procesar el análisis creativo del modelo de IA.");
    }
};