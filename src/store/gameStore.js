// src/store/gameStore.js
import { create } from 'zustand';

export const DEMO_SCENES = [
  'Inicio', 
  'Creditos', 
  'SeleccionPersonajes', 
  'SeleccionDificultad', 
  'Mapa', 
  'Batalla', 
  'BancaMovil', 
  'ResumenStage', 
  'Retroalimentacion', 
  'GameOver'
];

export const useGameStore = create((set, get) => ({
  // Estado actual de la pantalla y el HUD global
  escenaActual: DEMO_SCENES[0], 
  datosPantalla: null,    
  headers: { hp: 100, saldoInsoluto: 0, efectivoDisponible: 0, stageActual: 1 },

  // Navegación de Demo
  irSiguienteEscena: () => {
    const { escenaActual } = get();
    const currentIndex = DEMO_SCENES.indexOf(escenaActual);
    if (currentIndex < DEMO_SCENES.length - 1) {
      set({ escenaActual: DEMO_SCENES[currentIndex + 1] });
    }
  },
  
  irEscenaAnterior: () => {
    const { escenaActual } = get();
    const currentIndex = DEMO_SCENES.indexOf(escenaActual);
    if (currentIndex > 0) {
      set({ escenaActual: DEMO_SCENES[currentIndex - 1] });
    }
  },

  // AQUÍ ESTÁ LA MAGIA: Guardaremos la función que "despierta" al motor
  resolverPromesa: null,  

  // Función interna que usará nuestro adaptador de la Vista
  solicitarInteraccion: (nuevaEscena, datos) => {
    return new Promise((resolve) => {
      set({
        escenaActual: nuevaEscena,
        datosPantalla: datos,
        resolverPromesa: resolve // Guardamos la llave para despertar al motor
      });
    });
  },

  // Para funciones que solo actualizan la vista sin pausar el motor
  actualizarVista: (nuevaEscena, datos) => set({ escenaActual: nuevaEscena, datosPantalla: datos }),
  actualizarHeaders: (nuevosHeaders) => set({ headers: nuevosHeaders }),
}));