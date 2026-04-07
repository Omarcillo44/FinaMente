import React from 'react';

export default function SeleccionPersonajesView() {
  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-800 text-white p-6">
      <h2 className="text-3xl font-bold mt-10 mb-6">Selecciona tu Personaje</h2>
      <div className="flex-1 flex w-full items-center justify-center space-x-6">
        {/* Placeholder para Sprite 1 */}
        <div className="w-32 h-48 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 mb-2">Sprite</span>
          <p className="font-bold">Estudiante</p>
        </div>
        <p className="text-xl font-bold">VS</p>
        {/* Placeholder para Sprite 2 */}
        <div className="w-32 h-48 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 mb-2">Sprite</span>
          <p className="font-bold">Trabajador</p>
        </div>
      </div>
      <div className="h-1/5 flex items-center">
        <button className="px-8 py-3 bg-green-600 rounded font-bold text-lg hover:bg-green-500">Confirmar</button>
      </div>
    </div>
  );
}
