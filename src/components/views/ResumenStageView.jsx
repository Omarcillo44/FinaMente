import React from 'react';

export default function ResumenStageView() {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-indigo-900 text-white">
      <h2 className="text-3xl font-bold mt-10 mb-2 text-indigo-300">¡Mes Completado!</h2>
      <p className="text-lg text-indigo-200 mb-8">Etapa 1: La Quincena</p>
      
      <div className="w-full max-w-sm bg-indigo-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex justify-between border-b border-indigo-700 pb-2">
          <span className="text-indigo-300">Ingresos:</span>
          <span className="font-bold text-green-400">+$12,000</span>
        </div>
        <div className="flex justify-between border-b border-indigo-700 pb-2">
          <span className="text-indigo-300">Gastos Fijos:</span>
          <span className="font-bold text-red-400">-$5,500</span>
        </div>
        <div className="flex justify-between border-b border-indigo-700 pb-2">
          <span className="text-indigo-300">Gastos Hormiga:</span>
          <span className="font-bold text-orange-400">-$2,100</span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="font-bold text-xl">Balance:</span>
          <span className="font-bold text-xl text-green-300">+$4,400</span>
        </div>
      </div>
      
      <div className="mt-auto mb-10 w-full max-w-sm">
        <button className="w-full py-4 bg-green-500 hover:bg-green-400 rounded-xl font-bold shadow-lg transition-transform active:scale-95 text-xl">
          Continuar al Siguiente Mes
        </button>
      </div>
    </div>
  );
}
