import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

export const ZONAS_MAPA = {
  // Configuración de hitbox (x, z, radius)
  'ESCUELA': { x: 50, z: 50, r: 4 },
  'SUPERMERCADO': { x: 179, z: 123, r: 4 },
  'CASA': { x: 131, z: 121, r: 4 },
  'OFICINA': { x: 103, z: 48, r: 4 },
  'CONSULTORIO': { x: 175, z: 56, r: 4 },
  'TRANSPORTE': { x: 125, z: 64, r: 4 },
  'CENTRO_COMERCIAL': { x: 46, z: 126, r: 4 }
};

export default function PersonajeController({ position = [131, 1, 137], inputs, activas = [], onCollision, zonaBloqueada, onZonalibear }) {
  const personajeRef = useRef();
  const materialRef = useRef();
  const { camera } = useThree();
  const personajeSeleccionado = useGameStore(state => state.personajeSeleccionado) || 'Clemente';

  const posRef = useRef(new THREE.Vector3(...position));

  const SIZE = 8;
  const MOVE_SPEED = 20.0;

  const animState = useRef({
    direccion: 'down',
    isMoving: false,
    frame: 0,
    timeAccumulator: 0,
  });

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const applyTexture = (url) => {
    textureLoader.load(url, (tex) => {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      if (materialRef.current) materialRef.current.map = tex;
    }, undefined, (err) => {
      textureLoader.load(`${import.meta.env.BASE_URL}sprites/${personajeSeleccionado}/down-0.png`, (fallback) => {
        fallback.magFilter = THREE.NearestFilter;
        fallback.minFilter = THREE.NearestFilter;
        if (materialRef.current) materialRef.current.map = fallback;
      }, undefined, () => { });
    }
    );
  };

  useFrame((state, delta) => {
    let moveX = 0;
    let moveZ = 0;
    let isMoving = false;
    let currentDir = animState.current.direccion;

    if (inputs.up) { moveZ -= 1; currentDir = 'up'; isMoving = true; }
    if (inputs.down) { moveZ += 1; currentDir = 'down'; isMoving = true; }
    if (inputs.left) { moveX -= 1; currentDir = 'left'; isMoving = true; }
    if (inputs.right) { moveX += 1; currentDir = 'right'; isMoving = true; }

    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }

    posRef.current.x += moveX * MOVE_SPEED * delta;
    posRef.current.z += moveZ * MOVE_SPEED * delta;

    // --- LÍMITES DEL MAPA ---
    if (posRef.current.x < 11) posRef.current.x = 11;
    if (posRef.current.x > 198) posRef.current.x = 198;
    if (posRef.current.z < 20) posRef.current.z = 20;
    if (posRef.current.z > 151) posRef.current.z = 151;

    // --- CÁMARA (Opciones de Isométrica) ---
    // Cambia a 'false' si prefieres la perspectiva original
    const ES_ISOMETRICA = false;

    const OFFSET_X = ES_ISOMETRICA ? 24 : 0;
    const OFFSET_Y = 24;
    const OFFSET_Z = ES_ISOMETRICA ? 24 : 28;

    const cameraOffset = new THREE.Vector3(OFFSET_X, OFFSET_Y, OFFSET_Z);
    const targetCameraPos = posRef.current.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(posRef.current.clone().add(new THREE.Vector3(0, 1, 0)));

    if (personajeRef.current) {
      personajeRef.current.position.copy(posRef.current);
      // Billboard: Hacemos que el sprite plano siempre vea hacia la cámara perfectamente
      personajeRef.current.quaternion.copy(camera.quaternion);
    }

    // Log visual
    const divLog = document.getElementById('debug-coords');
    if (divLog && (isMoving || animState.current.frame === 0)) {
      divLog.innerText = `X: ${Math.round(posRef.current.x)} | Z: ${Math.round(posRef.current.z)}`;
    }

    // --- LOGICA DE COLISIÓN Y DESBLOQUEO ---
    let enCualquierArea = false;
    activas.forEach(loc => {
      const zona = ZONAS_MAPA[loc];
      if (zona) {
        const dist = Math.hypot(posRef.current.x - zona.x, posRef.current.z - zona.z);
        if (dist <= zona.r) {
          enCualquierArea = true;
          if (zonaBloqueada !== loc) {
            onCollision(loc);
          }
        }
      }
    });

    // Si salió de la zona bloqueada actual (radio extendido para dar changüí)
    if (zonaBloqueada) {
      const zona = ZONAS_MAPA[zonaBloqueada];
      if (zona && Math.hypot(posRef.current.x - zona.x, posRef.current.z - zona.z) > zona.r + 5) {
        onZonalibear(); // Libera la zona al alejarse un poco
      }
    }

    // --- ANIMACIÓN ---
    const prevDir = animState.current.direccion;
    const prevMoving = animState.current.isMoving;
    const prevFrame = animState.current.frame;
    animState.current.direccion = currentDir;
    animState.current.isMoving = isMoving;

    if (isMoving) {
      animState.current.timeAccumulator += delta;
      if (animState.current.timeAccumulator >= 0.15) {
        animState.current.timeAccumulator = 0;
        animState.current.frame = (animState.current.frame + 1) % 6;
      }
    } else {
      animState.current.frame = 0;
      animState.current.timeAccumulator = 0;
    }

    if (prevFrame !== animState.current.frame || prevDir !== currentDir || prevMoving !== isMoving) {
      const textureUrl = isMoving
        ? `${import.meta.env.BASE_URL}sprites/${personajeSeleccionado}/${currentDir}/${currentDir}-${animState.current.frame}.png`
        : `${import.meta.env.BASE_URL}sprites/${personajeSeleccionado}/${currentDir}-0.png`;
      applyTexture(textureUrl);
    }
  });

  useEffect(() => {
    applyTexture(`${import.meta.env.BASE_URL}sprites/${personajeSeleccionado}/down-0.png`);
    return () => {
      // Guardar posición al desmontarse (irse a Batalla)
      useGameStore.getState().setPosicionPersonaje([posRef.current.x, posRef.current.y, posRef.current.z]);
    };
  }, []);

  return (
    <mesh ref={personajeRef} position={position}>
      <planeGeometry args={[SIZE, SIZE]} />
      {/* 
        Le puse depthTest=false temporalmente por si tu mapa 3D está colisionando.
        Así el personaje siempre se dibujará por encima del suelo.
        Si se ve bien, puedes quitárselo luego.
      */}
      <meshBasicMaterial
        ref={materialRef}
        transparent={true}
        alphaTest={0.5}
        side={THREE.DoubleSide}
        depthTest={false}
      />
    </mesh>
  );
}
