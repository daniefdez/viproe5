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
        // Temporary mock response for creative analysis
        const mockAnalysis: CreativeAnalysisResult = {
            description: "Una imagen fascinante que combina elementos técnicos y artísticos de manera equilibrada.",
            artisticStyle: "Estilo digital moderno con influencias fotorrealistas",
            technicalElements: ["Composición equilibrada", "Uso efectivo de la luz", "Paleta de colores armoniosa", "Detalles bien definidos"],
            remixSuggestions: [
                "A majestic landscape with dramatic cinematic lighting, 8k resolution",
                "Portrait in the style of a Renaissance painting, oil on canvas",
                "Futuristic cityscape with vibrant neon colors and cyberpunk aesthetic",
                "Minimalist black and white composition, high contrast photography"
            ]
        };
        return mockAnalysis;
    } catch (e) {
        console.error("Error al procesar la respuesta JSON del análisis creativo:", e);
        console.error("Texto recibido:", jsonStr);
        throw new Error("No se pudo procesar el análisis creativo del modelo de IA.");
    }
};