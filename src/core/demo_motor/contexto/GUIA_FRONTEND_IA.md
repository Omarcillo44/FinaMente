# ⚡ Guía Rápida: IA + React

Para integrar el análisis de IA, sigue estos 3 pasos exactos:

### 1. Define el método en tu objeto `vista`
Este es el encargado de **mostrar** el resultado final en la UI (ej. un Modal).

```javascript
const vistaReact = {
    // ... otros métodos
    mostrarFeedbackAPI: (feedback) => {
        setModalIA({ open: true, content: feedback });
    },
    mostrarCargandoAnalisis: () => {
        setLoadingIA(true);
    }
};
```

### 2. Configura el trigger `onGameOver`
Aquí es donde **consumes** la API usando el JSON que el motor te entrega.

```javascript
import { solicitarAnalisisIA } from '../../apiUtils.js';

motor.onGameOver = async (historialJSON) => {
    vistaReact.mostrarCargandoAnalisis();
    
    try {
        const result = await solicitarAnalisisIA(historialJSON);
        vistaReact.mostrarFeedbackAPI(result.feedback);
    } catch (error) {
        console.error("Falla crítica en API", error);
    }
};
```

### 3. Consideraciones clave
*   **Triggers**: `onGameOver` se dispara solo en: Victoria, Game Over (HP 0), Insolvencia o Salida Voluntaria.
*   **Data**: `historialJSON` es el objeto completo que requiere el backend; no lo filtres.
*   **Endpoints (Fallback)**: 
    1.  **Prioridad**: `ngrok` (Plan A).
    2.  **Respaldo**: `Railway` (Plan B).
*   **Utilidad**: Se recomienda usar siempre `solicitarAnalisisIA(payload)` de `src/core/apiUtils.js`.
