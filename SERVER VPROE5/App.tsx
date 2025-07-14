import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { AnalysisTool } from './components/AnalysisTool';
import { AdminDashboard } from './components/AdminDashboard';
import { Documentation } from './components/Documentation';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CreativeStudio } from './components/CreativeStudio';

export type View = 'home' | 'analysis' | 'dashboard' | 'docs' | 'privacy' | 'terms' | 'studio';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  const renderView = () => {
    switch (view) {
      case 'analysis':
        return <AnalysisTool />;
      case 'dashboard':
        return <AdminDashboard setView={setView} />;
      case 'docs':
        return <Documentation />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'studio':
        return <CreativeStudio />;
      case 'home':
      default:
        return <Home setView={setView} />;
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200 font-sans flex flex-col items-center overflow-x-hidden bg-gray-900">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-900/60 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-indigo-900/50 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col min-h-screen px-4 sm:px-8">
        <Header currentView={view} setView={setView} />
        <main className="w-full flex-grow flex flex-col items-center justify-center mt-4">
            {renderView()}
        </main>
        <Footer setView={setView} />
      </div>
    </div>
  );
};

export default App;