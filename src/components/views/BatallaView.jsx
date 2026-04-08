import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import Texto2D from '../ui/Texto2D';
import SharedHUD from '../ui/SharedHUD';
import BancaMovilView from './BancaMovilView';

// ESCENARIO GENERICO DE FALLBACK
const URL_ESCENARIO_FALLBACK = `${import.meta.env.BASE_URL}models/Escenario_Recamara.glb`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FallbackScene() {
  const { scene } = useGLTF(URL_ESCENARIO_FALLBACK);
  return <primitive object={scene} />;
}

function EscenarioDinamico({ localizacion }) {
  // Convertimos "CASA_OFICINA" a "Casa_Oficina", "ESCUELA" a "Escuela"
  const safeLoc = localizacion 
    ? localizacion.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('_')
    : 'Recamara';
    
  const URL = `${import.meta.env.BASE_URL}models/Escenario_${safeLoc}.glb`;

  // Activar directamente la carga dinámica que solicitaste:
  const { scene } = useGLTF(URL); 
  
  return <primitive object={scene} />;
}

export default function BatallaView() {
  const { datosPantalla, resolverPromesa } = useGameStore();

  // Extraemos la información del motor
  const mode = datosPantalla?.modo; // 'seleccionar_gasto' o 'combate_individual' o 'msi' ...
  const loc = datosPantalla?.localizacion || 'Combate';

  // Sprites
  const EmployeeSprite = `${import.meta.env.BASE_URL}sprites/empleado/right-0.png`; // Pose de batalla (derecha)
  const EnemySprite = `${import.meta.env.BASE_URL}sprites/enemigo_placeholder.png`;

  return (
    <div className="w-full h-full relative bg-black font-pixel">

      {/* SHARD HUD ARRIBA */}
      <SharedHUD />

      {/* OVERLAY BANCA MOVIL */}
      {datosPantalla?.modo === 'banca' && <BancaMovilView />}

      {/* --- CAPA 2D UI SUPERPUESTA AL CANVAS 3D --- */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">

        {/* Cabecera info (Abajo del HUD) */}
        <div className="mt-20 px-6 flex justify-between items-start w-full">
          <h2 className="bg-slate-900/80 px-6 py-3 rounded-lg text-red-400 font-bold text-2xl shadow-lg border border-red-900/50">
            🔥 {loc.toUpperCase()}
          </h2>
        </div>

        {/* Zona Central de Sprites 2D Flotantes */}
        <div className="flex-1 flex items-end justify-between px-10 md:px-32 pb-32">

          {/* Personaje (Izquierda) */}
          <div className="flex flex-col items-center">
            <img src={EmployeeSprite} alt="Jugador" className="w-48 h-48 sm:w-64 sm:h-64 object-contain animate-bounce [animation-duration:1.5s]"
              onError={(e) => { e.target.src = ''; e.target.className = 'w-32 h-32 bg-blue-500 rounded-full animate-bounce'; }} />
            <div className="mt-2 text-blue-300 font-bold bg-black/50 px-4 py-1 rounded">TÚ</div>
          </div>

          {/* Enemigos (Derecha) */}
          <div className="flex items-center space-x-6">

            {mode === 'seleccionar_gasto' && datosPantalla.gastos && datosPantalla.gastos.map((g, idx) => (
              <div key={idx} className="flex flex-col items-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                onClick={() => resolverPromesa && resolverPromesa(`${idx + 1}`)}>
                {/* Puedes poner un indicador de ataque (un cursor "Fight") */}
                <div className="text-white text-xs px-2 py-1 bg-red-600 mb-1 rounded font-bold animate-pulse">Atacar</div>
                <img src={EnemySprite} alt={g.nombre} className="w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                  onError={(e) => { e.target.src = ''; e.target.className = 'w-32 h-32 bg-red-500 rounded-full drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]'; }} />
                <div className="mt-2 text-red-200 bg-black/80 px-3 py-2 rounded text-center border border-red-500 w-full">
                  <p className="font-bold">{g.nombre}</p>
                  <p className="text-red-400 text-sm">${g.monto}</p>
                </div>
              </div>
            ))}

            {mode !== 'seleccionar_gasto' && datosPantalla?.gasto && (
              <div className="flex flex-col items-center">
                <img src={EnemySprite} alt={datosPantalla.gasto.nombre} className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                  onError={(e) => { e.target.src = ''; e.target.className = 'w-40 h-40 bg-red-600 rounded-full drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]'; }} />
                <div className="mt-2 text-red-200 bg-black/80 px-4 py-2 rounded text-center border border-red-500">
                  <p className="font-bold text-lg">{datosPantalla.gasto.nombre}</p>
                  <p className="text-red-400 font-bold">${datosPantalla.gasto.monto}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Decisiones (Abajo) */}
        <div className="w-full bg-slate-900 border-t-4 border-indigo-900 p-6 pointer-events-auto flex flex-col md:flex-row shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-20">
          <div className="flex-1 text-slate-300 pr-6 mb-4 md:mb-0 hidden md:block">
            <h3 className="text-indigo-400 text-lg font-bold mb-2">Mensaje del Sistema</h3>
            {mode === 'seleccionar_gasto' && <p>Múltiples gastos detectados en la zona. Selecciona a qué obligación financiera deseas enfrentarte o huye.</p>}
            {mode !== 'seleccionar_gasto' && datosPantalla?.gasto && <p>Te enfrentas a un cobro inminente. Elige tu método de resolución asumiendo las consecuencias de cada opción (Efectivo disponible o Deudas a Crédito).</p>}
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3 min-w-[300px]">

            {/* BOTONES SI ESTAMOS EN SELECCION MULTIPLE */}
            {mode === 'seleccionar_gasto' && (
              <>
                <div className="col-span-2 text-center text-sm text-gray-400 mb-2">Presiona sobre un Enemigo para Atacar</div>
                <button onClick={() => resolverPromesa && resolverPromesa('s')} className="col-span-2 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-transform active:scale-95 border border-slate-500 shadow-md">
                  🏃 HUIDA TÁCTICA (Salir del lugar)
                </button>
              </>
            )}

            {/* BOTONES SI ESTAMOS EN COMBATE INDIVIDUAL ESTANDAR */}
            {mode !== 'seleccionar_gasto' && !datosPantalla?.opcionesCuotas && datosPantalla?.gasto && (
              <>
                <button onClick={() => resolverPromesa && resolverPromesa('d')} className="py-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-emerald-100 font-bold shadow transition-transform active:scale-95 border border-emerald-500 flex flex-col items-center justify-center">
                  <span>💵 Pagar Débito</span>
                  <span className="text-xs font-normal opacity-70 mt-1">Usa Efectivo Disponible</span>
                </button>

                <button onClick={() => resolverPromesa && resolverPromesa('t')} className="py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-indigo-100 font-bold shadow transition-transform active:scale-95 border border-indigo-500 flex flex-col items-center justify-center">
                  <span>💳 Pagar TC</span>
                  <span className="text-xs font-normal opacity-70 mt-1">Aumenta Saldo Insoluto</span>
                </button>

                {/* Ignorar (si se permite) o MSI (si aplican) */}
                {datosPantalla?.puedeIgnorar ? (
                  <button onClick={() => resolverPromesa && resolverPromesa('i')} className="py-3 col-span-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg shadow border border-slate-600 transition-transform active:scale-95">
                    🛡️ Ignorar Gasto (-20 HP)
                  </button>
                ) : (
                  <button onClick={() => resolverPromesa && resolverPromesa('m')} className="py-3 col-span-2 bg-purple-700 hover:bg-purple-600 text-purple-100 font-bold rounded-lg shadow border border-purple-500 transition-transform active:scale-95">
                    🌟 Negociar a M.S.I.
                  </button>
                )}
              </>
            )}

            {/* BOTONES SI ESTAMOS ELIGIENDO MSI */}
            {mode === 'msi' && datosPantalla?.opcionesCuotas && (
              <div className="col-span-2 flex flex-col space-y-2">
                <p className="text-center text-purple-300 font-bold mb-2">Selecciona Mensualidades:</p>
                {datosPantalla.opcionesCuotas.map(cuota => (
                  <button key={cuota} onClick={() => resolverPromesa && resolverPromesa(cuota.toString())} className="py-3 bg-purple-700 hover:bg-purple-600 rounded-lg font-bold">
                    {cuota} Meses
                  </button>
                ))}
                <button onClick={() => resolverPromesa && resolverPromesa('c')} className="py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-gray-300">
                  Cancelar Negociación
                </button>
              </div>
            )}

            {/* BOTONES SI DEBE RETIRAR DE TARJETA OBLIGATORIAMENTE */}
            {mode === 'retiroObligatorio' && (
              <div className="col-span-2">
                <button onClick={() => resolverPromesa && resolverPromesa('y')} className="w-full py-4 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold mb-2">
                  Pagar Asumiendo Comisión ({datosPantalla.maxRetiro})
                </button>
                <button onClick={() => resolverPromesa && resolverPromesa('n')} className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg font-bold">
                  Aceptar Game Over
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- CAPA FONDO 3D (CANVAS) --- */}
      <Canvas camera={{ position: [25, 20, 50], fov: 50 }} className="absolute inset-0 z-0 opacity-40">
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        <ErrorBoundary fallback={
          <Suspense fallback={null}>
            <FallbackScene />
          </Suspense>
        }>
          <Suspense fallback={null}>
            <EscenarioDinamico localizacion={loc} />
          </Suspense>
        </ErrorBoundary>

        {/* Texto 3D del Gasto individual */}
        {mode !== 'seleccionar_gasto' && datosPantalla?.gasto && (
          <Texto2D texto={`!${datosPantalla.gasto.nombre}!`} posicion={[0, 5, 0]} />
        )}

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}