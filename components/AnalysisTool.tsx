import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { LoginForm } from './LoginForm';
import { apiService } from '../services/apiService';
import { ImageUploader } from './ImageUploader';
import { AnalysisResult, Message } from '../types';

export const AnalysisTool: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatSession, setChatSession] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Mostrar login si no está autenticado
    if (!isAuthenticated) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-200 mb-2">Análisis Avanzado</h2>
                    <p className="text-slate-400">Inicia sesión para acceder al análisis forense</p>
                </div>
                <LoginForm onSuccess={() => setShowLogin(false)} />
            </div>
        );
    }

    useEffect(() => {
        const loadSavedState = () => {
            try {
                const savedState = localStorage.getItem('analysisToolState');
                if (!savedState) return;
                
                const parsed = JSON.parse(savedState);
                
                // Validate the structure of saved data
                if (typeof parsed !== 'object' || parsed === null) {
                    localStorage.removeItem('analysisToolState');
                    return;
                }
                
                // Only restore valid data
                if (parsed.imageUrl && typeof parsed.imageUrl === 'string') {
                    setImageUrl(parsed.imageUrl);
                }
                if (parsed.analysis && typeof parsed.analysis === 'object') {
                    setAnalysis(parsed.analysis);
                }
                if (Array.isArray(parsed.messages)) {
                    setMessages(parsed.messages);
                }
            } catch (e) {
                console.error("Error al cargar el estado desde localStorage", e);
                localStorage.removeItem('analysisToolState');
            }
        };
        
        loadSavedState();
    }, []);
    
    useEffect(() => {
        const saveState = () => {
            try {
                if (imageUrl) {
                    const stateToSave = { imageUrl, analysis, messages };
                    localStorage.setItem('analysisToolState', JSON.stringify(stateToSave));
                }
            } catch (e) {
                console.error("Error al guardar el estado en localStorage", e);
            }
        };
        
        saveState();
    }, [imageUrl, analysis, messages]);
    
    const handleImageSelect = (file: File) => {
        // Additional client-side validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Tipo de archivo no válido.');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
            setError('El archivo es demasiado grande.');
            return;
        }
        
        handleReset();
        setImageFile(file);
        
        try {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        } catch (e) {
            setError('Error al procesar la imagen.');
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) return;
        
        setIsAnalyzing(true);
        setError(null);
        
        try {
            const analysisResult = await apiService.analyzeImage(imageFile);
            setAnalysis(analysisResult);
            
            const chat = await apiService.startChat(imageFile, analysisResult);
            setChatSession(chat);
            
            setMessages([{ role: 'ai', content: '' }]);
            
            const response = await apiService.sendChatMessage("Basado en el análisis, dame un saludo inicial y una observación interesante para empezar la conversación. Sé breve, ingenioso y habla en español.", chat.id);
            
            setMessages([{ role: 'ai', content: response.response }]);
            
        } catch (err) {
            console.error('Error durante el análisis:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido durante el análisis');
        } finally {
            setIsAnalyzing(false);
        }
    }, [imageFile]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!chatSession || isSending) return;
        
        setIsSending(true);
        setMessages(prev => [...prev, { role: 'user', content: message }, { role: 'ai', content: '' }]);
        
        try {
            const response = await apiService.sendChatMessage(message, chatSession.id);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = response.response;
                return newMessages;
            });
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
            setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
            setMessages(prev => prev.slice(0, -2));
        } finally {
            setIsSending(false);
        }
    }, [chatSession, isSending]);

    const handleReset = () => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageFile(null);
        setImageUrl(null);
        setAnalysis(null);
        setMessages([]);
        setChatSession(null);
        setError(null);
        localStorage.removeItem('analysisToolState');
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-200 mb-2">Herramienta de Análisis</h2>
                <p className="text-slate-400 mb-2">Sube una imagen para desvelar la historia detrás de cada píxel.</p>
                <p className="text-xs text-slate-500 mb-8">Conectado como: {user?.email}</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            <ImageUploader 
                onImageSelect={handleImageSelect}
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                imageUrl={imageUrl}
                analysis={analysis}
                messages={messages}
                isAnalyzing={isAnalyzing}
                isSending={isSending}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};