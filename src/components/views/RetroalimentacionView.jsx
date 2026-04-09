import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function RetroalimentacionView() {
  const { datosPantalla, cambiarEscena } = useGameStore();

  const getStylePorTipo = (tipo) => {
    switch (tipo) {
      case 'exito': return 'text-emerald-400 border-emerald-500 bg-emerald-900/40 text-emerald-100';
      case 'peligro': return 'text-red-400 border-red-500 bg-red-900/40 text-red-100';
      case 'alerta': return 'text-orange-400 border-orange-500 bg-orange-900/40 text-orange-100';
      case 'titulo': return 'text-blue-400 border-blue-500 bg-blue-900/40 text-blue-100';
      case 'analisis_ia': return 'text-purple-300 border-purple-500 bg-slate-900 text-purple-100';
      default: return 'text-yellow-400 border-yellow-500 bg-yellow-900/40 text-yellow-100';
    }
  };

  const styleObj = getStylePorTipo(datosPantalla?.tipo);
  
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-slate-100 font-pixel ${datosPantalla?.tipo === 'analisis_ia' ? 'bg-slate-950 overflow-y-auto' : 'bg-slate-900'}`}>
      
      {datosPantalla?.tipo === 'titulo' ? (
         <h1 className="text-4xl font-bold text-center text-blue-400 animate-pulse">{datosPantalla?.mensaje}</h1>
      ) : datosPantalla?.tipo === 'analisis_ia' ? (
         <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 mt-10 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 text-center">🧠 Análisis FinaMente IA</h2>
            <div className={`text-sm sm:text-base p-6 rounded-xl border whitespace-pre-wrap font-sans leading-relaxed overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-700 ${styleObj}`}>
                {datosPantalla?.mensaje}
            </div>
            <button onClick={() => cambiarEscena('Inicio')} className="w-full py-4 mt-6 bg-purple-600 hover:bg-purple-500 text-white font-pixel rounded-xl text-lg sm:text-xl shadow font-bold transition-transform active:scale-95">
                 Finalizar y Volver al Menú
            </button>
         </div>
      ) : (
        <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Aviso de Sistema</h2>
            <p className={`text-lg p-4 rounded-lg border-l-4 ${styleObj}`}>
                {datosPantalla?.mensaje}
            </p>
            {datosPantalla?.score !== undefined && (
                <p className="mt-4 text-emerald-300 font-bold">Nuevo Score Crediticio: {datosPantalla.score}</p>
            )}
        </div>
      )}

      {datosPantalla?.tipo !== 'analisis_ia' && (
        <p className="fixed bottom-10 opacity-50 animate-pulse">Avanzando...</p>
      )}
    </div>
  );
}
