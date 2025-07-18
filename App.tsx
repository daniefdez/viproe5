import React, { useState } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export const App = () => {
  const [view, setView] = useState('home');

  const renderView = () => {
    switch (view) {
      case 'about':
        return <About />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero setView={setView} />;
    }
  };

  return (
    <AuthProvider>
      <div className="relative min-h-screen text-gray-200 font-sans flex flex-col items-center overflow-x-hidden bg-gray-900">
        <Header setView={setView} />
        <main className="flex-grow w-full">
          {renderView()}
        </main>
        <Footer setView={setView} />
      </div>
    </AuthProvider>
  );
};