
import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { AnalysisResults } from './AnalysisResults';
import { Loader } from './Loader';
import { analyzeImage, startChat, sendMessageStream } from '../services/geminiService';
import { AnalysisResult, Message } from '../types';
import { IconPhoto, IconSparkles } from './icons';
import { InteractiveAnalysis } from './InteractiveAnalysis';
import { Chat } from '@google/genai';

export const AnalysisTool: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        try {
            const savedState = localStorage.getItem('analysisToolState');
            if (savedState) {
                const { imageUrl, analysis, messages } = JSON.parse(savedState);
                if (imageUrl) setImageUrl(imageUrl);
                if (analysis) setAnalysis(analysis);
                if (messages) setMessages(messages);
            }
        } catch (e) {
            console.error("Fallo al cargar el estado desde localStorage", e);
            localStorage.removeItem('analysisToolState');
        }
    }, []);

    useEffect(() => {
        if (imageUrl) {
            const stateToSave = { imageUrl, analysis, messages };
            localStorage.setItem('analysisToolState', JSON.stringify(stateToSave));
        }
    }, [imageUrl, analysis, messages]);

    const handleImageSelect = (file: File) => {
        handleReset();
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
    };

    const handleAnalyzeClick = useCallback(async () => {
        if (!imageFile) {
            setError('Por favor, selecciona una imagen primero.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setChatSession(null);
        setMessages([]);

        try {
            const analysisResult = await analyzeImage(imageFile);
            setAnalysis(analysisResult);
            
            const chat = await startChat(imageFile, analysisResult);
            setChatSession(chat);

            setIsChatLoading(true);
            setMessages([{ role: 'ai', content: '' }]);

            const stream = await sendMessageStream(chat, "Basado en el análisis, dame un saludo inicial y una observación interesante para empezar la conversación. Sé breve, ingenioso y habla en español.");
            
            let fullResponse = "";
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => [{ ...prev[0], content: fullResponse }]);
            }

        } catch (err) {
            console.error(err);
            setError('No se pudo analizar la imagen. Es posible que el modelo no pueda procesar esta solicitud. Por favor, prueba con otra imagen.');
        } finally {
            setIsLoading(false);
            setIsChatLoading(false);
        }
    }, [imageFile]);
    
    const handleSendMessage = async (message: string) => {
        if (!chatSession || isChatLoading) return;
        
        setIsChatLoading(true);
        setError(null);
        setMessages(prev => [...prev, { role: 'user', content: message }, { role: 'ai', content: '' }]);

        try {
            const stream = await sendMessageStream(chatSession, message);
            let fullResponse = "";
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = fullResponse;
                    return newMessages;
                });
            }
        } catch (err) {
            console.error(err);
            const errorMessage = "Lo siento, tuve un problema para procesar tu solicitud. Inténtalo de nuevo.";
            setError("Error al conectar con la IA. Intenta más tarde.");
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = errorMessage;
                return newMessages;
            });
        } finally {
            setIsChatLoading(false);
        }
    };


    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
        setIsChatLoading(false);
        setChatSession(null);
        setMessages([]);
        localStorage.removeItem('analysisToolState');
    };

    return (
        <div className="w-full max-w-5xl flex-grow flex flex-col items-center animate-fade-in py-8">
            <h2 className="text-3xl font-bold text-slate-200 mb-2">Herramienta de Análisis</h2>
            <p className="text-slate-400 mb-8">Sube una imagen para desvelar la historia detrás de cada píxel.</p>
            
            {!imageUrl && (
                <div className="w-full">
                    <ImageUploader onImageSelect={handleImageSelect} />
                </div>
            )}

            {imageUrl && (
                <div className="w-full flex flex-col items-center gap-6">
                    <div className="w-full max-w-3xl bg-slate-800/50 p-2 rounded-xl border border-slate-700 backdrop-blur-sm">
                        <img src={imageUrl} alt="Uploaded preview" className="rounded-lg max-h-[60vh] w-full object-contain" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                        >
                            <IconPhoto />
                            Nueva Imagen
                        </button>
                        {!analysis && (
                            <button
                                onClick={handleAnalyzeClick}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
                            >
                                {isLoading ? <Loader /> : <IconSparkles />}
                                {isLoading ? 'Analizando...' : 'Comenzar Análisis'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {isLoading && !analysis && (
                <div className="text-center mt-8">
                    <p className="text-lg text-slate-300 flex items-center gap-3"><Loader /> La IA está pensando... esto puede tomar un momento.</p>
                </div>
            )}

            {error && (
                <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg max-w-2xl mx-auto">
                    <h3 className="font-bold text-lg">Análisis Fallido</h3>
                    <p>{error}</p>
                </div>
            )}
            
            <div className="w-full mt-8">
                {analysis && <AnalysisResults analysis={analysis} />}
                {analysis && imageUrl && <InteractiveAnalysis analysis={analysis} imageUrl={imageUrl} messages={messages} isLoading={isChatLoading} onSendMessage={handleSendMessage} />}
            </div>
        </div>
    );
}