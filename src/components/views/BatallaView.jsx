import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import Texto2D from '../ui/Texto2D';
import SharedHUD from '../ui/SharedHUD';
import BancaMovilView from './BancaMovilView';
import StatusFeedback from '../ui/StatusFeedback';

// ---------------- CONSTANTES DE CÁMARA ----------------
const CAM_POS = [0, 15, 35];
const CAM_FOV = 100;
const LOOK_DIR = 0; // Ángulo constante (Rad) para orientar Sprites a cámara.
const ESCENARIO_FALLBACK = `${import.meta.env.BASE_URL}models/Escenario_Recamara.glb`;
const ENEMY_FALLBACK = `${import.meta.env.BASE_URL}sprites/enemigos/Placeholder_36.png`;

// Ajustes manuales del usuario para anular el pivote de Unity
const CENTROS_ESCENARIOS = {
  'Escuela': { x: -3, z: 10 },
  'Casa_Oficina': { x: -32, z: 45 },
  'Recamara': { x: -30, z: 4 }
};

// Control Global de Rotación del Escenario (270 grados = 1.5 PI)
const SCENE_ROTATION_Y = Math.PI * 1.5;

// ---------------- SUBSISTEMAS 3D ----------------

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function FallbackScene() {
  const { scene } = useGLTF(ESCENARIO_FALLBACK);
  const centro = CENTROS_ESCENARIOS['Recamara'];

  return (
    <group rotation={[0, SCENE_ROTATION_Y, 0]}>
      <primitive object={scene} position={[centro.x, 0, centro.z]} />
    </group>
  );
}

function EscenarioDinamico({ localizacion }) {
  const safeLoc = localizacion
    ? localizacion.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_')
    : 'Recamara';
  const URL = `${import.meta.env.BASE_URL}models/Escenario_${safeLoc}.glb`;
  const { scene } = useGLTF(URL);

  // Si el escenario no tiene dimensiones explícitas, asumimos que usa la Recamara por defecto
  const centro = CENTROS_ESCENARIOS[safeLoc] || CENTROS_ESCENARIOS['Recamara'];

  return (
    <group rotation={[0, SCENE_ROTATION_Y, 0]}>
      <primitive object={scene} position={[centro.x, 0, centro.z]} />
    </group>
  );
}

function JugadorCombate({ animAction, resolveCombat, targetEnemyPos }) {
  const personajeSeleccionado = useGameStore(state => state.personajeSeleccionado) || 'Clemente';
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const materialRef = useRef();
  const meshRef = useRef();

  // Controlador de FPS local
  const [frameInfo, setFrameInfo] = useState({ currentAnim: 'wait', frame: 0, maxFrames: 8 });
  const timeAccumulator = useRef(0);
  const startPos = useRef(new THREE.Vector3(-15, 4.5, 0)); // Subimos altura proporcionalmente

  useEffect(() => {
    textureLoader.load(`${import.meta.env.BASE_URL}sprites/${personajeSeleccionado}/combat/wait/wait-0.png`, (tex) => {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      if (materialRef.current) materialRef.current.map = tex;
    });
  }, [personajeSeleccionado, textureLoader]);

  useFrame((state, delta) => {
    timeAccumulator.current += delta;

    let newAnim = 'wait';
    let newMax = 8;
    if (animAction === 'punch') { newAnim = 'punch'; newMax = 6; }
    else if (animAction === 'kick') { newAnim = 'kick'; newMax = 6; }

    if (frameInfo.currentAnim !== newAnim) {
      setFrameInfo({ currentAnim: newAnim, frame: 0, maxFrames: newMax });
      timeAccumulator.current = 0;
      return;
    }

    if (timeAccumulator.current > 0.15) {
      timeAccumulator.current = 0;
      const nextFrame = frameInfo.frame + 1;

      if (nextFrame >= frameInfo.maxFrames && animAction !== 'wait') {
        resolveCombat();
      } else {
        setFrameInfo(prev => ({ ...prev, frame: nextFrame % prev.maxFrames }));
        const basename = newAnim === 'wait' ? 'wait' : newAnim; // Para kick-x.png, punch-x.png, wait-x.png
        textureLoader.load(`${import.meta.env.BASE_URL}sprites/${personajeSeleccionado}/combat/${newAnim}/${basename}-${nextFrame % newMax}.png`, (tex) => {
          tex.magFilter = THREE.NearestFilter;
          tex.minFilter = THREE.NearestFilter;
          if (materialRef.current) materialRef.current.map = tex;
        });
      }
    }

    // Físicas (Animación de acercamiento y rebote simulado)
    if (meshRef.current) {
      if (animAction !== 'wait') {
        // Parábola de avance
        const progress = frameInfo.frame / (Math.max(1, frameInfo.maxFrames - 1));
        const t = Math.sin(progress * Math.PI); // Sube y baja de 0 -> 1 -> 0
        const currentPos = new THREE.Vector3().copy(startPos.current);
        currentPos.lerp(new THREE.Vector3(targetEnemyPos[0] - 4, startPos.current.y, targetEnemyPos[2]), t);
        meshRef.current.position.copy(currentPos);
      } else {
        meshRef.current.position.copy(startPos.current);
      }
    }
  });

  return (
    <group>
      <Texto2D contenido={personajeSeleccionado.toUpperCase()} posicion={[-8, 16, 10]} fontSize={0.6} color="#a4cdff" />
      <mesh ref={meshRef} position={[-8, 4.5, 0]} rotation={[0, LOOK_DIR, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshBasicMaterial ref={materialRef} transparent alphaTest={0.5} side={THREE.DoubleSide} depthTest={false} />
      </mesh>
    </group>
  );
}

function EnemigoCombate({ data, pos, isSelecting, onClick }) {
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const materialRef = useRef();
  const meshRef = useRef();

  useEffect(() => {
    const safeName = data.nombre.replace(/\s+/g, '_');
    const url = `${import.meta.env.BASE_URL}sprites/enemigos/${safeName}.png`;
    textureLoader.load(url, tex => {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      if (materialRef.current) materialRef.current.map = tex;
    }, undefined, () => {
      textureLoader.load(ENEMY_FALLBACK, fallbackTex => {
        fallbackTex.magFilter = THREE.NearestFilter;
        fallbackTex.minFilter = THREE.NearestFilter;
        if (materialRef.current) materialRef.current.map = fallbackTex;
      });
    });
  }, [data.nombre, textureLoader]);

  // Bouncing nativo del Unity Size logic style
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = pos[1] + Math.abs(Math.sin(clock.getElapsedTime() * 4)) * 0.4;
      if (isSelecting) {
        const s = 1 + Math.sin(clock.getElapsedTime() * 10) * 0.1;
        meshRef.current.scale.set(s, s, s);
      }
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[0, LOOK_DIR, 0]}
        onClick={isSelecting ? onClick : undefined}
        onPointerOver={() => isSelecting && (document.body.style.cursor = 'pointer')}
        onPointerOut={() => isSelecting && (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[13, 13]} />
        <meshBasicMaterial ref={materialRef} transparent alphaTest={0.5} side={THREE.DoubleSide} depthTest={false} color={isSelecting ? '#ffdddd' : 'white'} />
      </mesh>

      <Texto2D contenido={data.nombre} posicion={[0, 9.5, 0]} fontSize={0.4} color="white" maxWidth={9.5} />
      <Texto2D contenido={`$${data.monto}`} posicion={[0, -0.0, 0]} fontSize={0.8} color="#f48585" />
      {isSelecting && <Texto2D contenido="[¡Atacar!]" posicion={[0, -2, 0]} fontSize={0.5} color="yellow" />}
      {data.esOpcional && <Texto2D contenido="(Opcional)" posicion={[0, 10.5, 0]} fontSize={0.4} color="gray" />}
    </group>
  );
}

// ---------------- VISTA PRINCIPAL ----------------

export default function BatallaView() {
  const { datosPantalla, resolverPromesa } = useGameStore();

  const mode = datosPantalla?.modo; // 'seleccionar_gasto' o individual o msi ...
  const loc = datosPantalla?.localizacion || 'Combate';

  // Lógica de Animación de Jugador
  const [playerAnim, setPlayerAnim] = useState('wait');
  const [pendingResolution, setPendingResolution] = useState(null);

  // Para mostrar error si el MSI no está disponible sin salir del combate
  const [localFeedbackMsg, setLocalFeedbackMsg] = useState(null);

  const handleActionClick = (actionValue, animationType) => {
    if (!resolverPromesa || pendingResolution) return;
    // Si hay animacion ('punch', 'kick'), preparamos estado.
    if (animationType) {
      setPlayerAnim(animationType);
      setPendingResolution(actionValue);
    } else {
      resolverPromesa(actionValue);
    }
  };

  const finalizeCombatAction = () => {
    if (pendingResolution && resolverPromesa) {
      resolverPromesa(pendingResolution);
      setPendingResolution(null);
    }
    setPlayerAnim('wait');
  };

  // Coordenadas base
  const enemyBasePos = [12, 4.5, 0];
  const targetPosForPlayer = mode === 'seleccionar_gasto' ? [18, 4.5, 0] : enemyBasePos;

  return (
    <div className="w-full h-full relative bg-black font-pixel">

      {/* SHARD HUD ARRIBA */}
      <SharedHUD />

      {/* BANCA MOVIL INTERCEPT */}
      {datosPantalla?.modo === 'banca' && <BancaMovilView />}

      {/* OVERLAY DE ERROR LOCAL (ej. MSI Inválido) */}
      {localFeedbackMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md z-[100] pointer-events-auto">
          <div className="bg-white px-12 py-10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center animate-fade-in-up">
            <StatusFeedback tipo="peligro" />
            <p className="mt-4 text-red-500 font-pixel text-xs sm:text-sm text-center font-bold whitespace-pre-wrap">{localFeedbackMsg}</p>
          </div>
        </div>
      )}

      {/* CABECERA (Z-10) */}
      <div className="absolute top-32 left-0 w-full px-6 flex justify-between items-start pointer-events-none z-10">
        <h2 className="bg-slate-900/80 px-6 py-2 rounded-lg text-red-500 font-pixel text-xl shadow-lg border border-red-900/50">
          {loc.toUpperCase()}
        </h2>
      </div>

      {/* PANEL DE DECISIONES INFERIOR (Z-20) */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t-4 border-indigo-900 p-6 flex flex-col md:flex-row shadow-[0_-20px_40px_rgba(0,0,0,0.8)] z-20">
        <div className="flex-1 text-slate-300 pr-6 mb-4 md:mb-0 hidden md:block select-none">
          <h3 className="text-indigo-400 text-lg font-pixel mb-2">Mensaje del Sistema</h3>
          {mode === 'seleccionar_gasto' && <p>Toca al enemigo en pantalla (modelo 3D) para enfrentarlo, o decide realizar una Huida Táctica con el botón rojo.</p>}
          {mode !== 'seleccionar_gasto' && datosPantalla?.gasto && <p>Tienes un gasto activo. Escoge tu arma (efectivo o crédito).</p>}
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3 min-w-[300px]">
          {/* Si estamos en Seleccion Multiple */}
          {mode === 'seleccionar_gasto' && (
            <>
              <div className="col-span-2 text-center text-sm text-gray-400 mb-2">Apunta al Enemigo en pantalla para atacarlo</div>
              <button onClick={() => handleActionClick('s', null)} className="col-span-2 py-4 bg-slate-700 hover:bg-slate-600 text-white font-pixel rounded-lg transition-transform active:scale-95 border border-slate-500 shadow-md">
                HUIDA TÁCTICA (Cerrar Batalla)
              </button>
            </>
          )}

          {/* Combate Individual o Menús Internos */}
          {mode !== 'seleccionar_gasto' && !datosPantalla?.opcionesCuotas && datosPantalla?.gasto && (
            <>
              <button onClick={() => handleActionClick('d', 'punch')} className="py-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-emerald-100 font-pixel shadow transition-transform active:scale-95 border border-emerald-500 flex flex-col items-center justify-center">
                <span>💵 Pagar Débito</span>
                <span className="text-xs font-normal opacity-70 mt-1">Punch Efectivo</span>
              </button>

              <button onClick={() => handleActionClick('t', 'kick')} className="py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-indigo-100 font-pixel shadow transition-transform active:scale-95 border border-indigo-500 flex flex-col items-center justify-center">
                <span>💳 Pagar TC</span>
                <span className="text-xs font-normal opacity-70 mt-1">Kick Crédito</span>
              </button>

              {datosPantalla?.puedeIgnorar ? (
                <button onClick={() => handleActionClick('i', null)} className="py-3 col-span-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-pixel rounded-lg shadow border border-slate-600 transition-transform active:scale-95">
                  Ignorar Gasto (-20 HP)
                </button>
              ) : (
                <button onClick={() => {
                  if (datosPantalla?.gasto && !datosPantalla.gasto.aceptaMSI) {
                    setLocalFeedbackMsg("Este gasto no admite\nMeses Sin Intereses.");
                    setTimeout(() => setLocalFeedbackMsg(null), 2500);
                  } else {
                    handleActionClick('m', null);
                  }
                }} className="py-3 col-span-2 bg-purple-700 hover:bg-purple-600 text-purple-100 font-pixel rounded-lg shadow border border-purple-500 transition-transform active:scale-95">
                  Negociar a M.S.I.
                </button>
              )}
            </>
          )}

          {/* MSI Selection */}
          {mode === 'msi' && datosPantalla?.opcionesCuotas && (
            <div className="col-span-2 flex flex-col space-y-2">
              <p className="text-center text-purple-300 font-pixel mb-2">Selecciona Mensualidades:</p>
              {datosPantalla.opcionesCuotas.map(cuota => (
                <button key={cuota} onClick={() => handleActionClick(cuota.toString(), 'punch')} className="py-3 bg-purple-700 hover:bg-purple-600 rounded-lg font-pixel">
                  [Puño] {cuota} Meses
                </button>
              ))}
              <button onClick={() => handleActionClick('c', null)} className="py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-pixel text-gray-300">
                Cancelar Negociación
              </button>
            </div>
          )}

          {mode === 'retiroObligatorio' && (
            <div className="col-span-2">
              <button onClick={() => handleActionClick('y', 'kick')} className="w-full py-4 bg-red-700 hover:bg-red-600 text-white rounded-lg font-pixel mb-2">
                [Patada] Pagar Asumiendo Comisión ({datosPantalla.maxRetiro})
              </button>
              <button onClick={() => handleActionClick('n', null)} className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg font-pixel">
                Asumir Insolvencia (Game Over)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- RENDER 3D JUEGO (Z-0) --- */}
      <Canvas camera={{ position: CAM_POS, fov: CAM_FOV }} className="absolute inset-0 z-0">
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <ErrorBoundary fallback={<Suspense fallback={null}><FallbackScene /></Suspense>}>
          <Suspense fallback={null}>
            <EscenarioDinamico localizacion={loc} />
          </Suspense>
        </ErrorBoundary>

        {/* COMBATIENTES (UI) */}
        <JugadorCombate
          animAction={playerAnim}
          resolveCombat={finalizeCombatAction}
          targetEnemyPos={targetPosForPlayer}
        />

        {mode === 'seleccionar_gasto' && datosPantalla?.gastos && datosPantalla.gastos.map((g, idx) => {
          const spreadPos = [
            enemyBasePos[0] + (idx * 10) - ((datosPantalla.gastos.length - 0.5) * 5),
            enemyBasePos[1] + (idx * 3), // +3 unidades de altura por cada enemigo extra
            enemyBasePos[2] - (idx * 4)  // Profundidad para perspectiva
          ];
          return (
            <EnemigoCombate
              key={idx}
              data={g}
              pos={spreadPos}
              isSelecting={true}
              onClick={() => handleActionClick(`${idx + 1}`, null)}
            />
          );
        })}

        {mode !== 'seleccionar_gasto' && datosPantalla?.gasto && (
          <EnemigoCombate
            data={datosPantalla.gasto}
            pos={enemyBasePos}
            isSelecting={false}
          />
        )}

        {/* CONTROLES DE CAMARA PURAMENTE PARA ZOOM LIMITADO */}
        <OrbitControls enableZoom={true} enablePan={false} enableRotate={false} minDistance={10} maxDistance={47} />
      </Canvas>
    </div>
  );
}