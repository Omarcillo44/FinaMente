import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import StatusFeedback from '../ui/StatusFeedback';

export default function BancaMovilView() {
  const { datosPantalla, resolverPromesa, setMantenerBancaAbierta } = useGameStore();
  const banca = datosPantalla || {};
  const [montoCustom, setMontoCustom] = useState('');
  const [montoRetiro, setMontoRetiro] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null); // 'exito' | 'peligro'
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const procesarPago = (tipoPago, monto) => {
    const m = parseFloat(monto);
    if (isNaN(m) || m < 1) {
      setFeedbackMsg("El monto debe ser\nmayor a $0.00");
      setFeedbackState('peligro');
      setTimeout(() => setFeedbackState(null), 2000);
      return;
    }
    
    // Pre-validación local para la UI dual
    if (m <= banca.efectivoDisponible) {
      setFeedbackState('exito');
      setMantenerBancaAbierta(true); // Engañamos al motor para que reabra la banca en el sig ciclo
      setTimeout(() => resolverPromesa({ tipo: tipoPago, monto: m }), 1500);
    } else {
      setFeedbackMsg("Fondos insuficientes\nen tu saldo efectivo.");
      setFeedbackState('peligro');
      setTimeout(() => setFeedbackState(null), 2000);
    }
  };

  const solicitarRetiro = () => {
    const m = parseFloat(montoRetiro);
    if (isNaN(m) || m < 1) {
      setFeedbackMsg("El monto a retirar debe ser\nmayor a $0.00");
      setFeedbackState('peligro');
      setTimeout(() => setFeedbackState(null), 2000);
      return;
    }
    
    // Pre-validación local del límite máximo
    if (m > (banca.maxRetiro || 0)) {
        setFeedbackMsg("El monto excede tu\nlímite permitido hoy.");
        setFeedbackState('peligro');
        setTimeout(() => setFeedbackState(null), 2000);
        return;
    }
    setShowWarning(true);
  };

  const confirmarRetiro = () => {
    setShowWarning(false);
    setFeedbackState('exito');
    setMantenerBancaAbierta(true); // Reabre la banca después del retiro
    setTimeout(() => resolverPromesa({ tipo: 'RETIRO', monto: parseFloat(montoRetiro) }), 1500);
  };

  const handleCerrarBanca = () => {
    setMantenerBancaAbierta(false); // Rompemos el ciclo del store
    resolverPromesa({ tipo: 'CANCELAR' });
  };

  // PANTALLA INTRA-VIEW DE STATUS ANIMADO
  if (feedbackState) {
    return (
       <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md z-[100] pointer-events-auto">
           <div className="bg-white px-12 py-10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center animate-fade-in-up">
               <StatusFeedback tipo={feedbackState} />
               {feedbackState === 'peligro' && <p className="mt-4 text-red-500 font-pixel text-xs sm:text-sm text-center font-bold whitespace-pre-wrap">{feedbackMsg}</p>}
           </div>
       </div>
    );
 }

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-900/60 backdrop-blur-md text-slate-800 p-6 z-[100] font-pixel pointer-events-auto">
      <div className="w-full max-w-md mx-auto h-[90%] flex flex-col bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 mt-6 relative animate-fade-in-up">
        
        {/* HEADER */}
        <div className="bg-indigo-700 text-white p-6 rounded-b-3xl shadow-md z-10 font-pixel relative">
          <button onClick={handleCerrarBanca} className="absolute top-4 right-4 text-[10px] bg-indigo-800 px-2 py-1 rounded hover:bg-indigo-900 transition-colors">Volver</button>
          <h2 className="text-xl">Mi Banca Móvil</h2>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-[10px] opacity-80">Saldo Efectivo</p>
              <p className="text-3xl font-bold">${banca.efectivoDisponible?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-indigo-800/50 rounded-xl border border-white/10">
            <p className="text-[10px] opacity-80 uppercase tracking-tighter">Deuda en Tarjeta</p>
            <p className="text-xl text-red-300 font-bold">-${banca.saldoInsoluto?.toFixed(2) || '0.00'}</p>
            <div className="w-full bg-indigo-900 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-red-400 h-full" style={{ width: `${Math.min(100, (banca.saldoInsoluto / (banca.limiteCredito || 1)) * 100)}%` }}></div>
            </div>
            <p className="text-[8px] opacity-60 mt-1">Crédito libre: ${banca.creditoDisponible?.toFixed(2)} / ${banca.limiteCredito}</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-5 space-y-6 overflow-y-auto bg-slate-50">
          
          {/* SECCION PAGOS */}
          <div>
            <h3 className="text-xs text-slate-400 uppercase font-bold mb-3 px-1">Opciones de Pago</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => procesarPago('MINIMO', banca.pagoMinimo)}
                className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group shadow-sm">
                <div className="text-left">
                  <span className="block text-slate-500 text-[10px] uppercase">Pago Mínimo</span>
                  <span className="text-lg font-bold text-slate-800">${banca.pagoMinimo?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 text-indigo-500">→</div>
              </button>

              <button
                onClick={() => procesarPago('TOTAL', banca.pagoNoIntereses)}
                className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group shadow-sm">
                <div className="text-left">
                  <span className="block text-slate-500 text-[10px] uppercase font-bold text-emerald-600">Para No Generar Intereses</span>
                  <span className="text-lg font-bold text-slate-800">${banca.pagoNoIntereses?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 text-emerald-500">→</div>
              </button>

              <div className="flex flex-col gap-2 p-1">
                <p className="text-[10px] text-slate-400">Otro importe:</p>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Ej: 500" 
                    value={montoCustom} 
                    onChange={(e) => setMontoCustom(e.target.value)} 
                    className="flex-1 min-w-0 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                  <button
                    onClick={() => procesarPago('PARCIAL', montoCustom)}
                    className="px-4 flex-shrink-0 bg-slate-800 text-white rounded-xl text-xs hover:bg-slate-700 active:scale-95 transition-all">Pagar</button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-xs text-slate-400 uppercase font-bold mb-3 px-1">Disposición (Retiro)</h3>
            
            {showWarning ? (
              <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl animate-pulse">
                <p className="text-orange-800 text-xs font-bold text-center">⚠️ ADVERTENCIA DE COMISIÓN</p>
                <p className="text-orange-700 text-[10px] text-center mt-2">
                  Retirar ${parseFloat(montoRetiro).toFixed(2)} generará una comisión inmediata de **{banca.comisionPct || 0}%** sobre el total.
                </p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setShowWarning(false)} className="flex-1 py-3 flex-shrink-0 bg-slate-200 rounded-lg text-xs font-bold hover:bg-slate-300">Cancelar</button>
                  <button onClick={confirmarRetiro} className="flex-1 py-3 flex-shrink-0 bg-orange-600 text-white font-bold rounded-lg text-xs hover:bg-orange-700">¡Entendido!</button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[9px] text-slate-500 mb-2">Máximo permitido hoy: <span className="text-rose-600 font-bold">${banca.maxRetiro?.toFixed(2) || '0.00'}</span></p>
                <div className="flex gap-2 items-center">
                  <input 
                    type="number" 
                    placeholder="Monto a retirar" 
                    value={montoRetiro}
                    onChange={(e) => setMontoRetiro(e.target.value)}
                    className="flex-1 min-w-0 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" 
                  />
                  <button
                    onClick={solicitarRetiro}
                    className="px-4 py-3 flex-shrink-0 bg-rose-600 text-white rounded-xl text-xs hover:bg-rose-500 active:scale-95 transition-all font-bold">Retirar</button>
                </div>
                <p className="text-[8px] text-slate-400 mt-3 text-center">La disposición de efectivo afecta tu score crediticio.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
