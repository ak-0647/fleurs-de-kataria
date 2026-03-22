import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';

// Authentic petal shapes (no circles or blobs)
const PETAL_PATHS = [
  // Classic rose petal
  "M50 0 C70 30 90 70 50 100 C10 70 30 30 50 0",
  // Slightly asymmetric
  "M50 0 C80 40 85 70 50 100 C15 70 20 40 50 0",
  // Slimmer elegant petal
  "M50 0 C65 30 80 70 50 100 C20 70 35 30 50 0",
];

const PETAL_SIZES = [12, 16, 20, 24, 14, 18, 22];

const Petal = ({ index }) => {
  const petalRef = useRef(null);
  const { theme } = useTheme();

  const pathIndex = index % PETAL_PATHS.length;
  const size = PETAL_SIZES[index % PETAL_SIZES.length];

  // Colors based on theme — set via data attribute so CSS handles it
  const darkColors = ['#E60045', '#9C1355', '#FF3366', '#CC0044', '#FF6B8A', '#B5003C'];
  const lightColors = ['#FF85A1', '#FFB3C6', '#FF6B99', '#E85885', '#FFC2D4', '#D6336C'];
  const colors = theme === 'light' ? lightColors : darkColors;
  const color = colors[index % colors.length];

  useEffect(() => {
    const petal = petalRef.current;
    if (!petal) return;

    // Pre-scatter petals across the entire viewport initially so there is NO DELAY
    gsap.set(petal, {
      x: Math.random() * window.innerWidth,
      y: (Math.random() * window.innerHeight * 1.5) - 100, // Distribute them from top to below screen
      rotation: Math.random() * 360,
      scale: 0.3 + Math.random() * 1.1,
      opacity: theme === 'light' ? (0.3 + Math.random() * 0.45) : (0.12 + Math.random() * 0.3),
    });

    const animatePetal = () => {
      const currentY = gsap.getProperty(petal, "y");
      const targetY = window.innerHeight + 120;
      
      // Calculate remaining distance and adjust duration so speed is consistent
      const remainingDistance = targetY - currentY;
      const baseDuration = 12 + Math.random() * 18;
      const duration = Math.max((remainingDistance / window.innerHeight) * baseDuration, 2);

      gsap.to(petal, {
        y: targetY,
        x: `+=${(Math.random() - 0.5) * 200}`,
        rotation: `+=${(Math.random() - 0.5) * 400}`,
        duration: duration,
        ease: 'none',
        onComplete: () => {
          gsap.set(petal, { 
            y: -100 - (Math.random() * 200), // Reset above screen
            x: Math.random() * window.innerWidth 
          });
          animatePetal(); // Loop
        }
      });
    };

    animatePetal();

    // Gentle sway
    gsap.to(petal, {
      x: `+=${(Math.random() - 0.5) * 80}`,
      duration: 2 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Removed scroll drift as requested so they only fall down

    return () => {
      gsap.killTweensOf(petal);
    };
  }, [theme, index]); // Re-run if theme changes to update opacity immediately

  return (
    <div
      ref={petalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0, // Fall behind cards
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill={color}
        style={{
          filter: theme === 'light'
            ? `drop-shadow(0 2px 6px ${color}55)`
            : `drop-shadow(0 2px 4px ${color}30)`,
          width: '100%',
          height: '100%',
        }}
      >
        <path d={PETAL_PATHS[pathIndex]} />
      </svg>
    </div>
  );
};

export default function PetalBackground() {
  const petals = Array.from({ length: 120 }); // Ultra rich density

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map((_, i) => (
        <Petal key={i} index={i} />
      ))}
    </div>
  );
}
