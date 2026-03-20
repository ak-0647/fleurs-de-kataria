import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import HeroScene from '../components/HeroScene';
import { FaArrowRight, FaGem, FaLeaf, FaMagic } from 'react-icons/fa';

export default function Home() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(titleRef.current, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 })
      .to(subtitleRef.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1");
  }, []);

  const CATEGORIES = [
    { title: 'Haute Bouquets', icon: <FaMagic />, image: '/images/instagram/ig_0.jpg' },
    { title: 'Bespoke Boxes', icon: <FaGem />, image: '/images/instagram/ig_2.jpg' },
    { title: 'Signature Blooms', icon: <FaLeaf />, image: '/images/instagram/ig_4.jpg' },
  ];

  return (
    <div style={{ background: 'var(--bg-dark)' }}>
      {/* Hero Section */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <HeroScene />
        </div>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, rgba(13,5,10,0.3) 0%, rgba(5,3,8,0.8) 100%)' }}>
          <h1 ref={titleRef} style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', margin: 0, opacity: 0, transform: 'translateY(50px)', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Fleurs de Kataria</h1>
          <p ref={subtitleRef} style={{ fontSize: '1.2rem', letterSpacing: '8px', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0, transform: 'translateY(30px)', marginTop: '1rem' }}>The Art of Eternal Bloom</p>
          <div style={{ marginTop: '3rem' }}>
            <Link to="/collection" className="btn" style={{ textDecoration: 'none' }}>Explore Masterpieces <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem' }}>Our Ateliers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '500px' }}>
              <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s transform' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem' }}>
                <div style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '1rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '1rem' }}>{cat.title}</h3>
                <Link to={`/collection?category=${cat.title}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  VIEW ATELIER <FaArrowRight fontSize="0.7rem" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Join the List */}
      <section style={{ padding: '10rem 2rem', background: 'var(--bg-deep)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>Join the Inner Circle</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.8' }}>
            Invitation-only access to our seasonal collections, limited edition releases, <br/> and the art of fine floral orchestration.
          </p>
          <div style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '0', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFF', padding: '0 2rem', outline: 'none', fontSize: '0.9rem' }}
            />
            <button className="btn">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section style={{ padding: '8rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>EXQUISITE PACKAGING</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Presented in our signature velvet boxes and hand-tied with silk ribbons.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>SAME DAY DELIVERY</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hand-delivered by our specialized couriers to ensure pristine condition.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>BESPOKE SERVICE</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Consult with our master florists for truly unique, personal masterpieces.</p>
        </div>
      </section>
    </div>
  );
}
