import React from 'react';
import { View } from '../App';

interface FooterProps {
    setView: (view: View) => void;
}

const FooterLink: React.FC<{ text: string; viewName: View; setView: (view: View) => void; }> = ({ text, viewName, setView }) => (
    <button onClick={() => setView(viewName)} className="text-indigo-400 hover:underline transition-colors">
        {text}
    </button>
);


export const Footer: React.FC<FooterProps> = ({ setView }) => {
    return (
        <footer className="w-full bg-gray-800 py-10 mt-12 text-center text-sm text-slate-300 border-t border-gray-700">
            <div className="max-w-4xl mx-auto px-4 space-y-4">
                <p>© {new Date().getFullYear()} <strong>VisionAI Pro</strong>. Todos los derechos reservados.</p>
                <p><em>VisionAI Pro Model e5 - Design by Jodokku San</em></p>
                <p className="font-semibold text-yellow-300">Desarrollado con Google AI Studio e impulsado por Gemini Pro.</p>
                <p className="text-xs text-gray-400 italic">
                    Descargo de responsabilidad: Los análisis son generados por IA y deben usarse con fines informativos. Verifique siempre la información crítica.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center pt-4">
                    <FooterLink text="Inicio" viewName="home" setView={setView} />
                    <FooterLink text="Análisis" viewName="analysis" setView={setView} />
                    <FooterLink text="Dashboard" viewName="dashboard" setView={setView} />
                    <FooterLink text="Documentación" viewName="docs" setView={setView} />
                    <FooterLink text="Política de Privacidad" viewName="privacy" setView={setView} />
                    <FooterLink text="Términos de Servicio" viewName="terms" setView={setView} />
                </div>
            </div>
        </footer>
    );
};