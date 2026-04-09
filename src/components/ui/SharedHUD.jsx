import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function SharedHUD({ className = '' }) {
  const headers = useGameStore((state) => state.headers);

  return (
    <div className={`absolute top-0 left-0 w-full bg-slate-900/80 text-slate-100 p-3 md:p-4 z-50 flex flex-col gap-3 md:gap-4 border-b border-white/20 select-none shadow-lg backdrop-blur-sm shadow-black/50 font-pixel text-sm md:text-base lg:text-lg ${className}`}>
      
      {/* Renglón 1: Vida y Progreso */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2 bg-black/50 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <span className="text-emerald-400">HP:</span>
          <span className="font-pixel text-base md:text-xl lg:text-2xl">{headers?.hp ?? 100}</span>
        </div>
        
        <div className="flex items-center space-x-4 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Stage:</span>
            <span className="text-white font-bold">{headers?.stageActual ?? 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Sem:</span>
            <span className="text-white font-bold">{headers?.semanaActual ?? 1}</span>
          </div>
        </div>
      </div>

      {/* Renglón 2: Finanzas */}
      <div className="flex w-full items-center justify-between shadow-inner">
        <div className="flex flex-1 items-center justify-center space-x-2 bg-black/60 px-3 py-2 rounded-l-xl border border-r-0 border-red-500/30">
          <span className="text-red-400">TDC:</span>
          <span className="font-bold">${parseFloat(headers?.saldoInsoluto || 0).toFixed(2)}</span>
        </div>

        <div className="flex flex-1 items-center justify-center space-x-2 bg-black/60 px-3 py-2 rounded-r-xl border border-emerald-500/30">
          <span className="text-emerald-300">Efectivo:</span>
          <span className="font-bold">${parseFloat(headers?.efectivoDisponible || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
