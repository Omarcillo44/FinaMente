import { useGameStore } from '../store/gameStore';

export class ReactMotorAdapter {
    constructor() {
        this.ultimaLocalizacion = 'Casa';
    }

    // Pausas
    async sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // Inicializaciones
    mostrarInicializacion(perfilEnum, ingresoInicial, limiteInicial, tasaInteresAnual) {
        // En nuestro caso, ya el UI mostrará algo o el motor simplemente continuará
        console.log(`[Adapter] Inicialización: ${perfilEnum}, Ingreso: ${ingresoInicial}`);
    }

    actualizarHeaders(estado) {
        useGameStore.getState().actualizarHeaders(estado);
    }

    // Navegaciones asíncronas
    async mostrarSelectorLocalizacion(localizaciones) {
        return await useGameStore.getState().solicitarInteraccion('Mapa', { modo: 'localizaciones', localizaciones });
    }

    async mostrarSelectorGastosLocalizacion(localizacion, gastos) {
        this.ultimaLocalizacion = localizacion; 
        return await useGameStore.getState().solicitarInteraccion('Batalla', { modo: 'seleccionar_gasto', localizacion, gastos });
    }

    async mostrarMenuGasto(gasto, estadoVirtual, puedeIgnorar, tieneDeuda) {
        return await useGameStore.getState().solicitarInteraccion('Batalla', { 
            gasto, estadoVirtual, puedeIgnorar, tieneDeuda,
            localizacion: this.ultimaLocalizacion 
        });
    }

    async mostrarMenuBancaMovil(estadoBanca) {
        const currentScene = useGameStore.getState().escenaActual;
        return await useGameStore.getState().solicitarInteraccion(currentScene, { modo: 'banca', ...estadoBanca });
    }

    async mostrarSelectorMSI(opcionesCuotas) {
        // Lo redirigimos a Batalla con un flag para mostrar los MSI
        return await useGameStore.getState().solicitarInteraccion('Batalla', { 
            modo: 'msi', opcionesCuotas,
            localizacion: this.ultimaLocalizacion
        });
    }

    async mostrarMenuDisposicionObligatoria(gasto, maxRetiro, comisionPct) {
        // Redirigimos a Batalla con un flag para retiro urgente
        return await useGameStore.getState().solicitarInteraccion('Batalla', { 
            modo: 'retiroObligatorio', gasto, maxRetiro, comisionPct,
            localizacion: this.ultimaLocalizacion
        });
    }

    async confirmarAvance() {
        return await useGameStore.getState().solicitarInteraccion('ResumenStage', { modo: 'confirmar_avance' });
    }

    // Vistas de Notificaciones (void)
    mostrarNotificacionVentanaPagoInmediata() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'aviso', mensaje: 'Debes liquidar tu cuenta este mes antes de terminar el juego.' });
    }

    mostrarResolucionGastoDebito() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'exito', mensaje: 'Gasto pagado con Débito Exitosamente.' });
    }

    mostrarResolucionGastoCredito() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'exito', mensaje: 'Gasto pagado con Crédito Exitosamente.' });
    }

    mostrarResolucionGastoMSI(cuotas) {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'exito', mensaje: `Gasto financiado a ${cuotas} Meses Sin Intereses.` });
    }

    mostrarResolucionGastoIgnorado() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'info', mensaje: 'Gasto Ignorado (Evadiste el cargo).' });
    }

    mostrarResolucionPagoMinimo() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'info', mensaje: 'Pago Mínimo realizado con éxito.' });
    }

    mostrarResolucionPagoTotal() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'exito', mensaje: 'Pago Para No Generar Intereses realizado con éxito.' });
    }

    mostrarResolucionPagoParcial(monto) {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'info', mensaje: `Pago Parcial de $${monto} realizado.` });
    }

    mostrarResolucionExpiracion(cargo) {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'peligro', mensaje: `¡Omisión de Pago Mínimo! Se te aplicó un cargo de $${cargo}.` });
    }

    mostrarAumentoLinea(limiteViejo, limiteNuevo) {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'exito', mensaje: `¡Felicidades! Tu límite de crédito aumentó de $${limiteViejo} a $${limiteNuevo}.` });
    }

    mostrarCambioScore(mensaje, tipo, nuevoScore) {
        // En un caso real podría no pausar toda la pantalla y usarse un Toast.
        // Por ahora lo mandamos a Retroalimentacion
        if(mensaje) {
            useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: tipo || 'info', mensaje, score: nuevoScore });
        }
    }

    mostrarAdvertenciaUltimoDia() {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'alerta', mensaje: '⚠️ Último día de la Semana 2. ¡Fecha límite de pago de tu Tarjeta!' });
    }

    mostrarMensaje(mensaje) {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'info', mensaje });
    }

    mostrarInicioSemana(stage, semana) {
        useGameStore.getState().cambiarEscena('Retroalimentacion', { tipo: 'titulo', mensaje: `Mes ${stage} - Semana ${semana}` });
    }
    
    mostrarCancelacionUsuario() {
        // Abandonó el juego
        console.log("Abandonaste el juego");
    }

    // GAME OVERS / FINALES
    mostrarGameOverPorHP(stage, stats) {
        useGameStore.getState().cambiarEscena('GameOver', { razon: 'Salud Mental (HP) llegó a Cero', stats, stage });
    }

    mostrarGameOverInsolvencia(stage, stats) {
        useGameStore.getState().cambiarEscena('GameOver', { razon: 'Insolvencia (Imposible pagar)', stats, stage });
    }

    mostrarGameOverInsolvenciaExtrema(gasto, stage, stats) {
        useGameStore.getState().cambiarEscena('GameOver', { razon: 'Sin efectivo ni crédito suficiente para un Gasto Obligatorio', gasto, stats, stage });
    }

    mostrarResumenSalidaVoluntaria(stage, stats) {
        useGameStore.getState().cambiarEscena('GameOver', { razon: 'Retiro Voluntario', stats, stage });
    }

    mostrarFinStage(stage, stats, esPerfilVistoso) {
        useGameStore.getState().cambiarEscena('ResumenStage', { stage, stats, esPerfilVistoso });
    }

    mostrarVictoria(hp, score) {
        useGameStore.getState().cambiarEscena('GameOver', { razon: '¡Victoria! Sobreviviste los 6 meses.', victoria: true, hp, score });
    }
}
