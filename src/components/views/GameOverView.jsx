import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function GameOverView() {
  const { datosPantalla, cambiarEscena, historialIA } = useGameStore();
  const [analizando, setAnalizando] = React.useState(false);

  const isVictoria = datosPantalla?.victoria;

  const solicitarAnalisisIA = async () => {
    setAnalizando(true);

    // Si el motor inyectó el JSON rico en historialIA, lo usamos. 
    // Si por alguna razón está vacío, enviamos como fallback los stats (lo cual podría fallar en backend pero no reventamos el frontend).
    const payload = historialIA || (datosPantalla?.stats ? datosPantalla.stats : datosPantalla);

    try {
      const response = await fetch('https://stag-improved-wildcat.ngrok-free.app/partida/analizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Evita intercepción de ngrok
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error en la API de FinaMente');

      const result = await response.json();
      cambiarEscena('Retroalimentacion', { tipo: 'analisis_ia', mensaje: result.feedback });
    } catch (error) {
      console.error('Error al analizar partida:', error);
      cambiarEscena('Retroalimentacion', { tipo: 'analisis_ia', mensaje: '⚠️ No se pudo obtener el análisis de la IA:\n\n' + error.message });
    }
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center text-white p-6 text-center font-pixel ${isVictoria ? 'bg-indigo-900' : 'bg-red-950'}`}>

      <h1 className={`text-5xl font-pixel mb-4 drop-shadow-lg ${isVictoria ? 'text-emerald-400' : 'text-red-600'}`}>
        {isVictoria ? 'FINAMENTE' : 'BANCARROTA'}
      </h1>

      <p className={`text-xl mb-10 ${isVictoria ? 'text-emerald-200' : 'text-red-200'}`}>
        {datosPantalla?.razon || 'Juego Terminado'}
      </p>

      <div className={`${isVictoria ? 'bg-indigo-800 border-indigo-700' : 'bg-red-900 border-red-800'} bg-opacity-50 p-6 rounded-xl border max-w-xs mb-10 text-left w-full`}>
        {datosPantalla?.gasto && (
          <p className="mb-2"><span className="font-pixel border-b pb-1 mb-2 block border-white/20">Último Gasto:</span> {datosPantalla.gasto.nombre} (${datosPantalla.gasto.monto})</p>
        )}
        {datosPantalla?.stage && (
          <p className="mb-2"><span className="font-pixel border-b pb-1 mb-2 block border-white/20">Mes Final:</span> {datosPantalla.stage}</p>
        )}
        {datosPantalla?.stats && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <p>Salud (HP):</p><p className="font-pixel text-right">{datosPantalla.stats.hp}</p>
            <p>Calidad de Vida:</p><p className="font-pixel text-right">{datosPantalla.stats.cv}</p>
            <p>Score Crediticio:</p><p className="font-pixel text-right text-emerald-300">{datosPantalla.stats.score}</p>
          </div>
        )}
        {isVictoria && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm border-t border-white/20 pt-4">
            <p>Salud (HP):</p><p className="font-pixel text-right">{datosPantalla.hp}</p>
            <p>Score Crediticio:</p><p className="font-pixel text-right text-emerald-300">{datosPantalla.score}</p>
          </div>
        )}
      </div>

      <button
        onClick={solicitarAnalisisIA}
        disabled={analizando}
        className={`px-8 py-3 w-full max-w-xs rounded font-pixel text-lg transition-colors ${analizando ? 'bg-gray-600 cursor-not-allowed' : (isVictoria ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-700 hover:bg-red-600')}`}>
        {analizando ? 'Analizando...' : 'Analizar con IA'}
      </button>

      {!analizando && (
        <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 w-full max-w-xs rounded font-pixel text-sm bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600">
          Volver al Menú
        </button>
      )}
    </div>
  );
}
