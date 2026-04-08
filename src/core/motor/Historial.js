/**
 * Clase Historial para registrar y estructurar el log JSON de la partida.
 */
export class Historial {
    constructor() {
        this.datos = {
            perfil: {},
            etapas: [],
            resultadoFinal: null
        };
        this.etapaActual = null;
        this.semanaActual = null;
    }

    /**
     * Registra la configuración inicial del perfil seleccionado.
     */
    registrarConfiguracion(config) {
        const normalizedConfig = { ...config };
        
        // Normalización de campos de ingreso para la API del backend
        if (config.ingresoFijo !== undefined) {
            normalizedConfig.ingresoMin = config.ingresoFijo;
            normalizedConfig.ingresoMax = config.ingresoFijo;
        } else if (config.ingresoMinEsporadico !== undefined) {
            normalizedConfig.ingresoMin = config.ingresoMinEsporadico;
            normalizedConfig.ingresoMax = config.ingresoMaxEsporadico;
        }

        this.datos.perfil = normalizedConfig;
    }

    /**
     * Crea una nueva entrada para un mes/etapa.
     */
    nuevaEtapa(numeroEtapa) {
        this.etapaActual = {
            stage: numeroEtapa,
            semanas: []
        };
        this.datos.etapas.push(this.etapaActual);
    }

    /**
     * Crea una nueva entrada para una semana dentro de la etapa actual.
     */
    nuevaSemana(numeroSemana) {
        if (!this.etapaActual) return;
        this.semanaActual = {
            semana: numeroSemana,
            eventos: []
        };
        this.etapaActual.semanas.push(this.semanaActual);
    }

    /**
     * Registra un gasto enfrentado u omitido.
     */
    registrarGasto(gasto, decision, jugador, msiData = null) {
        if (!this.semanaActual) return;

        let formaPago = "N/A";
        let omitido = false;
        let msiElegido = 0;
        let msiPeriodoActual = "0 de 0";

        switch (decision) {
            case 'd':
                formaPago = "Debito";
                break;
            case 't':
                formaPago = "TDC";
                break;
            case 'm':
                formaPago = "MSI";
                msiElegido = msiData ? msiData.cuotas : 0;
                msiPeriodoActual = `1 de ${msiElegido}`;
                break;
            case 'i':
                formaPago = "Ninguna";
                omitido = true;
                break;
        }

        const registro = {
            tipo: "gasto",
            gasto: {
                nombre: gasto.nombre,
                monto: gasto.monto,
                formaPago: formaPago,
                msiElegido: msiElegido,
                msiPeriodoActual: msiPeriodoActual,
                omitido: omitido
            },
            estadoJugador: this._capturarEstadoJugador(jugador)
        };

        this.semanaActual.eventos.push(registro);
    }

    /**
     * Registra un abono a la tarjeta de crédito.
     */
    registrarPago(tipoPago, monto, jugador) {
        if (!this.semanaActual) return;

        const registro = {
            tipo: "pago",
            pago: {
                metodo: tipoPago, // MINIMO, TOTAL, PARCIAL
                monto: monto
            },
            estadoJugador: this._capturarEstadoJugador(jugador)
        };

        this.semanaActual.eventos.push(registro);
    }

    /**
     * Registra el resultado final de la partida.
     */
    finalizarHistorial(estado, motivo, stats) {
        this.datos.resultadoFinal = {
            estado: estado, // VICTORIA, GAME_OVER, COMPLETADO
            motivo: motivo, // HP_CERO, INSOLVENCIA, VOLUNTARIO, COMPLETADO
            stats: stats
        };
    }

    /**
     * Retorna el objeto JSON completo.
     */
    obtenerJSON() {
        return this.datos;
    }

    /**
     * Captura una instantánea del estado financiero y vital del jugador.
     * @private
     */
    _capturarEstadoJugador(jugador) {
        if (!jugador) return {};
        
        return {
            saldoTDC: jugador.tarjeta.saldoInsoluto,
            creditoDisponible: jugador.tarjeta.creditoDisponible,
            efectivoDisponible: jugador.efectivoDisponible,
            calidad: jugador.calidadVida,
            hp: jugador.calcularHP(),
            pagoMinimo: jugador.tarjeta.calcularPagoMinimo()
        };
    }
}
