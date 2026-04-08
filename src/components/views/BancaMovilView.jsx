import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function BancaMovilView() {
  const { datosPantalla, resolverPromesa } = useGameStore();
  const banca = datosPantalla || {};
  const [montoCustom, setMontoCustom] = useState('');
  return (
    <div className="w-full h-full flex flex-col bg-slate-100 text-slate-800 p-6">
      <div className="w-full max-w-md mx-auto h-full flex flex-col bg-white shadow-xl rounded-t-3xl overflow-hidden border border-slate-200 mt-8 relative">
        <div className="bg-indigo-700 text-white p-6 rounded-b-3xl shadow-md z-10 font-pixel relative">
          <button onClick={() => resolverPromesa({ tipo: 'CANCELAR' })} className="absolute top-4 right-4 text-xs font-pixel bg-indigo-800 px-2 py-1 rounded">Volver</button>
          <h2 className="text-2xl font-bold">Mi Banca</h2>
          <p className="text-xs opacity-80 mt-2">Saldo Efectivo:</p>
          <p className="text-3xl font-bold mt-1">${banca.efectivoDisponible?.toFixed(2) || '0.00'}</p>
          <div className="mt-4 p-3 bg-indigo-800 rounded-lg shadow-inner">
            <p className="text-xs opacity-80">Deuda Tarjeta Crédito:</p>
            <p className="text-2xl font-bold text-red-200">-${banca.saldoInsoluto?.toFixed(2) || '0.00'}</p>
            <p className="text-xs opacity-80 mt-1">Crédito libre: ${banca.creditoDisponible?.toFixed(2) || '0.00'} / ${banca.limiteCredito}</p>
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <h3 className="font-bold text-slate-600 font-pixel">Pago de Tarjeta</h3>
          <div className="flex flex-col space-y-3 font-pixel text-sm">
            <button 
              onClick={() => resolverPromesa({ tipo: 'MINIMO'})}
              className="bg-indigo-100 p-3 rounded-xl border border-indigo-200 hover:bg-indigo-200 text-left transition-colors">
              <span className="font-bold block text-indigo-900">Pago Mínimo</span>
              <span className="text-indigo-800">${banca.pagoMinimo?.toFixed(2) || '0.00'}</span>
            </button>
            <button 
              onClick={() => resolverPromesa({ tipo: 'TOTAL'})}
              className="bg-emerald-100 p-3 rounded-xl border border-emerald-200 hover:bg-emerald-200 text-left transition-colors">
              <span className="font-bold block text-emerald-900">Pagar para NO generar intereses</span>
              <span className="text-emerald-800">${banca.pagoNoIntereses?.toFixed(2) || '0.00'}</span>
            </button>
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex gap-2">
              <input type="number" placeholder="Monto" value={montoCustom} onChange={(e) => setMontoCustom(e.target.value)} className="w-1/2 p-2 rounded border border-slate-300" />
              <button 
                onClick={() => resolverPromesa({ tipo: 'PARCIAL', monto: parseFloat(montoCustom)})}
                className="w-1/2 bg-slate-800 text-white rounded font-bold hover:bg-slate-700">Otro Monto</button>
            </div>
            
            <h3 className="font-bold text-slate-600 font-pixel mt-4">Disposición de Efectivo</h3>
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 flex flex-col gap-2">
              <p className="text-rose-800 text-xs text-balance">Retirar te cobra una comisión inmediata del {banca.comisionPct || '0'}%. Máximo retirable: ${banca.maxRetiro?.toFixed(2) || '0.00'}</p>
              <button 
                onClick={() => resolverPromesa({ tipo: 'RETIRO', monto: banca.maxRetiro})}
                className="bg-rose-600 text-white py-2 rounded font-bold hover:bg-rose-500">Retirar Máximo</button>
            </div>
          </div>
          
          {/* Movimientos quitados temporalmente ya que el motor usa Promesas planas en este panel */}
        </div>
      </div>
    </div>
  );
}
