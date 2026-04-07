import React from 'react';

export default function BancaMovilView() {
  return (
    <div className="w-full h-full flex flex-col bg-slate-100 text-slate-800 p-6">
      <div className="w-full max-w-md mx-auto h-full flex flex-col bg-white shadow-xl rounded-t-3xl overflow-hidden border border-slate-200 mt-8 relative">
        <div className="bg-indigo-700 text-white p-6 rounded-b-3xl shadow-md z-10">
          <h2 className="text-2xl font-bold">Mi Banca</h2>
          <p className="text-sm opacity-80 mt-1">Saldo Disponible</p>
          <p className="text-4xl font-bold mt-2">$2,450.00</p>
        </div>
        
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <h3 className="font-bold text-slate-600">Acciones</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100 active:scale-95 transition-transform cursor-pointer">
              <div className="w-10 h-10 bg-indigo-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-indigo-800">Transferir</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100 active:scale-95 transition-transform cursor-pointer">
              <div className="w-10 h-10 bg-emerald-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-emerald-800">Pagar Deuda</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-100 active:scale-95 transition-transform cursor-pointer">
              <div className="w-10 h-10 bg-amber-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-amber-800">Invertir</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100 active:scale-95 transition-transform cursor-pointer">
              <div className="w-10 h-10 bg-red-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-red-800">Préstamo</p>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-600 mt-6 pt-4 border-t border-slate-100">Movimientos Recientes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Cobro Nómina</p>
                <p className="text-xs text-slate-400">Hoy 09:00 AM</p>
              </div>
              <p className="text-emerald-500 font-bold">+$4,000.00</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Pago de Luz</p>
                <p className="text-xs text-slate-400">Ayer 15:30</p>
              </div>
              <p className="text-red-500 font-bold">-$450.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
