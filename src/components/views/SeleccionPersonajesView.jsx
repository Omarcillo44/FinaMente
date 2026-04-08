import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function SeleccionPersonajesView() {
  const cambiarEscena = useGameStore(state => state.cambiarEscena);
  const setNombreJugador = useGameStore(state => state.setNombreJugador);

  const confirmarPersonaje = () => {
    setNombreJugador('personaje');
    cambiarEscena('SeleccionDificultad');
  };
  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-800 text-white p-6">
      <h2 className="text-3xl font-pixel mt-10 mb-6">Selecciona tu Personaje</h2>
      <div className="flex-1 flex w-full items-center justify-center space-x-6">
        {/* Placeholder para Sprite 1 */}
        <div className="w-32 h-48 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 mb-2">Sprite</span>
          <p className="font-pixel">Personaje 1</p>
        </div>
        <p className="text-xl font-bold">VS</p>
        {/* Placeholder para Sprite 2 */}
        <div className="w-32 h-48 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 mb-2">Sprite</span>
          <p className="font-pixel">Personaje 2</p>
        </div>
      </div>
      <div className="h-1/5 flex items-center">
        <button onClick={confirmarPersonaje} className="px-8 py-3 bg-green-600 rounded font-pixel text-lg hover:bg-green-500">Confirmar</button>
      </div>
    </div>
  );
}
