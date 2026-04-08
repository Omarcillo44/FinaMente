/**
 * Utilidad compartida para comunicación con la API de IA con sistema de redundancia (Fallback).
 * Plan A: ngrok (prioridad)
 * Plan B: railway (respaldo)
 */

const ENDPOINTS = {
    PLAN_A: 'https://stag-improved-wildcat.ngrok-free.app/partida/analizar',
    PLAN_B: 'https://finamente-production.up.railway.app/partida/analizar'
};

/**
 * Realiza una petición POST a la API de análisis con fallback invisible.
 * @param {Object} payload Datos de la partida a analizar.
 * @returns {Promise<Object>} Resultado del análisis.
 */
export async function solicitarAnalisisIA(payload) {
    // Intentar Plan A
    try {
        console.log('Intentando análisis con Plan A (ngrok)...');
        const responseA = await fetch(ENDPOINTS.PLAN_A, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(payload)
        });

        if (responseA.ok) {
            return await responseA.json();
        }
        
        console.warn('Plan A no respondió OK, pasando a Plan B...');
    } catch (error) {
        console.warn('Error en Plan A (ngrok):', error.message, 'Cambiando a Plan B...');
    }

    // Si falló Plan A, intentar Plan B (Railway)
    try {
        console.log('Intentando análisis con Plan B (railway)...');
        const responseB = await fetch(ENDPOINTS.PLAN_B, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!responseB.ok) {
            throw new Error('La API de respaldo (Railway) también falló.');
        }

        return await responseB.json();
    } catch (error) {
        console.error('Falla crítica: Ambos endpoints de la API no están disponibles.');
        throw error;
    }
}
