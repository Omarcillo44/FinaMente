# Documentación Técnica del Frontend - FinaMente (React + Three.js)

Este documento describe la arquitectura y el flujo de los componentes en el frontend de **FinaMente**, el cual actúa como una "Capa de Presentación" construida en React y `@react-three/fiber` en torno a un Motor Lógico preexistente. *(Nota: Esta documentación pertenece estrictamente al Front-End. Los entresijos lógicos y secuenciales matemáticos residen blindados dentro del Motor).*

---

## 1. Arquitectura Central (El Puente Motor-Interfaz)

Dado que el `MotorJuego` es un algoritmo secuencial bloqueante basado en Promesas (`async/await`), el aspecto más importante del frontend no es cómo dibuja los menús, sino **cómo pausa de forma segura las peticiones del motor hasta que el usuario humano interactúe físicamente**.

### 1.1 El Gestor Global de Estado (`Zustand`)
En `src/store/gameStore.js` reside nuestro estado global vital:
* **`escenaActual`**: (Ej. `'Inicio'`, `'Mapa'`, `'Batalla'`) Le dice a React qué componente raíz principal montar.
* **`datosPantalla`**: Todo el contexto que necesita esa escena en ese momento (ej. un array de opciones de compras o el nombre de una localización).
* **`historialIA`**: El respaldo del objeto *JSON masivo* procesado al final del juego para entregarlo a Ngrok y la IA.
* **`resolverPromesa`**: La función nativa `resolve()` de Javascript en pausa. Cuando cualquier botón de la Interfaz la ejecuta, el Motor de Juego que estaba congelado prosigue con su lógica matemática.

### 1.2 El Adaptador Asíncrono (`ReactMotorAdapter.js`)
El motor de juego solicita vistas a través de interfaces declarativas. El _Adapter_ intercepta los mensajes de texto del núcleo:
1. El motor pide: `await adaptador.mostrarMenuGasto(...)`
2. El *Adapter* despacha al estado general: `useGameStore.getState().solicitarInteraccion('Batalla', datosDelMenu)`
3. React reacciona al hook de Zustand montando `BatallaView.jsx` y pintando localmente en base a las variables.
4. Cuando el jugador pulsa un botón en la interfaz, el código UI invoca `resolverPromesa('respuesta')`.
5. El *Adapter* escucha la resolución y devuelve la variable al Engine, el cual continúa su operación como si nunca se hubiera pausado.

---

## 2. Flujo de Navegación del Jugador

### 2.1 Preparación 2D y Cinemáticas (TailwindCSS)
El flujo estricto inicial sigue la ruta: 
`InicioView` ➜ `SeleccionPersonajesView` ➜ `VideoPersonajeView` ➜ `SeleccionDificultadView`

* **`VideoPersonajeView`**: Reproduce la cinemática propia del avatar elegido mediante archivos mp4 dinámicos (ej: `public/videos/amanda.mp4`). Contiene soporte de _Fallback_ puro en pantalla negra en caso de archivos borrados del caché local y botones universales para evitar bloqueos del jugador (Omitir / Continuar).
* **`SeleccionDificultadView`**: Construida como una cuadrícula Jumbo (3/4 de pantalla). Es el momento del _Big Bang_ del flujo. Al seleccionar el perfil socioeconómico, **creamos la instancia enlazada de `ReactMotorAdapter` y `MotorJuego` simultáneamente**, inicializando la cascada asíncrona mediante `motor.iniciarJuego(perfil)`.

### 2.2 El Núcleo Físico en 3D (R3F)
Una vez el Motor arranca, solicitará por primera vez desplazamientos hacia ubicaciones en la ciudad en el plano XZ, desencadenando la vista mayor tipo mundo interactivo en `MapaView.jsx`.

---

## 3. Mapas 3D y HUD Dinámico

### 3.1 `MapaView.jsx` y Pestaña Deslizable
Implementa `<Canvas>` de `@react-three/fiber` para pintar el mundo tridimensional.
* **HUD Deslizable**: Posee una lengüeta superior retráctil que permite ocular toda la interfaz estática compartida (`SharedHUD`, Menús Acoplables, Lista de Misiones) deslizándolas simétricamente fuera de los bordes de la pantalla (translaciones CSS Hardware Accelerated). Así el usuario experimenta una visión total de las ubicaciones sin distracciones gráficas.
* Contiene modales independientes con prioridades z-index robustas (`100+`) para  sobreponerse al 3D, incluyendo **Banca Móvil**, **Croquis**, y la matriz de **Pausa**.

### 3.2 Indicadores Visuales en tiempo real (Flechas 3D)
La visualización en vivo implementa el parseo automático de tus tareas y misiones. React detecta las variables activas publicadas por el Adaptador, itera los localizadores exactos en `ZONAS_MAPA` y teletransporta el archivo `Flechas.glb` cargándolas en malla amarilla vibrante iluminada (`MeshStandardMaterial`), rotando rápida y centradamente (`drei Center`) sobre sí misma animada con `useFrame`. Cuando el jugador cumple una misión, la flecha de esa zona física del pueblo desaparece inmediatamente del cielo.

### 3.3 El Controlador Físico y Zonas Seguras (`PersonajeController.jsx`)
Usa trigonometría pura y clásica (evitando la sobrecarga térmica y peso de un motor de colisiones físico como Rapier) dentro de del loop animado (`useFrame()`):
* Restringe límites (`Bounding Box General`) para que el personaje no caiga o se salga del mapa mediante barreras rígidas en X y Z.
* Evalúa `ZONAS_MAPA` (los Hitboxes): Mediante una comprobación de hipotenusa y radio circular en tiempo real verifica si el vector XZ está pisando la puerta del objetivo. Si pisas el radio local *solicitado en el array del motor*, se despacha colisión segura bloqueando ese vector temporalmente, y transportándote visualmente en React a `'Batalla'`.

---

## 4. El "Battle System" Financiero (`BatallaView.jsx`)

Diseñado simulando la escenografía de los combates de un RPG por turnos con controles financieros de pago estricto.
* **Restricción y Sanitización Local**: Operaciones sensibles como "Negociar M.S.I." primero ejecutan lógicas condicionales locales estrictas en React. Si tu billetera/saldo de tarjeta no puede soportarlo, React levanta el aviso modal nativo de estatus (`StatusFeedback`) de manera suave, interrumpiendo el flujo del clic y evitando escupir variables ilegales en formato inyección de vuelta al Algoritmo Base. El motor matemático se mantiene completamente puro e ignora los _missclicks_ del jugador.
* **Escenografía Dinámica `EscenarioDinamico`**: Componente asíncrono que detecta el nombre crudo de la plaza enviado por el Engine y renderiza el `.glb` adecuado para vestir el fondo tridimensional (`Escenario_Centro_Comercial.glb`). Para mitigar vulnerabilidades, cuenta con un robusto _ErrorBoundary_ nativo que cargará el paracaídas visual de la "Habitación" sin crashear el loop en caso de problemas de RAM en móviles, o una falta de archivo accidental.

---

## 5. Salida e Inteligencia Artificial (Feedback / Prompts)

* Las interrupciones críticas generadas del gestor (`GameOverView.jsx`) como perder los puntos de vida o insolvencia, desembocan en el vaciado forzado final de tu JSON `historialIA`.
* Ya que la arquitectura incluye comunicación hacia Backends aislados (Ejemplo uso con Python y Tunneling Externo), ejecutamos peticiones blindadas inyectando localmente headers puente (e.g. `ngrok-skip-browser-warning: true`).
* Resuelta la asincronía y el parseo del Endpoint Python/Gemini, se dispara como última vista reactiva el `RetroalimentacionView`, inyectando la cadena textual estructurada, brindándole de forma natural todo el contexto al fin del juego.
