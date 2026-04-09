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

  // === BUCLE BANCA MÓVIL ===
  mantenerBancaAbierta: false,
  setMantenerBancaAbierta: (val) => set({ mantenerBancaAbierta: val }),

  // El motor llamará a esta función para congelar su código hasta que el usuario decida algo.
  solicitarInteraccion: (nuevaEscena, datos) => {
    return new Promise((resolve) => {
      // INTERCEPTOR PARA BUCLE DE BANCA
      // Si la banca "sigue abierta" en nuestra mente y el motor intenta pedirnos la siguiente opción (gasto o loc),
      // le decimos inmediatamente 'p' para que el motor re-ejecute realizarOperacionesBancaMovil().
      // Restauramos escenaActual aquí para no quedarnos atrapados en la vista transitoria de Retroalimentación.
      if (get().mantenerBancaAbierta && (datos?.modo === 'seleccionar_gasto' || datos?.modo === 'localizaciones')) {
        set({ escenaActual: nuevaEscena });
        resolve('p');
        return;
      }

      // Limpiamos el resolver anterior por precaución y asignamos el nuevo
      set({
        escenaActual: nuevaEscena,
        datosPantalla: datos || {},
        resolverPromesa: resolve 
      });
    });
  },
}));