import React from 'react';

export default function StatusFeedback({ tipo = 'exito' }) {
  const isSuccess = tipo === 'exito' || tipo === 'titulo';
  const isError = tipo === 'peligro';
  const isInfo = tipo === 'info' || tipo === 'alerta' || tipo === 'aviso';

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none">
      <div className={`relative w-20 h-20 flex items-center justify-center rounded-full border-4 shadow-lg animate-fade-in-down
        ${isSuccess ? 'border-emerald-500 bg-emerald-500/10' : ''}
        ${isError ? 'border-red-500 bg-red-500/10' : ''}
        ${isInfo ? 'border-blue-500 bg-blue-500/10' : ''}
      `}>
        
        {isSuccess && (
          <svg className="w-12 h-12 text-emerald-500 animate-[bounce_0.5s_ease-in-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}

        {isError && (
          <svg className="w-12 h-12 text-red-500 animate-[pulse_0.5s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}

        {isInfo && (
          <svg className="w-12 h-12 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      <div className={`mt-4 text-center font-bold font-pixel uppercase tracking-widest
        ${isSuccess ? 'text-emerald-400' : ''}
        ${isError ? 'text-red-400' : ''}
        ${isInfo ? 'text-blue-300' : ''}
      `}>
        {isSuccess ? 'Operación Exitosa' : isError ? 'Operación Denegada' : 'Aviso del Sistema'}
      </div>
    </div>
  );
}
