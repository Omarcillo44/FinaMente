import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import PersonajeController from './PersonajeController';

const URL_MAPA ='/models/Mapa.glb';

function MapaModel() {
  const { scene } = useGLTF(URL_MAPA);
  return <primitive object={scene} scale={1} />;
}

export default function MapaView() {
  // Estado que mantiene qué botones están presionados
  const [inputs, setInputs] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // Funciones para manejar la pulsación de los botones de la UI (tanto mouse como touch)
  const handleDown = (dir) => setInputs((prev) => ({ ...prev, [dir]: true }));
  const handleUp = (dir) => setInputs((prev) => ({ ...prev, [dir]: false }));

  // Soporte para teclado (opcional, pero mejora la experiencia de prueba)
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': handleDown('up'); break;
        case 's': case 'arrowdown': handleDown('down'); break;
        case 'a': case 'arrowleft': handleDown('left'); break;
        case 'd': case 'arrowright': handleDown('right'); break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': handleUp('up'); break;
        case 's': case 'arrowdown': handleUp('down'); break;
        case 'a': case 'arrowleft': handleUp('left'); break;
        case 'd': case 'arrowright': handleUp('right'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-blue-50">
      {/* Contenedor del Hub/UI Superior */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none flex justify-between items-start">
        <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-slate-200 pointer-events-auto">
          <p className="text-xs font-bold text-slate-500">Zona actual</p>
          <p className="text-lg font-bold text-slate-800">Centro Financiero</p>
        </div>
        <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-xl shadow-sm pointer-events-auto">
          <p className="text-sm font-bold">$2,450.00</p>
        </div>
      </div>

      {/* D-PAD / Controles de Movimiento - Botones Laterales Inferiores */}
      <div className="absolute bottom-10 right-10 z-10 pointer-events-auto flex flex-col items-center select-none">
        {/* Botón Arriba */}
        <button
          className={`w-14 h-14 bg-slate-800/80 text-white font-bold rounded-xl shadow-lg mb-2 flex items-center justify-center transition-all ${inputs.up ? 'scale-90 bg-slate-600' : ''}`}
          onMouseDown={() => handleDown('up')} onMouseUp={() => handleUp('up')} onMouseLeave={() => handleUp('up')}
          onTouchStart={() => handleDown('up')} onTouchEnd={() => handleUp('up')}
        >
          W
        </button>
        <div className="flex gap-2">
          {/* Botón Izquierda */}
          <button
            className={`w-14 h-14 bg-slate-800/80 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all ${inputs.left ? 'scale-90 bg-slate-600' : ''}`}
            onMouseDown={() => handleDown('left')} onMouseUp={() => handleUp('left')} onMouseLeave={() => handleUp('left')}
            onTouchStart={() => handleDown('left')} onTouchEnd={() => handleUp('left')}
          >
            A
          </button>
          {/* Botón Abajo */}
          <button
            className={`w-14 h-14 bg-slate-800/80 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all ${inputs.down ? 'scale-90 bg-slate-600' : ''}`}
            onMouseDown={() => handleDown('down')} onMouseUp={() => handleUp('down')} onMouseLeave={() => handleUp('down')}
            onTouchStart={() => handleDown('down')} onTouchEnd={() => handleUp('down')}
          >
            S
          </button>
          {/* Botón Derecha */}
          <button
            className={`w-14 h-14 bg-slate-800/80 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all ${inputs.right ? 'scale-90 bg-slate-600' : ''}`}
            onMouseDown={() => handleDown('right')} onMouseUp={() => handleUp('right')} onMouseLeave={() => handleUp('right')}
            onTouchStart={() => handleDown('right')} onTouchEnd={() => handleUp('right')}
          >
            D
          </button>
        </div>
      </div>

      {/* Renderizado 3D */}
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#e0f2fe']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <MapaModel />
          {/* Personaje central con sus controles y seguimiento de cámara */}
          <PersonajeController position={[0, 3, 0]} inputs={inputs} />
        </Suspense>

        {/* 
          Configuracion de la camara desde OrbitControls limitando movilidad a Z y X segun instruccion 
          Deshabilitamos Paneo (mover camara lateralmente a mano)
          Deshabilitamos Rotar (girar la vista a mano)
          Solo mantenemos Zoom y con limites de alejamiento/acercamiento
        */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={true}
          enableZoom={true}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}

// Para precargar el modelo asíncronamente
useGLTF.preload(URL_MAPA);
