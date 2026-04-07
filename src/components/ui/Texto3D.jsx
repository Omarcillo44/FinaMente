import { Text3D, Center } from '@react-three/drei';

export default function Texto3D({ contenido, posicion = [0, 0, 0], color = "#d94c5d" }) {
  return (
    <group position={posicion}>
      <Center>
        {/* CAPA 1: EL BORDE (Simulando el outline del sticker) */}
        <Text3D
          font={`${import.meta.env.BASE_URL}fonts/Pixels_BoldFont.ttf`}
          size={0.5}
          height={0.1}           // Muy poca profundidad
          curveSegments={2}      // Curvas toscas para estilo pixel
          bevelEnabled
          bevelSize={0.04}       // El grosor del "borde" exterior
          bevelThickness={0.01}
          bevelOffset={0}
          bevelSegments={1}
        >
          {contenido}
          {/* Color del borde */}
          <meshBasicMaterial color="#222222" />
        </Text3D>

        {/* CAPA 2: EL RELLENO (Se posiciona ligeramente al frente) */}
        <Text3D
          font={`${import.meta.env.BASE_URL}fonts/Pixels_BoldFont.json`}
          size={0.5}
          height={0.11}          // Un poquito mÃ¡s alto para que sobresalga del borde
          curveSegments={2}
          bevelEnabled={false}   // El relleno no necesita bisel
          position={[0, 0, 0.02]} // Lo movemos hacia adelante en el eje Z
        >
          {contenido}
          {/* Color principal (el rojo del logo) */}
          <meshBasicMaterial color={color} />
        </Text3D>
      </Center>
    </group>
  );
}