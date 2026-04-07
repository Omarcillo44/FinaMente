import React from 'react';

export default function GameOverView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-red-950 text-white p-6 text-center">
      <h1 className="text-6xl font-bold mb-4 text-red-600 drop-shadow-lg">BANCARROTA</h1>
      <p className="text-xl text-red-200 mb-10">Tus deudas superaron tus ingresos.</p>
      
      <div className="bg-red-900 bg-opacity-50 p-6 rounded-xl border border-red-800 max-w-xs mb-10 text-left">
        <p className="mb-2"><span className="text-red-400 font-bold">Causa:</span> Exceso de intereses por créditos no pagados a tiempo.</p>
        <p><span className="text-red-400 font-bold">Mes:</span> 4 (Abril)</p>
      </div>

      <button className="px-8 py-3 bg-red-700 hover:bg-red-600 rounded font-bold text-lg transition-colors">
        Reintentar
      </button>
      <button className="px-8 py-3 bg-transparent text-red-400 mt-4 underline text-sm">
        Volver al Menú
      </button>
    </div>
  );
}
