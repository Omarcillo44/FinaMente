import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function SeleccionPersonajesView() {
  const cambiarEscena = useGameStore(state => state.cambiarEscena);
  const setPersonajeSeleccionado = useGameStore(state => state.setPersonajeSeleccionado);
  const personajeStore = useGameStore(state => state.personajeSeleccionado);
  
  const [seleccionado, setSeleccionado] = useState(personajeStore || 'Clemente');

  const confirmarPersonaje = () => {
    setPersonajeSeleccionado(seleccionado);
    cambiarEscena('SeleccionDificultad');
  };

  const personajes = ['Clemente', 'Josefina'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 font-pixel text-white p-6 relative">
      <button 
        onClick={() => cambiarEscena('Inicio')}
        className="absolute top-6 left-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 border border-slate-500 z-10 transition-transform active:scale-95">
        &lt; Volver
      </button>

      <h2 className="text-3xl lg:text-4xl text-indigo-300 mb-3 drop-shadow-md text-center">Elige tu Avatar</h2>
      <p className="text-slate-400 mb-10 text-center text-xs lg:text-sm max-w-sm hidden sm:block">
        Tus responsabilidades financieras serán idénticas, pero cada quien tiene su propio estilo de vida.
      </p>

      <div className="flex w-full items-center justify-center mb-12" style={{ gap: '40px' }}>
        {personajes.map(personaje => {
          const isSelected = seleccionado === personaje;
          return (
            <div 
              key={personaje}
              onClick={() => setSeleccionado(personaje)}
              className={`relative cursor-pointer transition-all duration-300 transform ${isSelected ? 'scale-110 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'scale-90 opacity-70 hover:opacity-100 hover:scale-100'}`}
            >
              <div 
                className={`rounded-xl flex flex-col items-center justify-center border-4 ${isSelected ? 'border-indigo-500 bg-indigo-950/40' : 'border-slate-700 bg-slate-800'} overflow-hidden relative`}
                style={{ width: '180px', height: '240px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
                <img 
                  src={`${import.meta.env.BASE_URL}sprites/${personaje}/down-0.png`} 
                  alt={personaje} 
                  className="w-24 h-24 md:w-32 md:h-32 object-contain z-10 animate-bounce [animation-duration:2s]"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => { e.target.src = ''; e.target.className = 'w-24 h-24 bg-gray-500 rounded-full z-10'; }}
                />
              </div>

              <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold border-2 ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-700 border-slate-500 text-slate-300'}`}>
                {personaje}
              </div>

              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20 animate-pulse">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center">
        <button 
          onClick={confirmarPersonaje} 
          className="px-10 py-4 bg-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-500 transition-transform active:scale-95 shadow-lg border-b-4 border-emerald-800 active:border-b-0">
          Confirmar Personaje
        </button>
      </div>
    </div>
  );
}
