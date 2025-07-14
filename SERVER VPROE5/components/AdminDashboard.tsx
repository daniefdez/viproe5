import React, { useState, useEffect } from 'react';
import { IconChartBar, IconClipboardList, IconServer, IconPhoto, IconShieldExclamation, IconShieldCheck, IconGallery, IconWand } from './icons';
import { View } from '../App';
import { AnalysisResult } from '../types';

interface AdminDashboardProps {
  setView: (view: View) => void;
}

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode, onClick?: () => void, className?: string }> = ({ title, value, icon, onClick, className="" }) => (
  <div 
    className={`bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm flex items-center gap-4 ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="bg-slate-700 p-3 rounded-lg">
        {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

type Activity = {
    id: number;
    status: 'Éxito' | 'Fallido';
    details: string;
    time: string;
    manipulation: boolean | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [analysisCount, setAnalysisCount] = useState<string>("0");
    const [creationCount, setCreationCount] = useState<string>("0");

    useEffect(() => {
        const newActivities: Activity[] = [];
        let analysisCounter = 0;
        let creationCounter = 0;

        try {
            const analysisState = localStorage.getItem('analysisToolState');
            if (analysisState) {
                const parsedAnalysis: { analysis: AnalysisResult } = JSON.parse(analysisState);
                if (parsedAnalysis.analysis) {
                     analysisCounter = 1;
                     newActivities.push({
                        id: 1,
                        status: 'Éxito',
                        details: 'Análisis forense en sesión',
                        time: 'Ahora',
                        manipulation: parsedAnalysis.analysis.forensicAnalysis.manipulationDetected,
                    });
                }
            }
        } catch (e) {
            console.error("Error al leer estado de análisis:", e);
        }

        try {
            const creativeState = localStorage.getItem('creativeStudioState');
            if (creativeState) {
                const parsedCreative = JSON.parse(creativeState);
                if (parsedCreative.generatedImageUrl) {
                    creationCounter = 1;
                    newActivities.push({
                        id: 2,
                        status: 'Éxito',
                        details: 'Creación de estudio en sesión',
                        time: 'Ahora',
                        manipulation: null,
                    });
                }
            }
        } catch (e) {
            console.error("Error al leer estado creativo:", e);
        }
        
        setRecentActivities(newActivities);
        setAnalysisCount(analysisCounter.toString());
        setCreationCount(creationCounter.toString());
    }, []);


  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in space-y-8">
      {/* System Status & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Análisis en Sesión" value={analysisCount} icon={<IconPhoto className="w-6 h-6 text-purple-400" />} />
        <MetricCard title="Creaciones en Sesión" value={creationCount} icon={<IconWand className="w-6 h-6 text-yellow-400" />} />
        <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
             <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><IconServer className="w-5 h-5 text-cyan-400" /> Estado del Sistema</h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Servicio API</span>
                    <span className="flex items-center gap-2 font-semibold text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Operacional
                    </span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Procesamiento Frontend</span>
                    <span className="flex items-center gap-2 font-semibold text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Operacional
                    </span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Persistencia Local</span>
                     <span className="flex items-center gap-2 font-semibold text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Activa
                    </span>
                </div>
             </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><IconClipboardList className="w-5 h-5 text-purple-400" /> Registro de Actividad en Sesión</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-3 px-4 font-normal">Estado</th>
                        <th className="py-3 px-4 font-normal">Detalles</th>
                        <th className="py-3 px-4 font-normal hidden md:table-cell">Resultado</th>
                        <th className="py-3 px-4 font-normal text-right">Hora</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {recentActivities.length > 0 ? recentActivities.map(activity => (
                        <tr key={activity.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'Éxito' ? 'bg-green-900/70 text-green-300' : 'bg-red-900/70 text-red-300'}`}>
                                    {activity.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-slate-300">{activity.details}</td>
                            <td className="py-3 px-4 hidden md:table-cell">
                                {activity.manipulation === true && <span className="flex items-center gap-2 text-red-400 font-semibold"><IconShieldExclamation className="w-4 h-4" /> Detectado</span>}
                                {activity.manipulation === false && <span className="flex items-center gap-2 text-green-400 font-semibold"><IconShieldCheck className="w-4 h-4" /> Auténtica</span>}
                                {activity.manipulation === null && <span className="text-slate-500">N/A</span>}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-right font-mono">{activity.time}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-slate-500">
                                No hay actividad guardada en esta sesión. <br/>
                                <button onClick={() => setView('analysis')} className="text-purple-400 hover:underline mt-2">Realiza un análisis</button> o <button onClick={() => setView('studio')} className="text-purple-400 hover:underline mt-2">crea una imagen</button> para empezar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};