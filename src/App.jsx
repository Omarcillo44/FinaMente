import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';

// Vistas
import InicioView from './components/views/InicioView';
import CreditosView from './components/views/CreditosView';
import SeleccionPersonajesView from './components/views/SeleccionPersonajesView';
import VideoPersonajeView from './components/views/VideoPersonajeView';
import SeleccionDificultadView from './components/views/SeleccionDificultadView';
import MapaView from './components/views/MapaView';
import BatallaView from './components/views/BatallaView';
import BancaMovilView from './components/views/BancaMovilView';
import ResumenStageView from './components/views/ResumenStageView';
import RetroalimentacionView from './components/views/RetroalimentacionView';
import GameOverView from './components/views/GameOverView';

export default function App() {
  const escenaActual = useGameStore(state => state.escenaActual);

  const renderScene = () => {
    switch (escenaActual) {
      case 'Inicio': return <InicioView />;
      case 'Creditos': return <CreditosView />;
      case 'SeleccionPersonajes': return <SeleccionPersonajesView />;
      case 'VideoPersonaje': return <VideoPersonajeView />;
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

  return (
    <div className="w-full h-full relative overflow-hidden bg-black text-white font-pixel select-none touch-none">

      {/* Contenedor Principal (Donde se dibuja cada vista) */}
      <div className="w-full h-full">
        {renderScene()}
      </div>

    </div>
  );
}