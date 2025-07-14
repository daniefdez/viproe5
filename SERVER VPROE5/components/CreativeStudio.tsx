



import React, { useState, useRef, useEffect } from 'react';
import { Loader } from './Loader';
import { IconSparkles, IconPaintbrush, IconBrain, IconDownload, IconTwitter, IconFacebook, IconPinterest, IconReddit, IconWand, IconPhoto, IconDiscord } from './icons';
import { generateImage, analyzeCreativeImage } from '../services/geminiService';
import { CreativeAnalysisResult } from '../types';

interface MockArt {
  id: number;
  imageUrl: string;
  prompt: string;
}

const inspirationArtworks: MockArt[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/cybercat/400/600', prompt: 'A portrait of a cyberpunk cat with neon glowing eyes, sitting in a rainy alley of a futuristic city, digital art, cinematic lighting.' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/fantasyislands/400/600', prompt: 'Expansive fantasy landscape of floating islands with waterfalls connecting them, Studio Ghibli inspired, soft pastel colors, detailed illustration.' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/spacejelly/400/600', prompt: 'An astronaut discovering a giant, bioluminescent jellyfish in the dark depths of an alien ocean, underwater photography, 8k, hyperrealistic.' },
  { id: 10, imageUrl: 'https://picsum.photos/seed/mossrobot/400/600', prompt: 'An ancient, massive robot covered in moss and vines, sitting dormant in the middle of a dense jungle, sunlight filtering through the canopy, digital painting, atmospheric.' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/booktree/400/600', prompt: 'Cozy, intricate treehouse library in the middle of an enchanted forest, warm light spilling from the windows, books stacked everywhere, magical realism.' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/steampunk/400/600', prompt: 'Majestic steampunk dragon made of gears, cogs, and polished brass, breathing fire made of clockwork, on top of a Victorian clock tower, matte painting.' },
  { id: 9, imageUrl: 'https://picsum.photos/seed/flowerwoman/400/600', prompt: 'A surrealist portrait of a woman made entirely of blooming flowers and butterflies, intricate details, vibrant colors, on a dark background.' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/crystalfox/400/600', prompt: 'A fox made entirely of glowing amethyst crystals, sleeping in a snowy forest under the moonlight, ethereal, fantasy art.' },
  { id: 7, imageUrl: 'https://picsum.photos/seed/atlantis/400/600', prompt: 'The lost city of Atlantis, reimagined as a bustling underwater metropolis with advanced technology, coral reefs growing on skyscrapers, photorealistic.' },
  { id: 8, imageUrl: 'https://picsum.photos/seed/spacediner/400/600', prompt: 'A retro 1950s diner floating in the middle of a nebula, with a view of a swirling galaxy through the window, sci-fi, nostalgic.' },
];

const SocialShareButton: React.FC<{ href: string; children: React.ReactNode; label: string; }> = ({ href, children, label }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={`Compartir en ${label}`}
      className="flex items-center justify-center w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-200 font-semibold transition-colors"
    >
      {children}
    </a>
);

interface CreativeAnalysisDisplayProps {
    analysis: CreativeAnalysisResult;
    onApplySuggestion: (promptAddition: string) => void;
    onRegenerateSuggestion: () => void;
    isAnalyzing: boolean;
}


const CreativeAnalysisDisplay: React.FC<CreativeAnalysisDisplayProps> = ({ analysis, onApplySuggestion, onRegenerateSuggestion, isAnalyzing }) => {
    const { composition, colorPalette, suggestion, overallImpression } = analysis.analysis;

    return (
        <div className="p-6 bg-slate-800/60 border border-slate-700 rounded-2xl animate-fade-in space-y-6">
            <h4 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-3">
                <IconBrain className="w-6 h-6 text-cyan-300" />
                Análisis Creativo de la IA
            </h4>

            {/* Overall Impression */}
            <blockquote className="border-l-4 border-purple-500 pl-4">
                <p className="text-slate-300 italic">"{overallImpression}"</p>
                <footer className="text-xs text-slate-500 mt-1">- VisionAI Critic</footer>
            </blockquote>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Composition */}
                <div className="space-y-2">
                    <h5 className="font-semibold text-slate-300">Composición: <span className="text-cyan-400">{composition.principle}</span></h5>
                    <p className="text-sm text-slate-400">{composition.critique}</p>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                     <h5 className="font-semibold text-slate-300">Paleta de Colores: <span className="text-cyan-400">{colorPalette.mood}</span></h5>
                    <div className="flex items-center gap-2 flex-wrap">
                        {colorPalette.dominantColors.map((color, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-600" style={{ backgroundColor: color }} title={color} />
                        ))}
                    </div>
                    <p className="text-sm text-slate-400">{colorPalette.critique}</p>
                </div>
            </div>

            {/* Suggestion Workshop */}
            <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                 <h5 className="font-semibold text-yellow-400 flex items-center gap-2 mb-2">
                    <IconWand className="w-5 h-5" />
                    Taller de Prompt
                </h5>
                <p className="text-sm text-slate-400 mb-3">{suggestion.explanation}</p>
                <p className="text-sm text-slate-300 font-mono bg-slate-800 p-3 rounded mb-4">
                   Añadir: <span className="text-yellow-300">"{suggestion.promptAddition}"</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                        onClick={() => onApplySuggestion(suggestion.promptAddition)}
                        className="w-full flex items-center justify-center gap-2 text-sm bg-yellow-600 hover:bg-yellow-700 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
                    >
                        <IconSparkles className="w-4 h-4" />
                        Aplicar y Regenerar
                    </button>
                    <button 
                        onClick={onRegenerateSuggestion}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-2 text-sm bg-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader/> : <IconBrain className="w-4 h-4" />}
                        Pedir Otra Sugerencia
                    </button>
                </div>
            </div>
        </div>
    );
};


export const CreativeStudio: React.FC = () => {
    const [savedState, setSavedState] = useState(() => {
        try {
            const item = localStorage.getItem('creativeStudioState');
            return item ? JSON.parse(item) : {};
        } catch {
            return {};
        }
    });

    const [editablePrompt, setEditablePrompt] = useState<string>(savedState.editablePrompt || "");
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(savedState.generatedImageUrl || null);
    const [generationError, setGenerationError] = useState<string | null>(null);

    const [creativeAnalysis, setCreativeAnalysis] = useState<CreativeAnalysisResult | null>(savedState.creativeAnalysis || null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const studioRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stateToSave = {
            editablePrompt,
            generatedImageUrl,
            creativeAnalysis,
        };
        localStorage.setItem('creativeStudioState', JSON.stringify(stateToSave));
    }, [editablePrompt, generatedImageUrl, creativeAnalysis]);

    const handleRemix = (prompt: string) => {
        setEditablePrompt(prompt);
        studioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    const handleGenerateImage = async (promptToUse?: string) => {
        const finalPrompt = promptToUse || editablePrompt;
        if (!finalPrompt.trim()) {
            setGenerationError("El prompt no puede estar vacío.");
            return;
        }
        setIsGeneratingImage(true);
        setGeneratedImageUrl(null);
        setGenerationError(null);
        setCreativeAnalysis(null);
        setAnalysisError(null);
        try {
            const imageUrl = await generateImage(finalPrompt);
            setGeneratedImageUrl(imageUrl);
        } catch(err) {
            const error = err as Error;
            setGenerationError(`Error: ${error.message}`);
        } finally {
            setIsGeneratingImage(false);
        }
    }
    
    const handleApplyAndGenerate = (promptAddition: string) => {
        const newPrompt = `${editablePrompt}${promptAddition}`;
        setEditablePrompt(newPrompt);
        handleGenerateImage(newPrompt);
    };

    const handleRegenerateSuggestion = async () => {
      if (!generatedImageUrl) return;

      setIsAnalyzing(true);
      setAnalysisError(null);
      setCreativeAnalysis(null);

      try {
        const result = await analyzeCreativeImage(generatedImageUrl);
        setCreativeAnalysis(result);
      } catch (err) {
        const error = err as Error;
        setAnalysisError(`Error del análisis: ${error.message}`);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    const handleResetStudio = () => {
        setEditablePrompt("");
        setGeneratedImageUrl(null);
        setGenerationError(null);
        setCreativeAnalysis(null);
        setAnalysisError(null);
        localStorage.removeItem('creativeStudioState');
    };


    const shareText = encodeURIComponent("¡He creado esta obra de arte con VisionAI Pro! #VisionAI #AIArt");
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent("¡He creado esta obra de arte con VisionAI Pro!");


  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in py-8 px-4 space-y-16">
        {/* Inspiration Reel */}
        <section>
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-slate-100">Explora el Universo del Arte IA</h1>
                <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">
                    Descubre un flujo infinito de arte generado por IA. Captura la esencia de cualquier obra con "Remezclar" y transforma la inspiración en tu propia creación única.
                </p>
            </div>
            <div className="marquee-group space-y-6">
                <div className="marquee-container">
                    <div className="marquee-content flex space-x-6">
                        {[...inspirationArtworks, ...inspirationArtworks].map((art, index) => (
                            <div key={`marquee-1-${art.id}-${index}`} className="marquee-item flex-shrink-0 w-80 h-96 relative rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent hover:border-purple-600/50 transition-all duration-300 cursor-pointer">
                               <img src={art.imageUrl} alt={art.prompt} className="w-full h-full object-cover" />
                               <div className="overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
                                   <p className="text-white text-xs line-clamp-3 mb-3">{art.prompt}</p>
                                   <button 
                                     onClick={() => handleRemix(art.prompt)}
                                     className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors w-fit"
                                   >
                                      <IconWand className="w-4 h-4" />
                                      Remezclar Prompt
                                   </button>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="marquee-container">
                     <div className="marquee-content marquee-content--reverse flex space-x-6">
                        {[...inspirationArtworks].reverse().concat([...inspirationArtworks].reverse()).map((art, index) => (
                             <div key={`marquee-2-${art.id}-${index}`} className="marquee-item flex-shrink-0 w-80 h-96 relative rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent hover:border-purple-600/50 transition-all duration-300 cursor-pointer">
                               <img src={art.imageUrl} alt={art.prompt} className="w-full h-full object-cover" />
                               <div className="overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
                                   <p className="text-white text-xs line-clamp-3 mb-3">{art.prompt}</p>
                                   <button 
                                     onClick={() => handleRemix(art.prompt)}
                                     className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors w-fit"
                                   >
                                      <IconWand className="w-4 h-4" />
                                      Remezclar Prompt
                                   </button>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        {/* Creative Studio */}
        <section ref={studioRef} className="scroll-mt-8">
            <div className="p-6 md:p-8 rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                 <h3 className="text-3xl font-bold text-slate-200 mb-2 flex items-center gap-3">
                    <IconPaintbrush className="w-8 h-8 text-yellow-400" />
                    Estudio Creativo
                </h3>
                <p className="text-slate-400 mb-6">Edita el prompt, genera imágenes y pule tu idea hasta la perfección.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                   {/* Columna de Controles */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="prompt-editor" className="block text-sm font-medium text-slate-300 mb-2">Tu Prompt Creativo (en inglés)</label>
                            <textarea
                                id="prompt-editor"
                                rows={5}
                                value={editablePrompt}
                                onChange={(e) => setEditablePrompt(e.target.value)}
                                className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-slate-300 font-mono text-sm"
                                placeholder="Ej: A photorealistic portrait of an elderly fisherman..."
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                             <button
                                onClick={() => handleResetStudio()}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                            >
                                <IconPhoto className="w-5 h-5"/>
                                Empezar de Nuevo
                            </button>
                            <button
                                onClick={() => handleGenerateImage()}
                                disabled={isGeneratingImage}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                            >
                                {isGeneratingImage ? <Loader /> : <IconSparkles />}
                                {isGeneratingImage ? 'Creando Magia...' : 'Generar Imagen'}
                            </button>
                        </div>
                        
                        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-lg">
                            <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2"><IconBrain className="w-5 h-5 text-cyan-300"/>Consejos de la IA</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                                <li><b>Sé específico:</b> En lugar de "un perro", prueba "un golden retriever cachorro jugando con una pelota de tenis roja".</li>
                                <li><b>Define el estilo:</b> Añade "fotorrealista", "pintura al óleo", "arte digital", "estilo anime".</li>
                                <li><b>Describe la iluminación:</b> Usa "iluminación dramática", "luz de mañana suave", "neón brillante".</li>
                                <li><b>Añade detalles:</b> Menciona "primer plano", "vista de ángulo bajo", "resolución 8K", "muy detallado".</li>
                            </ul>
                        </div>
                    </div>

                    {/* Columna de Visualización y Análisis */}
                    <div className="w-full flex flex-col gap-4">
                      <div className="aspect-square w-full bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col justify-center items-center text-center p-4">
                        {isGeneratingImage && (
                              <div className="flex flex-col items-center gap-4 text-slate-400">
                                  <Loader />
                                  <p className="text-lg font-semibold text-slate-300">Generando tu visión...</p>
                                  <p className="text-xs text-slate-500">Esto puede tardar unos segundos.</p>
                              </div>
                          )}
                          {generationError && (
                              <div className="text-red-300 px-4">
                                  <h3 className="text-lg font-bold">Error de Generación</h3>
                                  <p className="text-sm font-medium">{generationError}</p>
                                  <button onClick={() => handleGenerateImage()} className="mt-3 text-xs bg-red-800/50 px-3 py-1 rounded-md hover:bg-red-700">Intentar de nuevo</button>
                              </div>
                          )}
                          {generatedImageUrl && !isGeneratingImage && (
                              <div className="w-full h-full flex flex-col justify-between">
                                  <img src={generatedImageUrl} alt="Arte generado por IA" className="w-full object-contain rounded-lg flex-grow" />
                                  <div className="flex-shrink-0 mt-4 space-y-4">
                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <a href={generatedImageUrl} download="visionai-creation.jpeg" className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-slate-200 font-semibold transition-colors">
                                            <IconDownload className="w-4 h-4" />
                                            Descargar
                                        </a>
                                        <button 
                                          onClick={handleRegenerateSuggestion}
                                          disabled={isAnalyzing}
                                          className="flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait"
                                        >
                                          {isAnalyzing && !creativeAnalysis ? <Loader /> : <IconBrain className="w-4 h-4" />}
                                          {creativeAnalysis ? 'Analizar de Nuevo' : 'Analizar Creación'}
                                        </button>
                                    </div>

                                    {/* Share Section */}
                                    <div className="pt-4 border-t border-slate-700/50">
                                        <h4 className="text-center font-semibold text-slate-300 mb-3">Comparte tu Obra Maestra</h4>
                                        <div className="flex items-center justify-center gap-3">
                                            <SocialShareButton label="Twitter" href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}>
                                                <IconTwitter className="w-5 h-5" />
                                            </SocialShareButton>
                                            <SocialShareButton label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}>
                                                <IconFacebook className="w-5 h-5" />
                                            </SocialShareButton>
                                            <SocialShareButton label="Pinterest" href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${encodeURIComponent(generatedImageUrl)}&description=${shareText}`}>
                                                <IconPinterest className="w-5 h-5" />
                                            </SocialShareButton>
                                            <SocialShareButton label="Reddit" href={`https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`}>
                                                <IconReddit className="w-5 h-5" />
                                            </SocialShareButton>
                                            <SocialShareButton label="Discord" href="#">
                                                <IconDiscord className="w-5 h-5" />
                                            </SocialShareButton>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                          )}
                          {!isGeneratingImage && !generatedImageUrl && !generationError && (
                              <div className="flex flex-col items-center gap-4 text-slate-500">
                                  <IconPaintbrush className="w-16 h-16" />
                                  <p className="text-xl font-semibold">Tu creación aparecerá aquí</p>
                                  <p className="text-xs">Edita el prompt y pulsa "Generar Imagen" para empezar.</p>
                              </div>
                          )}
                      </div>
                      
                      {/* Display para Análisis Creativo */}
                      {isAnalyzing && !creativeAnalysis && (
                          <div className="text-center">
                              <p className="text-lg text-slate-300 flex items-center justify-center gap-3"><Loader /> La IA está preparando su crítica de arte...</p>
                          </div>
                      )}
                      {analysisError && (
                          <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                              <h3 className="font-bold">Error de Análisis</h3>
                              <p>{analysisError}</p>
                          </div>
                      )}
                      {creativeAnalysis && (
                          <CreativeAnalysisDisplay 
                            analysis={creativeAnalysis}
                            onApplySuggestion={handleApplyAndGenerate}
                            onRegenerateSuggestion={handleRegenerateSuggestion}
                            isAnalyzing={isAnalyzing}
                          />
                      )}
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};