import React from 'react';

export default function SeleccionDificultadView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <h2 className="text-3xl font-bold mb-10 text-orange-400">Selecciona la Dificultad</h2>
      <div className="flex flex-col space-y-6 w-full max-w-sm">
        <button className="bg-blue-600 p-6 rounded-xl hover:bg-blue-500 transition-transform active:scale-95 shadow-lg">
          <h3 className="text-2xl font-bold">Fácil</h3>
          <p className="text-sm text-blue-200 mt-2">(Con ayudas y consejos activados)</p>
        </button>
        <button className="bg-red-600 p-6 rounded-xl hover:bg-red-500 transition-transform active:scale-95 shadow-lg">
          <h3 className="text-2xl font-bold">Realidad Mexicana</h3>
          <p className="text-sm text-red-200 mt-2">(Sin margen de error financiero)</p>
        </button>
      </div>
    </div>
  );
}
