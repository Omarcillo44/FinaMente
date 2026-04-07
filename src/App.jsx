import React, { useEffect } from 'react';
import { useGameStore, DEMO_SCENES } from './store/gameStore';
import { iniciarMusicaGlobal } from './core/AudioGlobal';

// Vistas
import InicioView from './components/views/InicioView';
import CreditosView from './components/views/CreditosView';
import SeleccionPersonajesView from './components/views/SeleccionPersonajesView';
import SeleccionDificultadView from './components/views/SeleccionDificultadView';
import MapaView from './components/views/MapaView';
import BatallaView from './components/views/BatallaView';
import BancaMovilView from './components/views/BancaMovilView';
import ResumenStageView from './components/views/ResumenStageView';
import RetroalimentacionView from './components/views/RetroalimentacionView';
import GameOverView from './components/views/GameOverView';

export default function App() {
  const { escenaActual, irSiguienteEscena, irEscenaAnterior } = useGameStore();

  useEffect(() => {
    // Intentar reproducir música de fondo en cuanto la página se abre.
    // Nota: Los navegadores modernos bloquean el audio automático hasta que el
    // usuario interactúa con la pantalla (política de AutoPlay).
    iniciarMusicaGlobal();

    // Agregamos un fallback: al primer clic o pulsación de tecla, forzamos que inicie por si lo bloqueó.
    const iniciarConInteraccion = () => {
      iniciarMusicaGlobal();
      // Removemos el evento para que no se siga llamando
      window.removeEventListener('click', iniciarConInteraccion);
      window.removeEventListener('keydown', iniciarConInteraccion);
    };

    window.addEventListener('click', iniciarConInteraccion);
    window.addEventListener('keydown', iniciarConInteraccion);

    return () => {
      window.removeEventListener('click', iniciarConInteraccion);
      window.removeEventListener('keydown', iniciarConInteraccion);
    };
  }, []);

  const renderScene = () => {
    switch (escenaActual) {
      case 'Inicio': return <InicioView />;
      case 'Creditos': return <CreditosView />;
      case 'SeleccionPersonajes': return <SeleccionPersonajesView />;
      case 'SeleccionDificultad': return <SeleccionDificultadView />;
      case 'Mapa': return <MapaView />;
      case 'Batalla': return <BatallaView />;
      case 'BancaMovil': return <BancaMovilView />;
      case 'ResumenStage': return <ResumenStageView />;
      case 'Retroalimentacion': return <RetroalimentacionView />;
      case 'GameOver': return <GameOverView />;
      default: return <InicioView />;
    }
  };

  const currentIndex = DEMO_SCENES.indexOf(escenaActual);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black text-white font-sans select-none touch-none">
      
      {/* Contenedor Principal (Donde se dibuja cada vista) */}
      <div className="w-full h-full">
        {renderScene()}
      </div>

      {/* Controles de Navegación de Demo Flotantes */}
      <div className="fixed top-4 right-4 flex space-x-2 z-[9999]">
        <button 
          onClick={irEscenaAnterior}
          disabled={currentIndex === 0}
          className={`px-4 py-2 bg-blue-600 border border-blue-400 text-white rounded-lg shadow-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          ← Atrás
        </button>
        <button 
          onClick={irSiguienteEscena}
          disabled={currentIndex === DEMO_SCENES.length - 1}
          className={`px-4 py-2 bg-blue-600 border border-blue-400 text-white rounded-lg shadow-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          Adelante →
        </button>
      </div>
      
      <div className="fixed bottom-4 left-4 z-[9999] px-2 py-1 bg-black text-white text-xs rounded border border-gray-700 pointer-events-none">
        Escena: {escenaActual} ({currentIndex + 1}/{DEMO_SCENES.length})
      </div>
    
    </div>
  );
}