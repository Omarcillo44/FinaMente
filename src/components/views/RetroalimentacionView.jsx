import React from 'react';

export default function RetroalimentacionView() {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 bg-slate-900 text-slate-100">
      <h2 className="text-3xl font-bold mt-10 mb-6 text-emerald-400">Análisis Financiero</h2>
      
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-left">
        <div>
          <h3 className="font-bold text-xl text-yellow-400 mb-2">Puntos de Mejora</h3>
          <p className="text-sm text-slate-300 bg-slate-700 p-3 rounded-lg border-l-4 border-yellow-500">
            Tus "Gastos Hormiga" (cafés, snacks, suscripciones sin usar) constituyeron el 25% de tu ingreso mensual este mes. Reducirlos al 10% te permitiría invertir más.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl text-emerald-400 mb-2">Aciertos</h3>
          <p className="text-sm text-slate-300 bg-slate-700 p-3 rounded-lg border-l-4 border-emerald-500">
            Mantuviste tu tarjeta de crédito por debajo del 30% de uso y pagaste el total para no generar intereses. ¡Excelente historial crediticio!
          </p>
        </div>
      </div>
      
      <button className="mt-auto mb-10 w-full max-w-sm py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg transition-transform active:scale-95 text-lg">
        Entendido
      </button>
    </div>
  );
}
