
import React, { useState } from 'react';
import { View } from '../App';
import { IconChip, IconLayers, IconZap, IconShieldCheck, IconEye, IconCode, IconBrain, IconWand, IconGallery, IconPhoto } from './icons';

interface HomeProps {
    setView: (view: View) => void;
}

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void; icon: React.ReactNode }> = ({ title, isActive, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-base ${
            isActive 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
        }`}
    >
        {icon}
        {title}
    </button>
);

const FeatureListItem: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <li className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-slate-700/50 p-2 rounded-lg mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-slate-200">{title}</h4>
            <p className="text-slate-400 text-sm">{children}</p>
        </div>
    </li>
);

const TabContent: React.FC<{
    title: string;
    description: string;
    imageUrl: string;
    features: { title: string; description: string; icon: React.ReactNode }[];
    cta: { text: string; view: View; };
    setView: (view: View) => void;
}> = ({ title, description, imageUrl, features, cta, setView }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in bg-slate-800/40 p-8 rounded-2xl border border-slate-700">
        <div className="lg:order-last">
            <img src={imageUrl} alt={title} className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-video" />
        </div>
        <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">{title}</h3>
            <p className="mt-4 text-slate-300">{description}</p>
            <ul className="mt-8 space-y-5">
                {features.map((feature, index) => (
                    <FeatureListItem key={index} title={feature.title} icon={feature.icon}>
                        {feature.description}
                    </FeatureListItem>
                ))}
            </ul>
            <button
                onClick={() => setView(cta.view)}
                className="mt-8 bg-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
            >
                {cta.text}
            </button>
        </div>
    </div>
);


export const Home: React.FC<HomeProps> = ({ setView }) => {
    const [activeTab, setActiveTab] = useState<'studio' | 'forensic' | 'api'>('studio');
    
    const featuresData = {
        forensic: {
            title: "Análisis Forense Avanzado",
            description: "Nuestra IA, potenciada por Gemini, examina cada píxel para descubrir la verdad. Detecta desde sutiles artefactos de compresión hasta complejas manipulaciones de iluminación, proporcionando un veredicto de confianza sobre la autenticidad de cualquier imagen.",
            imageUrl: "https://picsum.photos/seed/matrix/800/600",
            features: [
                { title: "Detección de Manipulación", description: "Identifica clonación, empalmes y otras alteraciones con alta precisión.", icon: <IconShieldCheck className="w-5 h-5 text-green-400" /> },
                { title: "Análisis de Metadatos", description: "Infiere datos ocultos como software de edición o tipo de cámara para un contexto completo.", icon: <IconLayers className="w-5 h-5 text-cyan-400" /> },
                { title: "Reportes Detallados", description: "Obtén un informe claro y conciso con la evidencia encontrada y un resumen concluyente.", icon: <IconEye className="w-5 h-5 text-purple-400" /> },
            ],
            cta: { text: "Empezar Análisis", view: 'analysis' as View }
        },
        studio: {
            title: "Estudio Creativo Inteligente",
            description: "Transforma tus ideas en obras de arte visuales. Nuestro Estudio Creativo no solo genera imágenes a partir de texto, sino que actúa como tu director de arte personal, ofreciendo críticas y sugerencias para perfeccionar tu creación en un ciclo de retroalimentación único.",
            imageUrl: "https://picsum.photos/seed/artistic/800/600",
            features: [
                { title: "Generación de Imágenes de Alta Calidad", description: "Crea imágenes espectaculares con el poder del modelo 'Imagen 3' de Google.", icon: <IconWand className="w-5 h-5 text-yellow-400" /> },
                { title: "Galería de Inspiración Dinámica", description: "Explora un flujo infinito de arte que puedes remezclar para iniciar tu propio proceso creativo.", icon: <IconGallery className="w-5 h-5 text-purple-400" /> },
                { title: "Crítica y Regeneración con IA", description: "Recibe análisis sobre la composición y color de tu obra, y aplica las sugerencias de la IA para regenerarla al instante.", icon: <IconBrain className="w-5 h-5 text-cyan-400" /> },
            ],
            cta: { text: "Ir al Estudio Creativo", view: 'studio' as View }
        },
        api: {
            title: "API para Desarrolladores",
            description: "Integra el poder de VisionAI Pro en tus propias aplicaciones. Nuestra API RESTful, optimizada en Google AI Studio, te da acceso directo a las capacidades de análisis de Gemini, permitiéndote construir la próxima generación de herramientas visuales.",
            imageUrl: "https://picsum.photos/seed/developer/800/600",
            features: [
                { title: "Endpoints Robustos y Escalables", description: "Diseñada para alto rendimiento, nuestra API maneja tus solicitudes con velocidad y fiabilidad.", icon: <IconZap className="w-5 h-5 text-yellow-400" /> },
                { title: "Documentación Completa", description: "Empieza a construir en minutos con nuestra guía clara y ejemplos de código en varios lenguajes.", icon: <IconCode className="w-5 h-5 text-purple-400" /> },
                { title: "Acceso Directo a Gemini", description: "Aprovecha nuestra implementación afinada del modelo Gemini Pro para tus proyectos.", icon: <IconChip className="w-5 h-5 text-cyan-400" /> },
            ],
            cta: { text: "Ver Documentación de API", view: 'docs' as View }
        },
    };

    return (
        <div className="w-full flex flex-col items-center animate-fade-in py-12">
            <div className="text-center flex flex-col items-center justify-center py-16 md:py-24">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                    Descubre la Verdad Oculta en Cada Píxel. Potenciado por <span className="google-aura-text">Gemini Pro</span>.
                </h1>
                <p className="max-w-2xl text-slate-300 my-6">
                    Sube una imagen para identificar elementos, detectar manipulaciones y analizar la composición artística con nuestra tecnología de IA de última generación, afinada para obtener resultados sin precedentes.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <button 
                        onClick={() => setView('analysis')}
                        className="google-aura-button bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-transform transform hover:scale-105"
                    >
                        Empezar Análisis
                    </button>
                    <button 
                        onClick={() => setView('docs')}
                        className="text-yellow-400 font-semibold hover:underline"
                    >
                        Ver Documentación
                    </button>
                </div>
            </div>

            <section id="features" className="w-full max-w-7xl mx-auto py-20 scroll-mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-white">Un Vistazo al Futuro del Análisis Visual</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-slate-400">
                        VisionAI Pro no es solo una herramienta, es un ecosistema completo diseñado para profesionales y creativos. Descubre lo que puedes lograr.
                    </p>
                </div>
                
                {/* Tab Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                    <TabButton title="Estudio Creativo" icon={<IconWand className="w-5 h-5" />} isActive={activeTab === 'studio'} onClick={() => setActiveTab('studio')} />
                    <TabButton title="Análisis Forense" icon={<IconShieldCheck className="w-5 h-5" />} isActive={activeTab === 'forensic'} onClick={() => setActiveTab('forensic')} />
                    <TabButton title="API para Desarrolladores" icon={<IconCode className="w-5 h-5" />} isActive={activeTab === 'api'} onClick={() => setActiveTab('api')} />
                </div>

                {/* Tab Content */}
                <div className="relative min-h-[500px]">
                   {activeTab === 'studio' && <TabContent {...featuresData.studio} setView={setView} />}
                   {activeTab === 'forensic' && <TabContent {...featuresData.forensic} setView={setView} />}
                   {activeTab === 'api' && <TabContent {...featuresData.api} setView={setView} />}
                </div>
            </section>
        </div>
    );
};
