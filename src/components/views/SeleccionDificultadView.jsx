import React from 'react';
import { PerfilEnum } from '../../core/motor/Enums';
import { MotorJuego } from '../../core/motor/MotorJuego';
import { ReactMotorAdapter } from '../../core/ReactMotorAdapter';

export default function SeleccionDificultadView() {
  const iniciarYArrancarMotor = async (perfil) => {
    // 1. Instanciar el Adaptador "puente"
    const adaptador = new ReactMotorAdapter();

    // 2. Crear instancia pura del motor pasándole el adaptador
    const motor = new MotorJuego(adaptador);

    // 3. Arrancar el bucle del juego en background (No hacemos await aquí para que no se congele este hilo, 
    // el motor orquestará las promesas de la UI por su cuenta)
    motor.iniciarJuego(perfil);
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <h2 className="text-3xl font-pixel mb-10 text-orange-400">Selecciona la Dificultad</h2>
      <div className="flex flex-col space-y-6 w-full max-w-sm">
        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.DEPENDIENTE)}
          className="bg-blue-600 p-6 rounded-xl hover:bg-blue-500 transition-transform active:scale-95 shadow-lg">
          <h3 className="text-2xl font-pixel">Dependiente</h3>
          <p className="text-sm text-blue-200 mt-2">(Ingreso constante de los Padres)</p>
        </button>
        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.TRABAJADOR)}
          className="bg-red-600 p-6 rounded-xl hover:bg-red-500 transition-transform active:scale-95 shadow-lg">
          <h3 className="text-2xl font-pixel">Trabajador a medio tiempo</h3>
          <p className="text-sm text-red-200 mt-2">(Ingreso constante pero con gastos variables)</p>
        </button>
        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.INDEPENDIENTE)}
          className="bg-yellow-600 p-6 rounded-xl hover:bg-yellow-500 transition-transform active:scale-95 shadow-lg">
          <h3 className="text-2xl font-pixel">Independiente</h3>
          <p className="text-sm text-yellow-200 mt-2">(Ingreso Constante de sueldo)</p>
        </button>
        <button
          onClick={() => iniciarYArrancarMotor(PerfilEnum.NINI)}
          className="bg-green-600 p-6 rounded-xl hover:bg-green-500 transition-transform active:scale-95 shadow-lg">
          <h3 className="text-2xl font-pixel">Nini</h3>
          <p className="text-sm text-red-200 mt-2">(Sin trabajo, sin ser estudiante, ingresos esporádicos)</p>
        </button>
      </div>
    </div>
  );
}
