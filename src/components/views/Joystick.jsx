import React, { useRef, useState } from 'react';

export default function Joystick({ onChange }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const radius = 50; // radio maximo en pixels

  const handlePointerDown = (e) => {
    setActive(true);
    updateStick(e.clientX, e.clientY);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!active) return;
    updateStick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 }); // reset al centro
    e.target.releasePointerCapture(e.pointerId);
  };

  const updateStick = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > radius) {
      dx = dx * (radius / distance);
      dy = dy * (radius / distance);
    }

    setPosition({ x: dx, y: dy });
    onChange({ x: dx / radius, y: dy / radius }); // valores entre -1 y 1
  };

  return (
    <div 
      ref={containerRef}
      className="w-[120px] h-[120px] bg-slate-800/80 rounded-full flex items-center justify-center relative shadow-lg cursor-pointer"
      style={{ touchAction: 'none' }} // Evita scroll en móviles al usar el joystick
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div 
        className="w-[60px] h-[60px] bg-slate-500 hover:bg-slate-400 rounded-full shadow-md pointer-events-none transition-transform"
        style={{ transform: `translate(${position.x}px, ${position.y}px)`, transitionDuration: active ? '0s' : '0.2s' }}
      />
    </div>
  );
}
