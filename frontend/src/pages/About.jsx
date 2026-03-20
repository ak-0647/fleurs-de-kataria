import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaGem, FaHeart, FaArrowRight, FaStar, FaInstagram } from 'react-icons/fa';

const STATS = [
  { value: '500+', label: 'Bespoke Creations' },
  { value: '98%', label: 'Happy Clients' },
  { value: '5+', label: 'Years of Artistry' },
  { value: '24H', label: 'Same Day Delivery' },
];

const VALUES = [
  {
    icon: <FaLeaf />, color: '#4caf82',
    title: 'Farm Fresh',
    desc: 'Every bloom is hand-selected at peak freshness, sourced directly from sustainable farms to ensure unrivalled quality.',
  },
  {
    icon: <FaGem />, color: '#FBE29F',
    title: 'Master Craftsmanship',
    desc: 'Our florists are trained artisans who blend classical technique with modern design to create truly one-of-a-kind arrangements.',
  },
  {
    icon: <FaHeart />, color: '#E60045',
    title: 'Made With Love',
    desc: 'Each bouquet carries a story — carefully curated, hand-tied, and delivered with warmth and personal attention.',
  },
  {
    icon: <FaStar />, color: '#a78bfa',
    title: 'Luxury Packaging',
    desc: 'Presented in our signature velvet boxes and wrapped with silk ribbons — because the unboxing is part of the magic.',
  },
];

const TEAM = [
  { name: 'Akshita Sharma', role: 'Founder & Head Florist', emoji: '🌸' },
  { name: 'Studio Team', role: 'Creative Directors', emoji: '🎨' },
  { name: 'Delivery Partners', role: 'Courier Specialists', emoji: '🚚' },
];

export default function About() {
  const heroRef = useRef(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCounted(true); },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* ── Hero Banner ── */}
      <section className="about-hero">
        <div className="about-hero-glow about-hero-glow-1" />
        <div className="about-hero-glow about-hero-glow-2" />
        <div className="about-hero-content">
          <p className="about-hero-eyebrow">Our Story</p>
          <h1 className="about-hero-title">
            Where Every Petal<br />
            <span className="about-hero-accent">Tells a Story</span>
          </h1>
          <p className="about-hero-subtitle">
            Born from a deep love of nature and beauty, Fleurs de Kataria is YNR's
            premier luxury floral atelier — crafting emotions into blooms since 2019.
          </p>
          <Link to="/collection" className="about-hero-cta">
            Explore Collection <FaArrowRight />
          </Link>
        </div>
        <div className="about-hero-visual">
          <div className="about-flower-orb">🌸</div>
          <div className="about-flower-orb about-flower-orb-2">🌺</div>
          <div className="about-flower-orb about-flower-orb-3">🌷</div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="about-stats" ref={heroRef}>
        {STATS.map((s, i) => (
          <div key={i} className="about-stat-card">
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Mission ── */}
      <section className="about-mission">
        <div className="about-mission-img-wrap">
          <div className="about-mission-img-bg">
            <span style={{ fontSize: '8rem', filter: 'drop-shadow(0 0 40px rgba(230,0,69,0.3))' }}>🌹</span>
          </div>
        </div>
        <div className="about-mission-text">
          <p className="about-section-eyebrow">Our Philosophy</p>
          <h2 className="about-section-title">Flowers Are the<br />Language of the Soul</h2>
          <p className="about-mission-body">
            At Fleurs de Kataria, we believe that flowers are more than decoration — they are 
            feelings made tangible. Every arrangement we create is a conversation between 
            nature and emotion, designed to speak when words fall short.
          </p>
          <p className="about-mission-body">
            Founded in the heart of YNR, Haryana, our boutique atelier specialises in bespoke 
            luxury florals for weddings, gifting, corporate events, and everyday moments 
            that deserve to be extraordinary.
          </p>
          <Link to="/custom-request" className="about-cta-link">
            Commission a Bespoke Piece <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values">
        <div className="about-values-header">
          <p className="about-section-eyebrow">What Sets Us Apart</p>
          <h2 className="about-section-title">The Fleurs de Kataria Promise</h2>
        </div>
        <div className="about-values-grid">
          {VALUES.map((v, i) => (
            <div key={i} className="about-value-card">
              <div className="about-value-icon" style={{ color: v.color, boxShadow: `0 0 20px ${v.color}30` }}>
                {v.icon}
              </div>
              <h3 className="about-value-title">{v.title}</h3>
              <p className="about-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-team">
        <div className="about-values-header">
          <p className="about-section-eyebrow">The Artisans</p>
          <h2 className="about-section-title">Hands Behind the Blooms</h2>
        </div>
        <div className="about-team-grid">
          {TEAM.map((t, i) => (
            <div key={i} className="about-team-card">
              <div className="about-team-avatar">{t.emoji}</div>
              <h3 className="about-team-name">{t.name}</h3>
              <p className="about-team-role">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="about-cta-banner">
        <div className="about-cta-glow" />
        <p className="about-section-eyebrow" style={{ color: 'rgba(251,226,159,0.7)' }}>Ready to Begin?</p>
        <h2 className="about-section-title" style={{ color: '#FFF', fontSize: '2.8rem' }}>
          Let's Create Something<br />
          <span style={{ color: '#FBE29F' }}>Unforgettable Together</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '1rem auto 2.5rem', lineHeight: '1.8' }}>
          Whether it's a grand wedding or a small daily luxury — we're here to craft the perfect floral moment for you.
        </p>
        <div className="about-cta-buttons">
          <Link to="/collection" className="about-btn-primary">Shop Collection</Link>
          <Link to="/custom-request" className="about-btn-secondary">Bespoke Request</Link>
        </div>
      </section>

      <style>{`
        .about-page {
          background: var(--bg-dark);
          padding-top: 80px;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .about-hero {
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
          padding: 6rem 8vw 4rem;
          position: relative;
          overflow: hidden;
        }
        .about-hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .about-hero-glow-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(230,0,69,0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .about-hero-glow-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(156,19,85,0.1) 0%, transparent 70%);
          bottom: 0; right: 0;
        }
        .about-hero-content {
          flex: 1;
          max-width: 600px;
          z-index: 1;
          animation: aboutFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }
        .about-hero-eyebrow {
          font-size: 0.78rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #E60045;
          margin-bottom: 1.2rem;
        }
        .about-hero-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          line-height: 1.15;
          color: #FFF;
          margin-bottom: 1.5rem;
        }
        .about-hero-accent {
          background: linear-gradient(135deg, #E60045, #FBE29F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .about-hero-subtitle {
          color: rgba(255,255,255,0.55);
          font-size: 1.05rem;
          line-height: 1.8;
          max-width: 480px;
          margin-bottom: 2.5rem;
        }
        .about-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #E60045, #9C1355);
          color: #FFF;
          text-decoration: none;
          padding: 0.9rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          box-shadow: 0 6px 24px rgba(230,0,69,0.35);
          transition: all 0.3s ease;
        }
        .about-hero-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(230,0,69,0.5); }

        /* Floating flowers */
        .about-hero-visual {
          position: relative;
          width: 320px;
          height: 320px;
          flex-shrink: 0;
          z-index: 1;
        }
        .about-flower-orb {
          position: absolute;
          font-size: 5rem;
          filter: drop-shadow(0 0 30px rgba(230,0,69,0.4));
          animation: floatOrb 6s ease-in-out infinite;
        }
        .about-flower-orb { top: 20px; left: 80px; animation-delay: 0s; }
        .about-flower-orb-2 { top: 160px; left: 180px; animation-delay: 2s; font-size: 3.5rem; }
        .about-flower-orb-3 { top: 200px; left: 20px; animation-delay: 4s; font-size: 4rem; }

        @keyframes floatOrb {
          0%,100% { transform: translateY(0) rotate(-5deg); }
          50%      { transform: translateY(-20px) rotate(5deg); }
        }

        /* ── Stats ── */
        .about-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0;
          background: linear-gradient(135deg, rgba(230,0,69,0.08), rgba(156,19,85,0.06));
          border-top: 1px solid rgba(230,0,69,0.12);
          border-bottom: 1px solid rgba(230,0,69,0.12);
        }
        .about-stat-card {
          padding: 2.8rem 2rem;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .about-stat-card:last-child { border-right: none; }
        .about-stat-value {
          font-family: 'Cinzel', serif;
          font-size: 2.5rem;
          color: #FBE29F;
          line-height: 1;
        }
        .about-stat-label {
          font-size: 0.78rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        /* ── Mission ── */
        .about-mission {
          display: flex;
          align-items: center;
          gap: 6rem;
          padding: 8rem 8vw;
          max-width: 1300px;
          margin: 0 auto;
        }
        .about-mission-img-wrap { flex-shrink: 0; }
        .about-mission-img-bg {
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(230,0,69,0.1) 0%, rgba(13,5,10,0.6) 70%);
          border: 1px solid rgba(230,0,69,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 80px rgba(230,0,69,0.1);
          animation: breathe 4s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,100% { box-shadow: 0 0 60px rgba(230,0,69,0.1); }
          50%      { box-shadow: 0 0 100px rgba(230,0,69,0.2); }
        }
        .about-mission-text { flex: 1; }
        .about-mission-body {
          color: rgba(255,255,255,0.55);
          font-size: 0.97rem;
          line-height: 1.9;
          margin-bottom: 1.2rem;
        }
        .about-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #E60045;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
          transition: gap 0.2s;
        }
        .about-cta-link:hover { gap: 0.9rem; }

        /* Shared eyebrow + title */
        .about-section-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #E60045;
          margin-bottom: 0.8rem;
        }
        .about-section-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          color: #FFF;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        /* ── Values ── */
        .about-values {
          padding: 6rem 8vw;
          background: rgba(255,255,255,0.01);
        }
        .about-values-header { text-align: center; margin-bottom: 4rem; }
        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .about-value-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 2.2rem 1.8rem;
          transition: transform 0.3s, border-color 0.3s;
        }
        .about-value-card:hover {
          transform: translateY(-6px);
          border-color: rgba(230,0,69,0.2);
        }
        .about-value-icon {
          font-size: 1.6rem;
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.2rem;
        }
        .about-value-title {
          font-family: 'Cinzel', serif;
          font-size: 1.05rem;
          color: #FFF;
          margin-bottom: 0.7rem;
        }
        .about-value-desc {
          color: rgba(255,255,255,0.45);
          font-size: 0.88rem;
          line-height: 1.8;
        }

        /* ── Team ── */
        .about-team {
          padding: 6rem 8vw;
        }
        .about-team-grid {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .about-team-card {
          background: linear-gradient(135deg, rgba(230,0,69,0.06), rgba(156,19,85,0.04));
          border: 1px solid rgba(230,0,69,0.12);
          border-radius: 24px;
          padding: 2.5rem 3rem;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
          min-width: 220px;
        }
        .about-team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(230,0,69,0.12);
        }
        .about-team-avatar {
          font-size: 3.5rem;
          margin-bottom: 1.2rem;
          filter: drop-shadow(0 0 16px rgba(230,0,69,0.3));
        }
        .about-team-name {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: #FFF;
          margin-bottom: 0.4rem;
        }
        .about-team-role {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* ── CTA Banner ── */
        .about-cta-banner {
          margin: 4rem 8vw 6rem;
          padding: 5rem 4rem;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(230,0,69,0.1) 0%, rgba(156,19,85,0.08) 100%);
          border: 1px solid rgba(230,0,69,0.15);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .about-cta-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(230,0,69,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .about-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .about-btn-primary {
          background: linear-gradient(135deg, #E60045, #9C1355);
          color: #FFF;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 6px 24px rgba(230,0,69,0.3);
          transition: all 0.3s ease;
        }
        .about-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(230,0,69,0.5); }
        .about-btn-secondary {
          background: transparent;
          color: #FFF;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.2);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .about-btn-secondary:hover {
          border-color: rgba(230,0,69,0.5);
          background: rgba(230,0,69,0.06);
        }

        /* Entrance animation */
        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .about-hero { flex-direction: column; text-align: center; padding: 5rem 2rem 3rem; }
          .about-hero-visual { width: 220px; height: 220px; }
          .about-mission { flex-direction: column; padding: 5rem 2rem; text-align: center; gap: 3rem; }
          .about-mission-img-bg { width: 240px; height: 240px; }
          .about-stats { grid-template-columns: repeat(2, 1fr); }
          .about-stat-card { border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
          .about-cta-banner { padding: 3rem 2rem; margin: 2rem 1rem 4rem; }
          .about-hero-subtitle { margin: 0 auto 2.5rem; }
          .about-cta-link { justify-content: center; }
        }

        @media (max-width: 500px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); }
          .about-values, .about-team { padding: 4rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
