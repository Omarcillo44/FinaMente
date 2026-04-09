import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function VideoPersonajeView() {
  const cambiarEscena = useGameStore(state => state.cambiarEscena);
  const personaje = useGameStore(state => state.personajeSeleccionado) || 'Clemente';
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Intentamos reproducir el mp4. Si falla, se muestra pantalla negra.
  const videoSrc = `${import.meta.env.BASE_URL}videos/${personaje.toLowerCase()}.mp4`;

  const irSiguiente = () => {
    cambiarEscena('SeleccionDificultad');
  };

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(e => {
            console.warn("No se pudo reproducir el video automáticamente o no existe:", e);
            setVideoError(true);
        });
    }
  }, []);

  return (
    <div className="w-full h-full bg-black relative flex flex-col items-center justify-center pointer-events-auto select-none">
        {!videoError ? (
             <video 
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain"
                onEnded={() => setIsPlaying(false)}
                onError={() => {
                  console.warn("Video no encontrado:", videoSrc);
                  setVideoError(true);
                }}
                playsInline
                autoPlay
             />
        ) : (
            <div className="text-white opacity-20 font-pixel text-xs text-center">
              (Video de introducción no encontrado / saltado)
            </div>
        )}

        <button 
           onClick={irSiguiente}
           className="absolute bottom-8 right-8 bg-black/60 hover:bg-black/80 border border-white/30 px-6 py-3 rounded-full text-white font-pixel shadow-lg backdrop-blur text-sm active:scale-95 transition-transform"
        >
           {isPlaying && !videoError ? "▶ Omitir" : "➤ Continuar"}
        </button>
    </div>
  );
}
