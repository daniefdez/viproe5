
import React from 'react';
import { AnalysisResult } from '../types';
import { IconEye, IconPaintbrush, IconShieldCheck, IconShieldExclamation } from './icons';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
    const percentage = (confidence * 100).toFixed(0);
    let barColor = 'bg-yellow-400';
    if (confidence > 0.85) barColor = 'bg-green-400';
    if (confidence < 0.6) barColor = 'bg-red-400';

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1 text-sm text-slate-400">
                <span className="font-semibold">Confianza</span>
                <span className="font-mono">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};


export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const { visualElements, compositionAnalysis, forensicAnalysis } = analysis;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Forensic Analysis */}
      <div className={`p-6 rounded-2xl border ${forensicAnalysis.manipulationDetected ? 'bg-red-900/20 border-red-700' : 'bg-green-900/20 border-green-700'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            {forensicAnalysis.manipulationDetected ? <IconShieldExclamation className="w-12 h-12 text-red-400 flex-shrink-0" /> : <IconShieldCheck className="w-12 h-12 text-green-400 flex-shrink-0" />}
            <div>
              <h3 className={`text-xl font-semibold ${forensicAnalysis.manipulationDetected ? 'text-red-300' : 'text-green-300'}`}>
                Análisis Forense
              </h3>
              <span className={`text-2xl font-bold ${forensicAnalysis.manipulationDetected ? 'text-red-300' : 'text-green-300'}`}>
                {forensicAnalysis.manipulationDetected ? 'Manipulación Detectada' : 'Parece Auténtica'}
              </span>
            </div>
          </div>
          <div className="flex-grow md:max-w-xs w-full">
             <ConfidenceMeter confidence={forensicAnalysis.confidence} />
          </div>
        </div>
        <p className="text-slate-400 mt-4 md:pl-[64px]">{forensicAnalysis.summary}</p>
        
        {forensicAnalysis.evidence && forensicAnalysis.evidence.length > 0 && (
          <div className="mt-6 md:pl-[64px]">
            <h4 className="font-bold text-slate-300 mb-3">Evidencia Encontrada:</h4>
            <div className="space-y-3">
              {forensicAnalysis.evidence.map((ev, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="font-semibold text-slate-300">{ev.type}</p>
                  <p className="text-slate-500 font-normal text-sm mb-1">Ubicación: {ev.area}</p>
                  <p className="text-slate-400 text-sm">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Visual Elements */}
        <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
            <IconEye />
            Elementos Visuales
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-300">Sujeto Principal</h4>
              <p className="text-slate-400">{visualElements.mainSubject}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-300">Fondo</h4>
              <p className="text-slate-400">{visualElements.background}</p>
            </div>
            {visualElements.objects && visualElements.objects.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-300">Objetos Identificados</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {visualElements.objects.map((obj, index) => (
                    <span key={index} className="bg-slate-700 px-3 py-1 text-sm rounded-full text-slate-300">
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composition Analysis */}
        <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300 flex items-center gap-2">
            <IconPaintbrush />
            Análisis de Composición
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-300">Tipo</h4>
              <span className="bg-cyan-900/50 text-cyan-300 px-3 py-1 text-sm font-medium rounded-full">{compositionAnalysis.type}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-300 mb-1">Estilo</h4>
              <p className="text-slate-400">{compositionAnalysis.style}</p>
            </div>
             <div className="pt-2">
                <ConfidenceMeter confidence={compositionAnalysis.confidence} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
