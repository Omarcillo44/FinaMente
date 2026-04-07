import { Text, Center } from '@react-three/drei';

export default function Texto2D({
  contenido,
  posicion = [0, 0, 0],
  color = "red",
  fontSize = 0.5
}) {
  return (
    <group position={posicion}>
      {/* Center sigue siendo útil para alinear el texto respecto a su origen */}
      <Center>
        <Text
          font={`${import.meta.env.BASE_URL}fonts/boldpixels.ttf`} // ¡Importante! Cambiar .json por .ttf
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
        // toneMapped={false} garantiza que el color sea exacto al HEX definido
        >
          {contenido}
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Center>
    </group>
  );
}
