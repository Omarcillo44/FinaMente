import React from 'react';

export default function CreditosView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 text-center">
      <h2 className="text-3xl font-pixel mb-10 text-yellow-500">Créditos</h2>
      <div className="space-y-6 text-lg">
        <p><span className="text-gray-400">Desarrollo:</span><br />Equipo Nibble's</p>
        <p><span className="text-gray-400">Integrantes:</span><br /> AlvaroMkoko <br /> Omarcillo44 <br /> TakedaTakeishi <br /> dPaolaMon <br /> Gomanola </p>
        <p><span className="text-gray-400">Música y SFX:</span><br />Original Soundtrack</p>
      </div>
      <p className="mt-12 text-sm font-pixel text-gray-500">Demo interactiva para Talent Land 2026</p>
    </div>
  );
}
