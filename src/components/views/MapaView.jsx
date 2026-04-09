import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import PersonajeController, { ZONAS_MAPA } from './PersonajeController';
import Joystick from './Joystick';
import SharedHUD from '../ui/SharedHUD';
import BancaMovilView from './BancaMovilView';
import CreditosView from './CreditosView';
import { useGameStore } from '../../store/gameStore';
import { pausarMusicaGlobal, reanudarMusicaGlobal, detenerMusicaGlobal } from '../../core/AudioGlobal';

const URL_MAPA = `${import.meta.env.BASE_URL}models/Mapa.glb`;

function EscenarioMapa() {
  const { scene } = useGLTF(URL_MAPA);
  // Rotación de 90° que tenías previamente
  return <primitive object={scene} rotation={[0, 3 * Math.PI / 2, 0]} />;
}

export default function MapaView() {
  const { datosPantalla, resolverPromesa, zonaBloqueada, setZonaBloqueada, posicionPersonaje } = useGameStore();
  const [inputs, setInputs] = useState({ up: false, down: false, left: false, right: false });

  // Drawers UI
  const [showMapaImg, setShowMapaImg] = useState(false);
  const [showPausa, setShowPausa] = useState(false);
  const [showCreditosOverlay, setShowCreditosOverlay] = useState(false);

  const handlePausar = () => {
    pausarMusicaGlobal();
    setShowPausa(true);
  };

  const handleReanudar = () => {
    reanudarMusicaGlobal();
    setShowPausa(false);
  };

  const handleSalirVoluntario = () => {
    detenerMusicaGlobal();
    setShowPausa(false);
    if (resolverPromesa) resolverPromesa('x');
  };

  const handleCreditos = () => {
    setShowCreditosOverlay(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setInputs((prev) => ({ ...prev, up: true })); break;
        case 's': setInputs((prev) => ({ ...prev, down: true })); break;
        case 'a': setInputs((prev) => ({ ...prev, left: true })); break;
        case 'd': setInputs((prev) => ({ ...prev, right: true })); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setInputs((prev) => ({ ...prev, up: false })); break;
        case 's': setInputs((prev) => ({ ...prev, down: false })); break;
        case 'a': setInputs((prev) => ({ ...prev, left: false })); break;
        case 'd': setInputs((prev) => ({ ...prev, right: false })); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const arrLocalizaciones = datosPantalla?.localizaciones || [];

  const handleCollision = (loc) => {
    // Compatibilidad motor vs zonas mapeadas:
    let resolucion = loc;
    if (loc === 'CASA') {
      resolucion = arrLocalizaciones.includes('RECAMARA') ? 'RECAMARA' : (arrLocalizaciones.includes('CASA_OFICINA') ? 'CASA_OFICINA' : loc);
    } else if (loc === 'OFICINA') {
      resolucion = arrLocalizaciones.includes('CASA_OFICINA') ? 'CASA_OFICINA' : loc;
    }

    // Cuando choca y es una zona válida pedida por el motor
    if (arrLocalizaciones.includes(resolucion) || resolucion === 'Banca Móvil') {
      setZonaBloqueada(loc); // Bloquear la zona física para que no vuelva a chocar inmediatamente
      const esBanca = resolucion === 'Banca Móvil' || resolucion === 'p';
      if (resolverPromesa) resolverPromesa(esBanca ? 'p' : resolucion);
    }
  };

  const handleZonaliberada = () => {
    setZonaBloqueada(null);
  };

  return (
    <div className="w-full h-full relative bg-slate-900 font-pixel">

      {/* HUD COMPARTIDO */}
      <SharedHUD />

      {/* OVERLAY BANCA MOVIL */}
      {datosPantalla?.modo === 'banca' && <BancaMovilView />}

      {/* MISIONES (Izquierda superior, fijas) */}
      <div className="absolute top-20 left-4 z-40 bg-slate-800/80 border border-slate-600 rounded-xl p-4 text-white shadow-xl backdrop-blur min-w-[200px] pointer-events-none">
          <h3 className="text-sm text-indigo-300 border-b border-white/20 pb-2 mb-2 font-bold uppercase tracking-widest">Pendientes</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {arrLocalizaciones.length === 0 && <li>Ninguna tarea pendiente.</li>}
            {arrLocalizaciones.map((loc, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="text-emerald-400">»</span> <span>Ir a {loc}</span>
              </li>
            ))}
          </ul>
      </div>

      {/* BOTONES DERECHA (Pausa, Croquis, Banca) */}
      <div className="absolute top-20 right-4 z-50 flex flex-col space-y-3 items-end">
        <button
          onClick={handlePausar}
          className="bg-red-700 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow opacity-90 border-2 border-red-500 text-sm active:scale-95 transition-transform tracking-tighter">
          ||
        </button>

        <button
          onClick={() => setShowMapaImg(!showMapaImg)}
          className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-lg font-pixel shadow border border-sky-400 text-xs transition-transform active:scale-95 flex items-center gap-2">
           🗺️ Croquis
        </button>

        <button
          onClick={() => resolverPromesa && resolverPromesa('p')}
          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg font-pixel shadow border border-purple-400 text-xs transition-transform active:scale-95 flex items-center gap-2">
           📱 Banca
        </button>
      </div>

      {/* LOG VISUAL DE COORDENADAS */}
      <div id="debug-coords" className="absolute bottom-4 left-4 z-50 bg-black/80 text-emerald-400 font-pixel text-xs p-2 rounded border border-emerald-500 pointer-events-none shadow-lg">
        X: - | Z: -
      </div>

      {/* DRAWER MAPA */}
      {showMapaImg && (
        <div className="absolute inset-0 z-50 pointer-events-auto" onClick={() => setShowMapaImg(false)}>
          <div className="absolute top-36 right-4 w-80 h-80 bg-slate-800/95 border border-slate-600 rounded-xl p-2 text-white shadow-xl backdrop-blur flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="text-center font-pixel text-sky-300">Croquis de la Zona</h3>
              <button onClick={() => setShowMapaImg(false)} className="text-slate-400 hover:text-white font-bold bg-slate-700 hover:bg-slate-600 rounded px-2 py-0.5 text-base leading-none">×</button>
            </div>
            <div className="flex-1 bg-slate-900 rounded border border-white/10 flex items-center justify-center overflow-hidden">
              <img src={`${import.meta.env.BASE_URL}sprites/mapa_layout.png`} alt="Mapa" className="w-full h-full object-contain opacity-50" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = 'Sin textura'; }} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL PAUSA */}
      {showPausa && (
        <div className="absolute inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-6 backdrop-blur-sm shadow-2xl">
          <h2 className="text-4xl text-white font-bold mb-10 tracking-widest text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">PAUSA</h2>
          <div className="flex flex-col space-y-5 w-full max-w-xs font-pixel">
            <button
              onClick={handleReanudar}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xl py-4 rounded-xl border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all">
              ▶️ Continuar
            </button>
            <button
              onClick={handleCreditos}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xl py-4 rounded-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all">
              🎨 Créditos
            </button>
            <button
              onClick={handleSalirVoluntario}
              className="w-full bg-red-800 hover:bg-red-700 text-white text-xl py-4 rounded-xl border-b-4 border-red-950 active:border-b-0 active:translate-y-1 transition-all mt-6">
              🚪 Salir Voluntariamente
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY DE CREDITOS (No destruye la escena 3D) */}
      {showCreditosOverlay && (
        <CreditosView onBack={() => setShowCreditosOverlay(false)} />
      )}

      {/* Renderizado 3D */}
      <Canvas camera={{ position: [0, 5, 10], fov: 100 }}>
        <color attach="background" args={['#8cf7ec']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <EscenarioMapa />

        {/* Las zonas activas ahora iteran sobre todas las posibles configuradas por ti */}
        <PersonajeController
          position={posicionPersonaje || [131, 1, 138]}
          inputs={inputs}
          activas={Object.keys(ZONAS_MAPA)}
          onCollision={handleCollision}
          zonaBloqueada={zonaBloqueada}
          onZonalibear={handleZonaliberada}
        />

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Controles de Movimiento - Joystick */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none opacity-80 hover:opacity-100 transition-opacity drop-shadow-xl">
        <Joystick
          onChange={({ x, y }) => {
            setInputs(prev => ({
              ...prev,
              up: y < -0.5,
              down: y > 0.5,
              right: x > 0.5,
              left: x < -0.5
            }));
          }}
        />
      </div>
    </div>
  );
}
