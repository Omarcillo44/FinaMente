import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function PersonajeController({ position = [0, 1, 0], inputs }) {
  const personajeRef = useRef();
  const materialRef = useRef();
  const { camera } = useThree(); // Quitamos "controls" porque vamos a forzar una cámara rígida

  // Posición interna calculada en el bucle
  const posRef = useRef(new THREE.Vector3(...position));

  // Aumenté el tamaño del personaje temporalmente para asegurarme de que lo veas
  const SIZE = 6;
  const MOVE_SPEED = 8.0;

  const animState = useRef({
    direccion: 'down',
    isMoving: false,
    frame: 0,
    timeAccumulator: 0,
  });

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const applyTexture = (url) => {
    textureLoader.load(
      url,
      (tex) => {
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        if (materialRef.current) materialRef.current.map = tex;
      },
      undefined,
      (err) => {
        // Fallback genérico a pixil-frame-0.png si no se encuentra
        textureLoader.load(`${import.meta.env.BASE_URL}sprites/empleado/down-0.png`, (fallback) => {
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

    if (inputs.up) {
      moveZ -= 1;
      currentDir = 'up';
      isMoving = true;
    }
    if (inputs.down) {
      moveZ += 1;
      currentDir = 'down';
      isMoving = true;
    }
    if (inputs.left) {
      moveX -= 1;
      currentDir = 'left';
      isMoving = true;
    }
    if (inputs.right) {
      moveX += 1;
      currentDir = 'right';
      isMoving = true;
    }

    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }

    posRef.current.x += moveX * MOVE_SPEED * delta;
    posRef.current.z += moveZ * MOVE_SPEED * delta;

    if (personajeRef.current) {
      personajeRef.current.position.copy(posRef.current);
      // Billboarding estricto: El personaje siempre estará de cara a la cámara
      personajeRef.current.quaternion.copy(camera.quaternion);
    }
    // Lógica RIGIDA de seguimiento para la cámara (Estilo Pokemon/Zelda)
    // Fijamos un offset específico estricto para que la camara NUNCA varíe su ángulo.
    const cameraOffset = new THREE.Vector3(0, 8, 12);
    const targetCameraPos = posRef.current.clone().add(cameraOffset);

    // Suavizado hacia la nueva posicion de la camara
    camera.position.lerp(targetCameraPos, 0.1);
    // Forzamos a la camara a mirar siempre paralelamente al mismo punto (jugador)
    camera.lookAt(posRef.current.clone().add(new THREE.Vector3(0, 1, 0)));

    // 3. Lógica de Animación
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

    const currentFrame = animState.current.frame;
    const isFrameChanged = prevFrame !== currentFrame;
    const isStateChanged = prevDir !== currentDir || prevMoving !== isMoving;

    if (isFrameChanged || isStateChanged) {
      // Intenta cargar la textura con la estructura que definimos
      const textureUrl = isMoving
        ? `${import.meta.env.BASE_URL}sprites/empleado/${currentDir}/${currentDir}-${currentFrame}.png`
        : `${import.meta.env.BASE_URL}sprites/empleado/${currentDir}-0.png`;

      applyTexture(textureUrl);
    }
  });

  useEffect(() => {
    // Para asegurarnos de que aparezca, forzamos que al iniciar busque down-0.png (o fallback)
    applyTexture(`${import.meta.env.BASE_URL}sprites/empleado/down-0.png`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
