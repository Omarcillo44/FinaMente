import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function ResumenStageView() {
  const { datosPantalla, resolverPromesa } = useGameStore();
  const isConfirmar = datosPantalla?.modo === 'confirmar_avance';
  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-indigo-900 text-white font-pixel">
      {isConfirmar ? (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <h2 className="text-3xl font-bold mb-10">Fin de la Semana</h2>
            <button onClick={() => resolverPromesa('')} className="w-full max-w-sm py-4 bg-green-500 hover:bg-green-400 rounded-xl font-bold mb-4">Siguiente Semana</button>
            <button onClick={() => resolverPromesa('salir')} className="w-full max-w-sm py-4 bg-red-500 hover:bg-red-400 rounded-xl font-bold">Abandonar Partida</button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mt-10 mb-2 text-indigo-300">¡Mes Completado!</h2>
          <p className="text-lg text-indigo-200 mb-8">Etapa: {datosPantalla?.stage}</p>
          
          <div className="w-full max-w-sm bg-indigo-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between border-b border-indigo-700 pb-2">
              <span className="text-indigo-300">HP (Salud):</span>
              <span className="font-bold text-green-400">{datosPantalla?.stats?.hp}</span>
            </div>
            <div className="flex justify-between border-b border-indigo-700 pb-2">
              <span className="text-indigo-300">Score Crediticio:</span>
              <span className="font-bold text-emerald-400">{datosPantalla?.stats?.score}</span>
            </div>
            <div className="flex justify-between border-b border-indigo-700 pb-2">
              <span className="text-indigo-300">Calidad Vida:</span>
              <span className="font-bold text-orange-400">{datosPantalla?.stats?.cv}</span>
            </div>
            <div className="flex justify-between border-b border-indigo-700 pb-2">
              <span className="text-indigo-300">Deuda Fin de Mes:</span>
              <span className="font-bold text-red-400">-${datosPantalla?.stats?.pagoNoIntereses?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold text-sm mt-1">Siguiente Ingreso:</span>
              <span className="font-bold text-xl text-green-300">+${datosPantalla?.stats?.nuevoIngreso?.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-auto mb-10 w-full max-w-sm text-center">
             <p className="text-indigo-300 animate-pulse text-sm">Avanzando automáticamente...</p>
          </div>
        </>
      )}
    </div>
  );
}
