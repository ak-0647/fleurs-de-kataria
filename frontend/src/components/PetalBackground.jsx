import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
        scale: 0.4 + Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.35,
      });

      // Continuous falling animation
      gsap.to(petal, {
        y: window.innerHeight + 100,
        x: `+=${(Math.random() - 0.5) * 300}`,
        rotation: `+=${Math.random() * 720}`,
        duration: 15 + Math.random() * 15,
        ease: "none",
        onComplete: reset,
      });
      
      // Gentle floating sway
      gsap.to(petal, {
        x: `+=${(Math.random() - 0.5) * 60}`,
        duration: 3 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    };

    reset();

    // CINEMATIC SCROLL INTERACTION:
    // This makes petals "drift" sideways and speed up slightly as the user scrolls
    const driftIntensity = (index % 5 + 1) * 50; // Variable intensity based on index
    
    gsap.to(petal, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smooth scrub for cinematic feel
      },
      x: `+=${(index % 2 === 0 ? 1 : -1) * driftIntensity}`, // Drift left or right
      y: `+=${driftIntensity * 0.5}`, // Parallax downward boost
      rotation: `+=${index % 2 === 0 ? 90 : -90}`,
    });

    return () => {
      gsap.killTweensOf(petal);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [index]);

  return (
    <div
      ref={petalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        width: '18px',
        height: '18px',
      }}
    >
      <svg viewBox="0 0 100 100" fill="var(--primary)" style={{ filter: 'drop-shadow(0 2px 4px rgba(230,0,69,0.15))', opacity: 0.6 }}>
        <path d="M50 0 C70 30 90 70 50 100 C10 70 30 30 50 0" />
      </svg>
    </div>
  );
};

export default function PetalBackground() {
  const petals = Array.from({ length: 30 }); // Slightly more petals for cinematic density

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map((_, i) => (
        <Petal key={i} index={i} />
      ))}
    </div>
  );
}
