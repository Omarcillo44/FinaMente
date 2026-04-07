// src/core/AudioGlobal.js

// Al crearlo aquí, se instancia una sola vez cuando la app carga, 
// pero NO suena hasta que llamemos a play()
const musicaFondo = new Audio('/song/Legend_of_the_Keep.mp3');

// Configuraciones críticas
musicaFondo.loop = true;  // Para que se repita infinitamente
musicaFondo.volume = 0.2; // 20% de volumen (IMPORTANTE: para que no ensordezca a los jueces)

export const iniciarMusicaGlobal = () => {
  // El .catch() evita que la consola se llene de errores rojos 
  // si el navegador se pone estricto antes del primer clic
  musicaFondo.play().catch(error => console.warn("Esperando interacción del usuario para el audio", error));
};

export const detenerMusicaGlobal = () => {
  musicaFondo.pause();
  musicaFondo.currentTime = 0;
};