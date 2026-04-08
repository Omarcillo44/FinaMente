import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function SharedHUD() {
  const headers = useGameStore((state) => state.headers);

  return (
    <div className="absolute top-0 left-0 w-full bg-slate-900/80 text-slate-100 p-2 md:p-4 z-50 flex items-center justify-between border-b border-white/20 select-none shadow-lg backdrop-blur-sm shadow-black/50 font-pixel text-xs md:text-sm">

      <div className="flex items-center space-x-2">
        <span className="font-pixel text-gray-400">Status:</span>
        <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-md border border-white/10">
          <span className="text-emerald-400 font-pixel">HP:</span>
          <span>{headers?.hp ?? 100}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-md border border-white/10">
          <span className="text-red-400 font-pixel">TDC:</span>
          <span>${parseFloat(headers?.saldoInsoluto || 0).toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-md border border-white/10">
          <span className="text-emerald-300 font-pixel">Efectivo:</span>
          <span>${parseFloat(headers?.efectivoDisponible || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-gray-300">
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">Stage:</span>
          <span className="font-pixel text-white">{headers?.stageActual ?? 1}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1">
          <span className="text-gray-400">Semana:</span>
          <span className="font-pixel text-white">{headers?.semanaActual ?? 1}</span>
        </div>
      </div>

    </div>
  );
}
