import React, { useState, useRef, useEffect } from 'react';
import { Loader } from './Loader';
import { CreativeAnalysisResult } from '../types';
import { generateImage, analyzeCreativeImage } from '../services/geminiService';

interface CreativeAnalysisResult {
    description: string;
    artisticStyle: string;
    technicalElements: string[];
    remixSuggestions: string[];
}

export const CreativeStudio: React.FC = () => {
    const [savedState, setSavedState] = useState(() => {
        const saved = localStorage.getItem('creativeStudioState');
        return saved ? JSON.parse(saved) : {
            editablePrompt: '',
            generatedImageUrl: null,
            creativeAnalysis: null
        };
    });

    const [editablePrompt, setEditablePrompt] = useState(savedState.editablePrompt);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(savedState.generatedImageUrl);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [creativeAnalysis, setCreativeAnalysis] = useState<CreativeAnalysisResult | null>(savedState.creativeAnalysis);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const studioRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const stateToSave = {
            editablePrompt,
            generatedImageUrl,
            creativeAnalysis
        };
        localStorage.setItem('creativeStudioState', JSON.stringify(stateToSave));
    }, [editablePrompt, generatedImageUrl, creativeAnalysis]);

    const handleGenerateImage = async (promptToUse?: string) => {
        const finalPrompt = promptToUse || editablePrompt;
        
        // Enhanced validation
        if (!finalPrompt || typeof finalPrompt !== 'string' || !finalPrompt.trim()) {
            setGenerationError("El prompt no puede estar vacío.");
            return;
        }
        
        // Check prompt length
        if (finalPrompt.trim().length > 2000) {
            setGenerationError("El prompt es demasiado largo. Máximo 2000 caracteres.");
            return;
        }
        
        // Check for inappropriate content patterns
        const inappropriatePatterns = [
            /\b(nude|naked|sex|porn|explicit)\b/i,
            /\b(violence|blood|gore|death)\b/i,
            /\b(hate|racist|discrimination)\b/i
        ];
        
        for (const pattern of inappropriatePatterns) {
            if (pattern.test(finalPrompt)) {
                setGenerationError("El prompt contiene contenido no apropiado.");
                return;
            }
        }
        
        setIsGeneratingImage(true);
        setGenerationError(null);
        setCreativeAnalysis(null);

        try {
            const imageUrl = await generateImage(finalPrompt);
            setGeneratedImageUrl(imageUrl);
        } catch (error) {
            console.error('Error generating image:', error);
            setGenerationError("Error al generar la imagen. Por favor, intenta de nuevo.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleAnalyzeImage = async () => {
        if (!generatedImageUrl) return;

        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const result = await analyzeCreativeImage(generatedImageUrl);
            setCreativeAnalysis(result);
        } catch (error) {
            console.error('Error analyzing image:', error);
            setAnalysisError("Error al analizar la imagen. Por favor, intenta de nuevo.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRemix = (remixPrompt: string) => {
        setEditablePrompt(remixPrompt);
        if (studioRef.current) {
            studioRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-slate-100">Explora el Universo del Arte IA</h1>
                <p className="text-lg text-slate-400 mt-2 max-w-3xl mx-auto">
                    Descubre un flujo infinito de arte generado por IA. Captura la esencia de cualquier obra con "Remezclar" y transforma la inspiración en tu propia creación única.
                </p>
                <p className="text-xs text-slate-500 mt-2">Conectado como: {user?.email}</p>
            </div>

            <div ref={studioRef} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <h2 className="text-2xl font-bold text-slate-200">Estudio Creativo</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Prompt Editor */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="prompt-editor" className="block text-sm font-medium text-slate-300 mb-2">
                                Describe tu visión artística
                            </label>
                            <textarea
                                id="prompt-editor"
                                rows={5}
                                value={editablePrompt}
                                onChange={(e) => setEditablePrompt(e.target.value)}
                                maxLength={2000}
                                className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-slate-300 font-mono text-sm"
                                placeholder="Ej: A photorealistic portrait of an elderly fisherman..."
                            />
                            <div className="text-xs text-slate-500 mt-1 text-right">
                                {editablePrompt.length}/2000 caracteres
                            </div>
                        </div>

                        <button
                            onClick={() => handleGenerateImage()}
                            disabled={isGeneratingImage || !editablePrompt.trim()}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGeneratingImage ? (
                                <>
                                    <Loader size="sm" />
                                    Generando...
                                </>
                            ) : (
                                'Generar Imagen'
                            )}
                        </button>

                        {generationError && (
                            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                                {generationError}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Generated Image */}
                    <div className="space-y-6">
                        {generatedImageUrl ? (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <img
                                        src={generatedImageUrl}
                                        alt="Generated artwork"
                                        className="w-full rounded-lg shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">