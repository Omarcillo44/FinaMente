/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <-- ESTA LÍNEA ES VITAL
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['BoldPixel', 'sans-serif'],
      }
    },
  },
  plugins: [],
}