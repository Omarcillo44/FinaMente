import React from 'react';
import { iniciarMusicaGlobal } from '../../core/AudioGlobal';

import { useGameStore } from '../../store/gameStore';

export default function InicioView() {
  const cambiarEscena = useGameStore(state => state.cambiarEscena);

  const manejarInicio = () => {
    // 1. Iniciamos la música
    iniciarMusicaGlobal();
    // 2. Avanzamos al siguiente menú del pre-juego
    cambiarEscena('SeleccionPersonajes');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <h1 className="text-5xl font-pixel mb-8 text-blue-400">FINAMENTE</h1>
      <button 
          onClick={manejarInicio}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-pixel text-lg transition-colors"
        ></button>
      <div className="space-y-4 w-full max-w-xs">
        <button onClick={manejarInicio} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-pixel text-lg transition-colors">Iniciar Aventura</button>
        <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded font-pixel text-lg transition-colors">Opciones</button>
      </div>
      <p className="mt-8 text-sm text-gray-400">Demo Version</p>
    </div>
  );
}
