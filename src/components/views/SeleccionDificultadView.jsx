import React from 'react';
import { PerfilEnum } from '../../core/motor/Enums';
import { MotorJuego } from '../../core/motor/MotorJuego';
import { ReactMotorAdapter } from '../../core/ReactMotorAdapter';
import { useGameStore } from '../../store/gameStore';

export default function SeleccionDificultadView() {
  const cambiarEscena = useGameStore(state => state.cambiarEscena);

  const iniciarYArrancarMotor = async (perfil) => {
    // 1. Instanciar el Adaptador "puente"
    const adaptador = new ReactMotorAdapter();

    // 2. Crear instancia pura del motor pasándole el adaptador
    const motor = new MotorJuego(adaptador);

    // FIX: El motor llama internamente a realizarAbonoVoluntarioTDC() en el Stage 6,
    // pero el método real se llama realizarOperacionesBancaMovil(). Aliaseamos para no tocar el motor.
    motor.realizarAbonoVoluntarioTDC = motor.realizarOperacionesBancaMovil;

    // Conectar el callback nativo del motor para recolectar el JSON analítico de la API
    motor.onGameOver = async (datosJSON) => {
      useGameStore.getState().setHistorialIA(datosJSON);
    };

    // 3. Arrancar el bucle del juego en background 
    // el motor orquestará las promesas de la UI por su cuenta)
    motor.iniciarJuego(perfil);
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">

      {/* HEADER TOP BAR */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-center p-4 md:p-6 z-10">
        <button
          onClick={() => cambiarEscena('SeleccionPersonaje')}
          className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded font-pixel text-xs md:text-sm text-gray-300 border border-slate-600 shadow-md transition-transform active:scale-95">
          &lt; Volver
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-xl md:text-3xl font-pixel text-orange-400 drop-shadow-md">Selecciona la Dificultad</h2>
      </div>

      {/* JUMBO GRID 3/4 de PANTALLA */}
      <div className="grid grid-cols-2 gap-4 md:gap-8 w-[90vw] md:w-[75vw] h-[75vh] max-w-5xl mt-12 md:mt-20">
        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.DEPENDIENTE)}
          className="bg-blue-600 p-4 md:p-8 rounded-2xl hover:bg-blue-500 transition-transform active:scale-[0.98] shadow-2xl flex flex-col items-center justify-center h-full w-full border-b-8 border-blue-800 active:border-b-0 active:translate-y-2">
          <h3 className="text-lg md:text-xl lg:text-2xl font-pixel text-center">Dependiente</h3>
          <p className="text-[13px] md:text-xs lg:text-sm text-blue-200 mt-2 md:mt-4 px-2 text-center max-w-xs leading-relaxed">Estudiante con ingreso constante de tutor/es, gastos exclusivos como Estudiante (FACIL)</p>
        </button>

        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.TRABAJADOR)}
          className="bg-red-600 p-4 md:p-8 rounded-2xl hover:bg-red-500 transition-transform active:scale-[0.98] shadow-2xl flex flex-col items-center justify-center h-full w-full border-b-8 border-red-800 active:border-b-0 active:translate-y-2">
          <h3 className="text-lg md:text-xl lg:text-2xl font-pixel text-center leading-tight">Trabajador a medio tiempo</h3>
          <p className="text-[13px] md:text-xs lg:text-sm text-red-200 mt-2 md:mt-4 px-2 text-center max-w-xs leading-relaxed">Estudiar y Trabajar, gastos como Estudiante y apoyos en hogar (NORMAL)</p>
        </button>

        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.INDEPENDIENTE)}
          className="bg-yellow-600 p-4 md:p-8 rounded-2xl hover:bg-yellow-500 transition-transform active:scale-[0.98] shadow-2xl flex flex-col items-center justify-center h-full w-full border-b-8 border-yellow-800 active:border-b-0 active:translate-y-2">
          <h3 className="text-lg md:text-xl lg:text-2xl font-pixel text-center">Independiente</h3>
          <p className="text-[13px] md:text-xs lg:text-sm text-yellow-200 mt-2 md:mt-4 px-2 text-center max-w-xs leading-relaxed">Joven Empleado con ingresos Constantes, gastos de hogar y trabajo (DIFICIL)</p>
        </button>

        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.NINI)}
          className="bg-green-600 p-4 md:p-8 rounded-2xl hover:bg-green-500 transition-transform active:scale-[0.98] shadow-2xl flex flex-col items-center justify-center h-full w-full border-b-8 border-green-800 active:border-b-0 active:translate-y-2">
          <h3 className="text-lg md:text-xl lg:text-2xl font-pixel text-center">Nini</h3>
          <p className="text-[13px] md:text-xs lg:text-sm text-green-200 mt-2 md:mt-4 px-2 text-center max-w-xs leading-relaxed">Sin Trabajo y no estudias solo gastas, ingresos esporadicos de "Apoyos" (REALIDAD MEXICANA)</p>
        </button>
      </div>
    </div>
  );
}
