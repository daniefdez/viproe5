import React from 'react';
import { View } from '../App';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavLink: React.FC<{ text: string; viewName: View; currentView: View; setView: (view: View) => void; }> = ({ text, viewName, currentView, setView }) => (
    <button 
        onClick={() => setView(viewName)} 
        className={`px-3 py-2 text-sm rounded-md transition-colors font-medium ${
            currentView === viewName 
            ? 'text-white' 
            : 'text-gray-300 hover:text-yellow-300'
        }`}
    >
        {text}
    </button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    
    const handleFeaturesClick = () => {
        // If we are not on the home page, switch to it first.
        if (currentView !== 'home') {
            setView('home');
            // We use a timeout to give React time to render the home page
            // before we try to scroll to the element.
            setTimeout(() => {
                document.getElementById('features')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        } else {
            // If we are already on the home page, just scroll.
            document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <header className="w-full py-4 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-purple-900 p-6 shadow-lg rounded-b-xl">
            {/* Left - Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
                <h1 className="text-2xl font-extrabold text-white">VisionAI Pro</h1>
                <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-md -ml-1">
                    Powered by Gemini
                </span>
            </div>

            {/* Center - Navigation */}
            <nav className="hidden md:flex items-center gap-4">
                <button 
                    onClick={handleFeaturesClick} 
                    className="px-3 py-2 text-sm rounded-md transition-colors font-medium text-gray-300 hover:text-yellow-300"
                >
                    Características
                </button>
                <NavLink text="Análisis" viewName="analysis" currentView={currentView} setView={setView} />
                <NavLink text="Dashboard" viewName="dashboard" currentView={currentView} setView={setView} />
                <NavLink text="Estudio" viewName="studio" currentView={currentView} setView={setView} />
                <NavLink text="Documentación" viewName="docs" currentView={currentView} setView={setView} />
            </nav>

            {/* Right - Actions */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setView('analysis')}
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500 font-bold"
                >
                    Empezar
                </button>
            </div>
        </header>
    );
};