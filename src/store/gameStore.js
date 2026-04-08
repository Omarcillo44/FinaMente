// src/store/gameStore.js
import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Estado actual de la pantalla y el HUD global
  escenaActual: 'Inicio', 
  datosPantalla: {},    
  headers: { hp: 100, saldoInsoluto: 0, efectivoDisponible: 0, stageActual: 1 },
  nombreJugador: 'Jugador 1',

  cambiarEscena: (escena, datos = {}) => {
    set({ escenaActual: escena, datosPantalla: datos });
  },

  setNombreJugador: (nombre) => {
    set({ nombreJugador: nombre });
  },

  actualizarHeaders: (nuevosHeaders) => {
    set({ headers: nuevosHeaders });
  },

  historialIA: null,
  setHistorialIA: (datos) => {
    set({ historialIA: datos });
  },

  personajeSeleccionado: 'Clemente',
  setPersonajeSeleccionado: (nombre) => {
    set({ personajeSeleccionado: nombre });
  },

  // === SISTEMA DE COLISIÓN Y MEMORIA DE MAPA ===
  posicionPersonaje: [131, 1, 137], // Spawn inicial recuperado
  zonaBloqueada: null,
  setPosicionPersonaje: (pos) => set({ posicionPersonaje: pos }),
  setZonaBloqueada: (zona) => set({ zonaBloqueada: zona }),

  // === INTEGRACIÓN CON EL MOTOR JUEGO ===
  resolverPromesa: null,  

  // El motor llamará a esta función para congelar su código hasta que el usuario decida algo.
  solicitarInteraccion: (nuevaEscena, datos) => {
    return new Promise((resolve) => {
      // Limpiamos el resolver anterior por precaución y asignamos el nuevo
      set({
        escenaActual: nuevaEscena,
        datosPantalla: datos || {},
        resolverPromesa: resolve 
      });
    });
  },
}));