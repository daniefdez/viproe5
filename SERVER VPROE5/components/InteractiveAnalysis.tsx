
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, InferredMetadataEntry, Message } from '../types';
import { Loader } from './Loader';
import { IconCalendar, IconCode, IconHelpCircle, IconMapPin, IconPhoto, IconSparkles, IconZoomIn } from './icons';

interface InteractiveAnalysisProps {
    analysis: AnalysisResult;
    imageUrl: string;
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const ALL_SUGGESTED_QUESTIONS = [
  // Creative
  "¿Qué historia podría contar esta imagen?",
  "Si esta imagen tuviera un sonido, ¿cuál sería?",
  "¿Qué pasó 5 minutos antes de que se tomara esta foto?",
  "Escribe un poema corto sobre esta escena.",
  "Si esto fuera una película, ¿cómo se llamaría?",
  "¿Qué personaje de ficción viviría aquí?",
  "Describe la atmósfera de la imagen en una palabra.",
  "¿Qué título le pondrías a esta obra de arte?",
  "¿Qué emociones te transmite esta imagen?",
  
  // Analytical
  "Describe los colores y las formas que ves.",
  "¿Cuál es el punto focal de la composición?",
  "Analiza el uso de la luz y la sombra.",
  "¿Qué es lo más interesante de esta foto?",
  "¿Hay algo fuera de lugar en esta imagen?",
  "Compara el sujeto principal con el fondo.",
  "¿Qué técnica fotográfica o artística se utilizó?",
  "Identifica tres objetos clave y su función.",

  // Technical
  "Explícame la evidencia forense en términos sencillos.",
  "¿Qué significa el 'riesgo alto' en los metadatos?",
  "¿Podrías detallar más sobre el estilo de composición?",
  "¿Qué es un 'artefacto de compresión'?",
];


const getCategoryStyles = (category: InferredMetadataEntry['category']) => {
    switch(category) {
        case 'fecha': return { icon: <IconCalendar className="w-5 h-5 text-blue-400" />, bg: "bg-blue-900/20", border: "border-blue-800" };
        case 'gps': return { icon: <IconMapPin className="w-5 h-5 text-green-400" />, bg: "bg-green-900/20", border: "border-green-800" };
        case 'camara': return { icon: <IconPhoto className="w-5 h-5 text-purple-400" />, bg: "bg-purple-900/20", border: "border-purple-800" };
        case 'software': return { icon: <IconCode className="w-5 h-5 text-red-400" />, bg: "bg-red-900/20", border: "border-red-800" };
        default: return { icon: <IconHelpCircle className="w-5 h-5 text-slate-400" />, bg: "bg-slate-800", border: "border-slate-700" };
    }
};

const getRiskLevel = (risk: number) => {
  switch (risk) {
    case 1: return { text: "Bajo", color: "bg-green-500", width: "33%" };
    case 2: return { text: "Medio", color: "bg-yellow-500", width: "66%" };
    case 3: return { text: "Alto", color: "bg-red-500", width: "100%" };
    default: return { text: "Desconocido", color: "bg-slate-400", width: "0%" };
  }
};

const MetadataCard: React.FC<{ entry: InferredMetadataEntry }> = ({ entry }) => {
    const style = getCategoryStyles(entry.category);
    const riskLevel = getRiskLevel(entry.risk);

    return (
        <div className={`rounded-xl border p-4 shadow-sm ${style.bg} ${style.border}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {style.icon}
                    <h4 className="font-semibold text-slate-200">{entry.field}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${entry.warning ? "bg-red-900/70 text-red-300" : "bg-green-900/70 text-green-300"}`}>
                    {entry.warning ? "Alerta" : "Normal"}
                </span>
            </div>
            <p className="text-sm text-slate-300"><strong>Dato:</strong> {entry.value}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{entry.note}</p>
            <div className="mt-3 text-xs">
                <span className="block text-slate-400 mb-1">Indicador de Manipulación:</span>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className={`h-full ${riskLevel.color} transition-all duration-500`} style={{ width: riskLevel.width }}></div>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">{riskLevel.text}</p>
            </div>
        </div>
    );
};

export const InteractiveAnalysis: React.FC<InteractiveAnalysisProps> = ({ analysis, imageUrl, messages, isLoading, onSendMessage }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    useEffect(() => {
        const shuffled = [...ALL_SUGGESTED_QUESTIONS].sort(() => 0.5 - Math.random());
        setSuggestedQuestions(shuffled.slice(0, 4));
    }, [analysis]);


    const handleAsk = (prompt?: string) => {
        const messageToSend = prompt || currentMessage;
        if (!messageToSend.trim() || isLoading) return;
        
        onSendMessage(messageToSend);
        
        if (!prompt) {
          setCurrentMessage("");
        }
    };
    
    const overallConclusion = analysis.forensicAnalysis.manipulationDetected
        ? "La IA encontró algunas pistas que sugieren que la imagen pudo haber sido editada o creada digitalmente."
        : "La IA no encontró pistas de edición. ¡Parece una foto auténtica!";

    return (
        <div className="w-full mt-12 space-y-8 animate-fade-in">
            <div className="p-6 rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                
                <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                    <IconSparkles className="w-6 h-6 text-purple-400" />
                    Conversación con la IA
                </h2>

                 <div className="space-y-4">
                    <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-900/50 border border-slate-700 rounded-lg flex flex-col">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl lg:max-w-2xl px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                    {msg.content.length === 0 && msg.role === 'ai' && isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader />
                                            <span>Pensando...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {msg.content}
                                            {isLoading && msg.role === 'ai' && index === messages.length - 1 && (
                                                <span className="inline-block w-2.5 h-4 bg-slate-200 animate-pulse ml-1 align-middle" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Escribe tu mensaje aquí..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                            disabled={isLoading}
                            className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-slate-300 disabled:opacity-50"
                        />
                        <button 
                            onClick={() => handleAsk()} 
                            disabled={!currentMessage.trim() || isLoading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader /> : <IconSparkles className="w-5 h-5" />}
                             Enviar
                        </button>
                    </div>
                 </div>

                 <div className="space-y-2 pt-6">
                     <p className="text-sm text-slate-400">💡 O prueba con esto:</p>
                     <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, i) => (
                            <button
                            key={i}
                            className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition disabled:opacity-50"
                            onClick={() => handleAsk(q)}
                            disabled={isLoading}
                            >
                            {q}
                            </button>
                        ))}
                     </div>
                </div>


                <div className="mt-10 border-t border-slate-700 pt-8">
                     <h3 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                        <IconPhoto className="w-6 h-6 text-cyan-400" />
                        Detalles Curiosos de la Imagen
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="overflow-hidden rounded-xl border border-slate-700 group relative">
                                <img src={imageUrl} alt="Análisis" className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconZoomIn className="w-12 h-12 text-white/80" />
                                </div>
                            </div>
                             <div className={`mt-4 p-4 border-l-4 ${analysis.forensicAnalysis.manipulationDetected ? 'border-red-500 bg-red-900/20' : 'border-green-500 bg-green-900/20'} text-sm rounded-r-lg`}>
                                <h4 className={`font-bold mb-1 ${analysis.forensicAnalysis.manipulationDetected ? 'text-red-300' : 'text-green-300'}`}>Conclusión de la IA</h4>
                                <p className="text-slate-400">{overallConclusion}</p>
                            </div>
                        </div>
                         <div className="space-y-4">
                            {analysis.inferredMetadata && analysis.inferredMetadata.map((entry, i) => (
                                <MetadataCard key={i} entry={entry} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};