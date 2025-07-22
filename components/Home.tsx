import React, { useState } from 'react';
import { View } from '../App';
import { IconChip, IconLayers, IconZap, IconShieldCheck, IconEye, IconCode, IconBrain, IconWand, IconGallery, IconPhoto } from './icons';
import { ArtGallery } from './ArtGallery';

interface HomeProps {
    setView: (view: View) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
    const [activeTab, setActiveTab] = useState<'studio' | 'forensic' | 'api'>('studio');
    
    const featuresData = {
        studio: {
            title: "Creative Studio",
            description: "Transform your ideas into stunning visuals with our AI-powered creative tools.",
            features: [
                { icon: <IconBrain className="w-6 h-6" />, title: "AI Image Generation", description: "Create unique images from text descriptions" },
                { icon: <IconWand className="w-6 h-6" />, title: "Style Transfer", description: "Apply artistic styles to your images" },
                { icon: <IconLayers className="w-6 h-6" />, title: "Advanced Editing", description: "Professional-grade editing tools" }
            ],
            cta: { text: "Start Creating", action: () => setView('studio') }
        },
        forensic: {
            title: "Forensic Analysis",
            description: "Detect AI-generated content and analyze image authenticity with cutting-edge technology.",
            features: [
                { icon: <IconEye className="w-6 h-6" />, title: "AI Detection", description: "Identify AI-generated images with high accuracy" },
                { icon: <IconShieldCheck className="w-6 h-6" />, title: "Authenticity Verification", description: "Verify image integrity and origin" },
                { icon: <IconZap className="w-6 h-6" />, title: "Real-time Analysis", description: "Instant results with detailed reports" }
            ],
            cta: { text: "Analyze Images", action: () => setView('forensic') }
        },
        api: {
            title: "Developer API",
            description: "Integrate our powerful AI capabilities into your applications with our comprehensive API.",
            features: [
                { icon: <IconCode className="w-6 h-6" />, title: "RESTful API", description: "Easy-to-use REST endpoints for all features" },
                { icon: <IconChip className="w-6 h-6" />, title: "High Performance", description: "Optimized for speed and reliability" },
                { icon: <IconGallery className="w-6 h-6" />, title: "Comprehensive Docs", description: "Detailed documentation and examples" }
            ],
            cta: { text: "View Documentation", action: () => setView('api') }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI Visual Studio
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Create, analyze, and transform images with the power of artificial intelligence
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => setView('studio')}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                        >
                            Start Creating
                        </button>
                        <button 
                            onClick={() => setView('forensic')}
                            className="px-8 py-4 border border-purple-400 rounded-lg font-semibold hover:bg-purple-400/10 transition-all duration-200"
                        >
                            Analyze Images
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                {/* Tab Navigation */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <TabButton title="Creative Studio" icon={<IconWand className="w-5 h-5" />} isActive={activeTab === 'studio'} onClick={() => setActiveTab('studio')} />
                        <TabButton title="Forensic Analysis" icon={<IconShieldCheck className="w-5 h-5" />} isActive={activeTab === 'forensic'} onClick={() => setActiveTab('forensic')} />
                        <TabButton title="API para Desarrolladores" icon={<IconCode className="w-5 h-5" />} isActive={activeTab === 'api'} onClick={() => setActiveTab('api')} />
                    </div>
                </div>

                {/* Tab Content */}
                <div className="relative min-h-[500px]">
                   {activeTab === 'studio' && <TabContent {...featuresData.studio} setView={setView} />}
                   {activeTab === 'forensic' && <TabContent {...featuresData.forensic} setView={setView} />}
                   {activeTab === 'api' && <TabContent {...featuresData.api} setView={setView} />}
                </div>
            </section>

            {/* Art Gallery Section */}
            <section className="w-full max-w-7xl mx-auto py-20">
                <ArtGallery onRemix={(prompt) => {
                    // Store the prompt for the creative studio
                    localStorage.setItem('remixPrompt', prompt);
                    setView('studio');
                }} />
            </section>
        </div>
    );
};

const TabButton: React.FC<{
    title: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ title, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isActive
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
        }`}
    >
        {icon}
        {title}
    </button>
);

const TabContent: React.FC<{
    title: string;
    description: string;
    features: Array<{
        icon: React.ReactNode;
        title: string;
        description: string;
    }>;
    cta: {
        text: string;
        action: () => void;
    };
    setView: (view: View) => void;
}> = ({ title, description, features, cta }) => (
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {title}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {description}
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
                <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <div className="text-purple-400 mb-4">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                </div>
            ))}
        </div>
        
        <div className="text-center">
            <button
                onClick={cta.action}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
                {cta.text}
            </button>
        </div>
    </div>
);