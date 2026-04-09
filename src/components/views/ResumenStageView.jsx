import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function ResumenStageView() {
  const { datosPantalla, resolverPromesa, notificacionesPendientes, setEsperandoCierreResumen, resolverResumen, cambiarEscena } = useGameStore();
  const isConfirmar = datosPantalla?.modo === 'confirmar_avance';

  const handleCerrarResumen = () => {
    setEsperandoCierreResumen(false);
    
    // Desbloqueamos el sleep del motor
    if (typeof resolverResumen === 'function') {
        resolverResumen(); 
    }

    // Forzamos el regreso al mapa para que el usuario no vea el resumen vacío
    cambiarEscena('Mapa');
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-slate-900 text-white font-pixel overflow-y-auto">
      {isConfirmar ? (
        <div className="flex flex-col h-full w-full justify-center items-center">
          <h2 className="text-3xl font-bold mb-10 text-orange-400">Fin de la Semana</h2>
          <button onClick={() => resolverPromesa('')} className="w-full max-w-sm py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold mb-4 shadow-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all">Siguiente Semana</button>
          <button onClick={() => resolverPromesa('salir')} className="w-full max-w-sm py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 transition-all">Abandonar Partida</button>
        </div>
      ) : (
        <div className="w-full max-w-xl flex flex-col items-center flex-1">
          <h2 className="text-3xl font-bold mt-10 mb-2 text-indigo-400 drop-shadow-lg">¡Mes Completado!</h2>
          <p className="text-lg text-slate-400 mb-8 font-bold">Resumen del Mes {datosPantalla?.stage}</p>

          <div className="w-full bg-white text-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-sm">HP (Salud Mental):</span>
              <span className="font-bold text-green-600 text-xl">${Math.floor(datosPantalla?.stats?.hp || 0)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-sm">Score Crediticio:</span>
              <span className="font-bold text-indigo-600 text-xl">{datosPantalla?.stats?.score?.toFixed(0)} pts</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500 text-sm">Calidad de Vida:</span>
              <span className="font-bold text-orange-500 text-xl">{Math.floor(datosPantalla?.stats?.cv || 0)}/100</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="font-bold text-slate-600">Siguiente Ingreso:</span>
              <span className="font-bold text-2xl text-emerald-600">+${datosPantalla?.stats?.nuevoIngreso?.toFixed(2)}</span>
            </div>
          </div>

          {/* NOTIFICACIONES ENCOLADAS (Las que "engañaron" al motor) */}
          {notificacionesPendientes.length > 0 && (
            <div className="mt-6 w-full space-y-2 animate-fade-in">
              <p className="text-[10px] text-indigo-400 font-bold uppercase mb-2">Noticias del Mes:</p>
              {notificacionesPendientes.map((n, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs flex items-center gap-3 ${n.tipo === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                  <span className="text-lg">{n.tipo === 'warning' ? '⚠️' : '🌟'}</span>
                  <p>{n.mensaje}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 mb-10 w-full flex flex-col items-center">
            <button
              onClick={handleCerrarResumen}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all text-lg"
            >
              Continuar Partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
