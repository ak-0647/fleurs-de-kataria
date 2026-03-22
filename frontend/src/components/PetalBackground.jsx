import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

// Multiple petal shapes for variety
const PETAL_PATHS = [
  // Classic rose petal
  "M50 0 C70 30 90 70 50 100 C10 70 30 30 50 0",
  // Round petal
  "M50 5 C80 5 95 30 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 20 5 50 5",
  // Elongated petal
  "M50 0 C65 20 75 60 50 100 C25 60 35 20 50 0",
  // Wide petal
  "M50 10 C90 10 100 40 80 70 C65 90 35 90 20 70 C0 40 10 10 50 10",
  // Teardrop petal
  "M50 0 C80 20 85 60 70 85 C60 100 40 100 30 85 C15 60 20 20 50 0",
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

    const startDelay = (index / 55) * 20; // Stagger start times

    const reset = () => {
      gsap.set(petal, {
        x: Math.random() * window.innerWidth,
        y: -80,
        rotation: Math.random() * 360,
        scale: 0.3 + Math.random() * 1.1,
        opacity: 0,
      });

      gsap.to(petal, {
        opacity: theme === 'light' ? (0.3 + Math.random() * 0.45) : (0.12 + Math.random() * 0.3),
        duration: 1.5,
        ease: 'power2.out',
      });

      gsap.to(petal, {
        y: window.innerHeight + 120,
        x: `+=${(Math.random() - 0.5) * 350}`,
        rotation: `+=${(Math.random() - 0.5) * 900}`,
        duration: 12 + Math.random() * 18,
        delay: startDelay,
        ease: 'none',
        onComplete: reset,
      });

      // Gentle sway
      gsap.to(petal, {
        x: `+=${(Math.random() - 0.5) * 80}`,
        duration: 2 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: startDelay,
      });
    };

    reset();

    // Cinematic scroll drift
    const driftIntensity = (index % 6 + 1) * 45;
    gsap.to(petal, {
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
      x: `+=${(index % 2 === 0 ? 1 : -1) * driftIntensity}`,
      y: `+=${driftIntensity * 0.4}`,
      rotation: `+=${index % 2 === 0 ? 120 : -120}`,
    });

    return () => {
      gsap.killTweensOf(petal);
    };
  }, [index, theme]);

  return (
    <div
      ref={petalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
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
  const petals = Array.from({ length: 55 }); // Rich density

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map((_, i) => (
        <Petal key={i} index={i} />
      ))}
    </div>
  );
}
