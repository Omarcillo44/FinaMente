import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import Texto2D from '../ui/Texto2D';

// const URL_ESCENARIO = '/models/Escenario_Escuela.glb';
const URL_ESCENARIO = `${import.meta.env.BASE_URL}models/Escenario_Escuela.glb`;

function EscenarioEscuelaModel() {
  // 2. El Hook carga el modelo usando la variable
  const { scene } = useGLTF(URL_ESCENARIO);
  return <primitive object={scene} scale={1} />;
}

export default function BatallaView() {
  const { datosPantalla, resolverPromesa, headers } = useGameStore();
  const modo = datosPantalla?.modo;
  const gastoObj = datosPantalla?.gasto;

  return (
    <div className="w-full h-full relative bg-slate-900">
      {/* Contenedor del Hub/UI (HP ENCABEZADO) */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none flex justify-between items-start">
        {/* HP Jugador */}
        <div className="w-1/3">
          <p className="text-white font-pixel text-xs mb-1 drop-shadow-md">Tú (HP: {headers.hp})</p>
          <div className="h-3 w-full bg-slate-700 border-2 border-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, headers.hp)}%`}}></div>
          </div>
        </div>

        <div className="bg-red-600 text-white font-pixel px-3 py-1 rounded shadow drop-shadow-md text-sm">
          VS
        </div>

        {/* Info Enemigo */}
        <div className="w-1/3 items-end flex flex-col text-right">
          <p className="text-white font-pixel text-xs mb-1 drop-shadow-md">{gastoObj?.nombre || 'Gasto'}</p>
          <p className="text-red-400 font-pixel text-sm drop-shadow-md">${gastoObj?.monto || 0}</p>
        </div>
      </div>

      {/* Controles de Batalla Abajo */}
      <div className="absolute bottom-0 left-0 w-full z-10 p-4 pb-20 pointer-events-none">
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-4 flex flex-col gap-3 pointer-events-auto shadow-xl">
          <p className="text-slate-300 text-sm font-pixel text-center mb-1">
            {modo === 'msi' ? '¿A cuántos meses?' : modo === 'retiroObligatorio' ? '¿Deseas retirar efectivo para este gasto obligatorio?' : '¿Cómo deseas pagar?'}
          </p>
          <div className="grid grid-cols-2 gap-2 font-pixel">
            {modo === 'msi' ? (
              datosPantalla.opcionesCuotas?.map(cuota => (
                <button key={cuota} onClick={() => resolverPromesa(cuota)} className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm">{cuota} Meses</button>
              ))
            ) : modo === 'retiroObligatorio' ? (
              <>
                <button onClick={() => resolverPromesa({ monto: gastoObj?.monto })} className="bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-sm">Disponer Efectivo</button>
                <button onClick={() => resolverPromesa(null)} className="bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg text-sm">Rendirse</button>
              </>
            ) : (
              <>
                <button onClick={() => resolverPromesa('d')} className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm">
                  Débito (${datosPantalla.estadoVirtual?.efectivoDisponible})
                </button>
                <button onClick={() => resolverPromesa('t')} className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm">
                  Crédito (${datosPantalla.estadoVirtual?.creditoDisponible})
                </button>
                <button onClick={() => resolverPromesa('m')} className="bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm">MSI</button>
                {datosPantalla?.puedeIgnorar && (
                  <button onClick={() => resolverPromesa('i')} className="bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg text-sm">Ignorar</button>
                )}
                <button onClick={() => resolverPromesa('p')} className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm col-span-2">Banca Móvil</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Renderizado 3D */}
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <EscenarioEscuelaModel />
          {/* Mostramos Texto2D flotando en el entorno del jefe */}
          {gastoObj && (
            <Texto2D 
              text={gastoObj.nombre}
              position={[0, 4, 0]} 
              color="red" 
              fontSize={1.5} 
            />
          )}
        </Suspense>
        {/* Usamos OrbitControls temporalmente para ver la escena en el demo */}
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 4} enableZoom={false} />
      </Canvas>
    </div>
  );
}

// 3. Precargas EXACTAMENTE la misma variable aquí abajo para evitar errores 404
useGLTF.preload(URL_ESCENARIO);