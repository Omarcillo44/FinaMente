import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import PersonajeController from './PersonajeController';
import Joystick from './Joystick';

// const URL_MAPA ='/models/Mapa.glb';
const URL_MAPA = `${import.meta.env.BASE_URL}models/Mapa.glb`;

function MapaModel() {
  const { scene } = useGLTF(URL_MAPA);
  // Rotado 90 grados (Math.PI / 2) en el eje Y
  return <primitive object={scene} scale={1} rotation={[0, 3 * Math.PI / 2, 0]} />;
}

// Puedes editar estos valores para acomodar a tu gusto al personaje en el "verdadero centro" visual del mapa.
const SPAWN_X = 131;
const SPAWN_Z = 127;
const ALTURA_PISO = 1;

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
      

      {/* Controles de Movimiento - Joystick */}
      <div className="absolute bottom-10 right-10 z-10 pointer-events-auto select-none opacity-80 hover:opacity-100 transition-opacity">
        <Joystick
          onChange={({ x, y }) => {
            setInputs(prev => ({
              ...prev,
              up: y < -0.3,
              down: y > 0.3,
              left: x < -0.3,
              right: x > 0.3
            }));
          }}
        />
      </div>

      {/* Renderizado 3D */}
      <Canvas camera={{ position: [0, 5, 10], fov: 100 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <MapaModel />
          {/* Personaje en las coordenadas definidas al inicio */}
          <PersonajeController position={[SPAWN_X, ALTURA_PISO, SPAWN_Z]} inputs={inputs} />
        </Suspense>

      </Canvas>
    </div>
  );
}

// Para precargar el modelo asíncronamente
useGLTF.preload(URL_MAPA);
