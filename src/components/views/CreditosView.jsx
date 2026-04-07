import React from 'react';

export default function CreditosView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 text-center">
      <h2 className="text-3xl font-bold mb-10 text-yellow-500">Créditos</h2>
      <div className="space-y-6 text-lg">
        <p><span className="text-gray-400">Desarrollo:</span><br/>Equipo Finamente</p>
        <p><span className="text-gray-400">Arte 3D y Sprites:</span><br/>Talent Land 2026</p>
        <p><span className="text-gray-400">Música y SFX:</span><br/>Original Soundtrack</p>
      </div>
      <p className="mt-12 text-sm italic text-gray-500">Demo interactiva para Talent Land 2026</p>
    </div>
  );
}
