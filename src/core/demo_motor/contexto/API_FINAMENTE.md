# FinaMente — Documentación técnica del backend

## Descripción general

El backend de FinaMente es una API REST construida con **Spring Boot 4.0** y **Java 21**. Su función es exclusivamente post-partida: no interviene durante la simulación (que corre 100% en el cliente). Al finalizar los 6 stages, el frontend le envía el historial completo de la partida; el backend lo persiste en MongoDB y consulta OpenAI para generar retroalimentación educativa personalizada.

```
Frontend (React/JS)
      │
      │  POST /partida/analizar  ←── historial de partida (JSON)
      ▼
Spring Boot API
      ├── MongoDB  ──→  persiste la partida + feedback
      └── OpenAI API ──→ genera retroalimentación
      │
      │  { id, feedback }
      ▼
Frontend muestra resultados al jugador
```

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Spring Boot | 4.0.5 |
| Lenguaje | Java | 21 |
| Base de datos | MongoDB Atlas | M0 (gratuito) |
| IA | OpenAI vía Spring AI | `spring-ai` 2.0.0-M4 |
| Build | Maven Wrapper | 3.9.14 |
| Utilidades | Lombok | — |

---

## Estructura de paquetes

```
com.nibbles.finamente
├── Controller/
│   └── PartidaController.java     # endpoint principal /partida/analizar
├── DTO/
│   └── PartidaRequest.java        # modelo completo de la partida (clases internas)
├── Service/
│   └── PartidaAnalisisService.java# construye prompt y llama a OpenAI
├── entity/
│   └── PartidaDocument.java       # entidad principal: partida + feedback
├── repository/
│   └── PartidaRepository.java     # repositorio principal
├── PROMPTS.java                   # enum de prompts (por definir)
└── FinamenteApplication.java      # entry point
```

---

## Configuración

El archivo `src/main/resources/application.properties` requiere dos variables de entorno:

```properties
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.mongodb.uri=mongodb+srv://admin:${MONGO_PASS}@finamente.8h2qct8.mongodb.net/?appName=FinaMente
spring.mongodb.database=finamente_db
```

Ambas se inyectan desde el entorno (`.bashrc`, `.env` o variables del sistema). Las claves nunca se hardcodean ni llegan al cliente.

---

## Endpoints

### `POST /partida/analizar`

Endpoint principal. Recibe el historial completo de una partida finalizada, genera feedback educativo con OpenAI y persiste todo en MongoDB.

**Request body** — estructura completa:

```json
{
  "perfil": {
    "perfil": "TRABAJADOR",
    "ingresoMin": 8000,
    "ingresoMax": 12000,
    "tasaInteresAnual": 0.45,
    "cat": 0.58,
    "comisionTardio": 350,
    "limiteRetiroPct": 0.2,
    "comisionRetiroPct": 0.08
  },
  "etapas": [
    {
      "stage": 1,
      "semanas": [
        {
          "semana": 1,
          "eventos": [
            {
              "tipo": "gasto",
              "gasto": {
                "nombre": "Renta Depa",
                "monto": 3500,
                "formaPago": "Debito",
                "msiElegido": 0,
                "msiPeriodoActual": "0 de 0",
                "omitido": false
              },
              "estadoJugador": {
                "saldoTDC": 0,
                "creditoDisponible": 15000,
                "efectivoDisponible": 6500,
                "calidad": 50,
                "hp": 10000,
                "pagoMinimo": 0
              }
            },
            {
              "tipo": "pago",
              "pago": {
                "metodo": "PARCIAL",
                "monto": 500
              },
              "estadoJugador": { "..." : "..." }
            }
          ]
        }
      ]
    }
  ],
  "resultadoFinal": {
    "estado": "GAME_OVER",
    "motivo": "VOLUNTARIO",
    "stats": {
      "hp": 9500,
      "score": 10,
      "cv": 58,
      "pagoMinimo": 500,
      "pagoNoIntereses": 0,
      "nuevoIngreso": 0
    }
  }
}
```

**Response** `200 OK`
```json
{
  "id": "683a1f...",
  "feedback": "Hiciste una buena decisión al usar débito para la renta y evitar intereses innecesarios. Sin embargo, el pago parcial de tu tarjeta te generará intereses el siguiente ciclo; intenta cubrir al menos el pago para no generar intereses. ¡Vas bien, con un poco más de disciplina en los pagos dominarás el crédito!"
}
```

**Colección MongoDB:** `partidas`
```json
{
  "_id": "683a1f...",
  "partida": { "perfil": {...}, "etapas": [...], "resultadoFinal": {...} },
  "feedbackIA": "Hiciste una buena decisión...",
  "fechaRegistro": "2026-04-08T14:32:00"
}
```

---

## Modelo de datos

### `PartidaRequest` (DTO de entrada)

Todas las clases son internas estáticas del DTO raíz. Usan `@JsonIgnoreProperties(ignoreUnknown = true)` para tolerar campos extra del motor JS.

```
PartidaRequest
 ├── PerfilDTO          perfil del jugador (tasas, comisiones, límites)
 ├── List<EtapaDTO>     etapas[].stage + etapas[].semanas[]
 │     └── List<SemanaDTO>
 │           └── List<EventoDTO>
 │                 ├── tipo: "gasto" | "pago"
 │                 ├── GastoDTO        (presente si tipo == "gasto")
 │                 ├── PagoDTO         (presente si tipo == "pago")
 │                 └── EstadoJugadorDTO snapshot de métricas en ese momento
 └── ResultadoFinalDTO  estado + motivo + StatsDTO
```

El polimorfismo de eventos se resuelve en el servicio con `"gasto".equals(evento.getTipo())`. Ambos campos (`gasto` y `pago`) existen en el DTO; el que no aplica llega como `null`.

### `PartidaDocument` (entidad MongoDB)

```java
@Document(collection = "partidas")
public class PartidaDocument {
    @Id String id;
    PartidaRequest partida;   // subdocumento: el JSON completo
    String feedbackIA;        // respuesta de OpenAI
    LocalDateTime fechaRegistro;
}
```

La partida se guarda como subdocumento estructurado (no como string), lo que permite queries analíticas directas sobre `partida.perfil.perfil`, `partida.resultadoFinal.estado`, etc.

---

## Lógica del servicio de análisis

`PartidaAnalisisService` construye un resumen en texto plano a partir del DTO antes de enviarlo a OpenAI. Esto evita dependencias adicionales y permite controlar exactamente qué información recibe el modelo.

**Formato del prompt de usuario generado:**

```
Perfil del jugador: TRABAJADOR
Ingreso mensual estimado: entre $8000.0 y $12000.0
Tasa de interés anual: 45.0%
CAT: 58.00000000000001%

=== Etapa 1 ===
  Semana 1:
    - [gasto] Renta Depa, $3500.0, forma de pago: Debito → HP: 9000.0, CV: 50, efectivo: $6500.0
    - [gasto] Pantalla 4K, $6000.0, forma de pago: MSI, MSI 6 meses → HP: 9000.0, CV: 62, efectivo: $6500.0
  Semana 2:
    - [pago] método PARCIAL, $500.0 → HP: 9500.0, CV: 62, efectivo: $6000.0
    - [gasto] Cena Premium, $800.0, forma de pago: Ninguna [OMITIDO] → HP: 9500.0, CV: 58, efectivo: $6000.0

Resultado final: GAME_OVER (VOLUNTARIO)
HP final: 9500.0, score: 10, calidad de vida: 58
```

**System prompt** (definido en el constructor del servicio, editable en `PROMPTS.java` a futuro):

> Eres un asesor financiero amigable dentro de un juego educativo llamado FinaMente. [...] Da una opinión breve (máximo 4 oraciones): 1 decisión positiva concreta, 1 área de mejora, 1 mensaje motivador. Responde en español, segunda persona, tono cercano.

---

## Colecciones MongoDB

| Colección | Descripción | Campos clave |
|---|---|---|
| `partidas` | Historial completo de partidas + feedback | `_id`, `partida`, `feedbackIA`, `fechaRegistro` |

**Query de ejemplo** — todas las partidas del perfil TRABAJADOR:
```
db.partidas.find({ "partida.perfil.perfil": "TRABAJADOR" })
```

---

## Variables de entorno requeridas

| Variable | Descripción |
|---|---|
| `OPENAI_API_KEY` | API key de OpenAI (nunca llega al cliente) |
| `MONGO_PASS` | Contraseña del usuario `admin` en MongoDB Atlas |

---

## Ejecución local

```bash
# Con variables exportadas en el entorno
export OPENAI_API_KEY=sk-...
export MONGO_PASS=...

./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080`. Para exposición pública durante la demo se usa Ngrok:

```bash
ngrok http 8080
```

---

## Notas de diseño

- **Sin lógica de juego en el backend.** El motor JS en el cliente es la única fuente de verdad durante la partida. El backend recibe el resultado final, no computa nada del juego.
- **Anonimato por diseño.** No se recibe ni almacena ningún dato personal. El campo `id` de MongoDB es generado automáticamente y no tiene correlación con el usuario.
- **Degradación elegante.** Si OpenAI no responde, el juego sigue siendo funcional; solo se omite el feedback. El guardado en MongoDB y el feedback son operaciones independientes.
- **Prompt editable sin recompilar.** El system prompt vive en `PartidaAnalisisService`. La intención es migrarlo al enum `PROMPTS.java` para centralizar todos los prompts del sistema.
