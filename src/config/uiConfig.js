// Archivo Global para calibrar fácilmente el tamaño visual a lo largo del juego

export const GLOBAL_UI_SETTINGS = {
  // ESCALA GENERAL DEL PROYECTO EN WEB (Afecta diálogos, botones, paneles, Tailwind)
  // Valor por defecto en navegadores: "16px".
  // Aumentar (e.j. "20px", "24px") multiplicará el tamaño de absolutamente TODA la UI web.
  BASE_HTML_FONT_SIZE: "22px",

  // ESCALA DE TEXTOS EN 3D (Afecta los letreros flotantes de HP, Nombres y Daño en el Motor Canvas)
  // Valor normal: 1.0x. Puedes subirlo a 1.5, 2.0, etc.
  TEXT_3D_SCALE_FACTOR: 1.6
};
