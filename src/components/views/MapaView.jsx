import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import PersonajeController, { ZONAS_MAPA } from './PersonajeController';
import Joystick from './Joystick';
import SharedHUD from '../ui/SharedHUD';
import BancaMovilView from './BancaMovilView';
import { useGameStore } from '../../store/gameStore';

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
  const [showMisiones, setShowMisiones] = useState(false);
  const [showMapaImg, setShowMapaImg] = useState(false);

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

      {/* BOTONES PARA ABRIR CAJONES */}
      <div className="absolute top-20 left-4 z-50 flex flex-col space-y-2">
        <button
          onClick={() => setShowMisiones(!showMisiones)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg font-pixel shadow opacity-90 border border-indigo-400 text-left">
          📋 Tareas Pendientes
        </button>
        <button
          onClick={() => setShowMapaImg(!showMapaImg)}
          className="bg-sky-600 hover:bg-sky-500 text-white px-2 py-1 rounded-lg font-pixel shadow opacity-90 border border-sky-400 text-left">
          🗺️ Ver Mapa
        </button>
        <button
          onClick={() => resolverPromesa && resolverPromesa('p')}
          className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded-lg font-pixel shadow opacity-90 border border-purple-400 text-left">
          📱 Abrir Banca
        </button>
      </div>

      {/* LOG VISUAL DE COORDENADAS */}
      <div id="debug-coords" className="absolute bottom-4 left-4 z-50 bg-black/80 text-emerald-400 font-pixel text-xs p-2 rounded border border-emerald-500 pointer-events-none shadow-lg">
        X: - | Z: -
      </div>

      {/* DRAWER MISIONES */}
      {showMisiones && (
        <div className="absolute top-36 left-4 z-50 w-64 bg-slate-800/95 border border-slate-600 rounded-xl p-4 text-white shadow-xl backdrop-blur">
          <div className="flex justify-between items-start mb-3 border-b border-white/20 pb-2">
            <h3 className="text-xl text-indigo-300">Pendientes:</h3>
            <button onClick={() => setShowMisiones(false)} className="text-slate-400 hover:text-white font-bold bg-slate-700 hover:bg-slate-600 rounded px-2 py-0.5 text-base leading-none">×</button>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            {arrLocalizaciones.length === 0 && <li>Ninguna tarea pendiente.</li>}
            {arrLocalizaciones.map((loc, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="text-emerald-400">»</span> <span>Ir a {loc}</span>
              </li>
            ))}
            {/* Opción Banca Móvil siempre disponible según el motor */}
            <li className="flex items-center space-x-2 mt-4 pt-4 border-t border-white/10">
              <span className="text-sky-400">📱</span> <span>Opción: Banca Móvil</span>
              {/* Un atajo para no caminar hasta una hitbox ficticia */}
              <button onClick={() => resolverPromesa && resolverPromesa('p')} className="ml-auto text-xs bg-sky-700 px-2 py-1 flex-shrink-0 hover:bg-sky-600 rounded border border-white/20">Abrir</button>
            </li>
          </ul>
        </div>
      )}

      {/* DRAWER MAPA */}
      {showMapaImg && (
        <div className="absolute top-20 right-4 z-50 w-80 h-80 bg-slate-800/95 border border-slate-600 rounded-xl p-2 text-white shadow-xl backdrop-blur flex flex-col pointer-events-auto">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-center font-pixel text-sky-300">Croquis de la Zona</h3>
            <button onClick={() => setShowMapaImg(false)} className="text-slate-400 hover:text-white font-bold bg-slate-700 hover:bg-slate-600 rounded px-2 py-0.5 text-base leading-none">×</button>
          </div>
          <div className="flex-1 bg-slate-900 rounded border border-white/10 flex items-center justify-center overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}sprites/mapa_layout.png`} alt="Mapa" className="w-full h-full object-contain opacity-50" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = 'Sin textura'; }} />
          </div>
        </div>
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
      <div className="absolute bottom-10 right-10 z-50 pointer-events-auto select-none opacity-80 hover:opacity-100 transition-opacity">
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
