import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Petal = ({ index }) => {
  const petalRef = useRef(null);

  useEffect(() => {
    const petal = petalRef.current;
    
    // Initial random position and properties
    const reset = () => {
      gsap.set(petal, {
        x: Math.random() * window.innerWidth,
        y: -50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        opacity: 0.2 + Math.random() * 0.4,
      });

      // Animation
      gsap.to(petal, {
        y: window.innerHeight + 50,
        x: `+=${(Math.random() - 0.5) * 400}`,
        rotation: `+=${Math.random() * 720}`,
        duration: 10 + Math.random() * 15,
        ease: "none",
        onComplete: reset,
      });
      
      // Horizontal sway
      gsap.to(petal, {
        x: `+=${(Math.random() - 0.5) * 50}`,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    };

    reset();

    return () => gsap.killTweensOf(petal);
  }, []);

  return (
    <div
      ref={petalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        width: '20px',
        height: '20px',
      }}
    >
      <svg viewBox="0 0 100 100" fill="#E60045">
        {/* Simple petal shape */}
        <path d="M50 0 C70 30 90 70 50 100 C10 70 30 30 50 0" />
      </svg>
    </div>
  );
};

export default function PetalBackground() {
  const petals = Array.from({ length: 25 });

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map((_, i) => (
        <Petal key={i} index={i} />
      ))}
    </div>
  );
}
