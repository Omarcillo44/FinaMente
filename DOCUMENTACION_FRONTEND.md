# Documentación Técnica del Frontend - FinaMente (React + Three.js)

Este documento describe la arquitectura y el flujo de los componentes en el frontend de **FinaMente**, el cual actúa como una "Capa de Presentación" construida en React y `@react-three/fiber` en torno a un Motor Lógico preexistente.

---

## 1. Arquitectura Central (El Puente Motor-Interfaz)

Dado que el `MotorJuego` es un algoritmo secuencial bloqueante basado en Promesas (`async/await`), el aspecto más importante del frontend no es cómo dibuja los menús, sino **cómo pausa de forma segura las peticiones del motor hasta que el usuario humano interactúe físicamente**.

### 1.1 El Gestor Global de Estado (`Zustand`)
En `src/store/gameStore.js` reside nuestro estado global vital:
* **`escenaActual`**: (Ej. `'Inicio'`, `'Mapa'`, `'Batalla'`) Le dice a React qué vista mayor montar.
* **`datosPantalla`**: Todo el contexto que necesita esa escena en ese momento (ej. un array de opciones de compras o el nombre de una localización).
* **`historialIA`**: El respaldo del objeto *JSON masivo* procesado al final del juego para entregarlo a Ngrok y la IA.
* **`resolverPromesa`**: La función nativa `resolve()` de Javascript en pausa. Cuando cualquier botón de la Interfaz la ejecuta, el Motor de Juego que estaba congelado prosigue con su lógica.

### 1.2 El Adaptador Asíncrono (`ReactMotorAdapter.js`)
El motor de juego solicita vistas a través de interfaces declarativas. En lugar de ejecutar `console.log()` o `prompt()` como en la demo por consola, el _Adapter_ intercepta todo:

1. El motor pide: `await adaptador.mostrarMenuGasto(...)`
2. El *Adapter* despacha al estado: `useGameStore.getState().solicitarInteraccion('Batalla', datosDelMenu)`
3. React reacciona al store de Zustand montando `BatallaView.jsx` y pintando los botones en la pantalla con la info.
4. Cuando el jugador pulsa en "Pagar con MSI", el código UI invoca `resolverPromesa('m')`.
5. El *Adapter* recibe el evento 'm', la Promesa interna hace `resolve('m')` devolviendo el control al MotorJuego, el cual continúa sus matemáticas.

---

## 2. Flujo de Navegación del Jugador

El juego transita de la siguiente manera administrada visualmente por los Hooks:

### Fases de Preparación 2D (TailwindCSS)
* `InicioView` ➜ `SeleccionPersonajesView` ➜ `SeleccionDificultadView`
* En **SeleccionDificultadView**, es el momento del _Big Bang_. Al darle al botón de un grado de dificultad, **creamos la instancia enlazada de `ReactMotorAdapter` y `MotorJuego` simultáneamente arrastrando las callbacks**, e inicializamos la cascada asíncrona mediante `motor.iniciarJuego(perfil)`.

### El Núcleo Físico en 3D (R3F)
* Una vez el Motor empieza a correr, pedirá que te dirijas a ciertas partes de la ciudad. El adaptador inyecta la escena `'Mapa'` desencadenando a `MapaView.jsx`.

---

## 3. Mapas 3D y Detección de Colisiones (Hitboxes)

### 3.1 `MapaView.jsx`
Implementa `<Canvas>` de `@react-three/fiber` para pintar el mundo tridimensional.
* Contiene el **Joystick** virtual en 2D superpuesto (`HTML overlay`), y pasa los inputs `[W,A,S,D]` o del Stick Virtual en formato booleano (`left: true`, etc) hacia adentro del Canvas.
* Presenta modales independientes como **La Banca Móvil**, **Créditos** o el propio menú de **Pausa** (este apaga/enciende la música contenida en `AudioGlobal`).

### 3.2 El Control de Físicas y Avatar (`PersonajeController.jsx`)
No usamos *Rapier* ni motores colisionadores masivos pesados para móvil, sino trigonometría clásica puramente responsiva en un `useFrame()`:
* **Movimiento**: Aplica traslación simple (`position.x`, `position.z`) basado en Deltas y los Inputs direccionales.
* **Bounding Box General**: Restringe al jugador con un set de `11 < X < 198` y `20 < Z < 151` simulando la valla de la ciudad para evitar caer al vacío.
* **El Arreglo `ZONAS_MAPA` (Hitboxes)**: Puntos (`x`,`z`) con un radio (`r`). El controlador calcula en tiempo real si el vector XZ actual pisa el radio de una zona. Si pisas un radio *esperado por el motor*, se despacha automáticamente el colisionador congelando el movimiento y resolviendo la promesa para transportar el juego a `'Batalla'`.

---

## 4. El "Battle System" Financiero (`BatallaView.jsx`)

Es un Canvas puramente estático diseñado para parecerse a un RPG:
* **`EscenarioDinamico`**: En vez de quemar 1 solo escenario, agarra el `String` emitido de forma persistente desde el `ReactMotorAdapter`, lo parsea (e.g., `Escenario_Centro_Comercial.glb`) y dibuja en 3D el cuarto de forma dinámica detrás del menú. Tiene un sistema de `ErrorBoundary` nativo atrapando errores Promise Suspense inyectando la *Recamara* como paracaídas estético si el archivo no existe.
* **`Texto2D` y `Html`**: Extraemos los datos numéricos enviados por el motor y usamos el tag `<Html center>` de Drei para anclar etiquetas HTML dinámicas flotando perfectamente ubicadas sobre los modelos importados 3D simulando stats sobre sus cuellos.

---

## 5. Game Over e Integración de Analítica de Inteligencia Artificial

* Las salidas del juego (` GameOverView.jsx `) por perder HP, sufrir insolvencia extrema o terminar voluntariamente desde la escena de Pausa desembocan en el acaparamiento seguro del `historialIA`.
* Ya que la plataforma exige conexión transparente de navegador a Backend/Python, evitamos el temido `500 Server Error` implementando directamente el Header:
  `'ngrok-skip-browser-warning': 'true'`
* Esto transporta de forma segura nuestro String masivo con la información de todos los pasos hacia el servidor python `ngrok`, para finalmente resolver la Vista con la ruta `"Retroalimentacion"` y renderizar el panel grande morado de feedback IA.

---

## 6. Detalles Estéticos & Assets
Todos los recursos estandarizados en base a React Vite:
* **Modelos `glb`**: Cuelgan directamente de `public/models/` y son recuperados mediante `useGLTF`. Importante no borrar/renombrar en disco los sufijos `.glb` sin antes replicarlos.
* **Música (`AudioGlobal.js`)**: Encapsulada como singletons `new Audio(...)` fuera del árbol reactivo para evitar solapamientos violentos si React destruye componentes padre al redibujar escenarios.
