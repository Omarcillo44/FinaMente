import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function CreditosView() {
  const cambiarEscena = useGameStore(state => state.cambiarEscena);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 text-center relative">
      <button 
        onClick={() => cambiarEscena('Inicio')}
        className="absolute top-6 left-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded font-pixel text-sm text-gray-300 border border-slate-600">
        &lt; Volver
      </button>
      <h2 className="text-3xl font-pixel mb-10 text-yellow-500">Créditos</h2>
      <div className="space-y-6 text-lg">
        <p><span className="text-gray-400">Desarrollo:</span><br />Equipo Nibble's</p>
        <p><span className="text-gray-400">Integrantes:</span><br /> AlvaroMkoko <br /> Omarcillo44 <br /> TakedaTakeishi <br /> dPaolaMon <br /> Gomanola </p>
        <p><span className="text-gray-400">Música y SFX:</span><br />Original Soundtrack</p>
      </div>
      <p className="mt-12 text-sm font-pixel text-gray-500">Demo interactiva para Talent Land 2026</p>
    </div>
  );
}
