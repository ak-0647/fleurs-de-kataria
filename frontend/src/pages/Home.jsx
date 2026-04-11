import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import HeroScene from '../components/HeroScene';
import { FaArrowRight, FaGem, FaLeaf, FaMagic, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Home() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [nlEmail, setNlEmail] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlDone, setNlDone] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!nlEmail.trim()) return;
    setNlLoading(true);
    try {
      const res = await fetch(`/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Subscription failed');

      setNlDone(true);
      toast.success('Welcome! You have joined our newsletter 🌸');
      setTimeout(() => { setNlDone(false); setNlEmail(''); }, 4000);
    } catch (err) {
      toast.error(err.message || 'Could not subscribe. Please try again.');
      setNlDone(false);
    } finally {
      setNlLoading(false);
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(titleRef.current, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 })
      .to(subtitleRef.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1");
  }, []);

  const CATEGORIES = [
    { title: 'Premium Bouquets', icon: <FaMagic />, image: '/images/instagram/ig_0.jpg' },
    { title: 'Gift Boxes', icon: <FaGem />, image: '/images/instagram/ig_2.jpg' },
    { title: 'Special Flowers', icon: <FaLeaf />, image: '/images/instagram/ig_4.jpg' },
  ];

  return (
    <div style={{ background: 'var(--bg-dark)' }}>
      {/* Hero Section */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <HeroScene />
        </div>
        <div className="hero-overlay" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 ref={titleRef} style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', margin: 0, opacity: 0, transform: 'translateY(50px)', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Fleurs de Kataria</h1>
          <p ref={subtitleRef} style={{ fontSize: '1.2rem', letterSpacing: '8px', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0, transform: 'translateY(30px)', marginTop: '1rem' }}>Beautiful Flowers, Always Fresh</p>
          <div style={{ marginTop: '3rem' }}>
            <Link to="/collection" className="btn" style={{ textDecoration: 'none' }}>View Our Flowers <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem' }}>Our Collections</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '500px' }}>
              <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s transform' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'var(--card-overlay)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem' }}>
                <div style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '1rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>{cat.title}</h3>
                <Link to={`/collection?category=${cat.title}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  VIEW MORE <FaArrowRight fontSize="0.7rem" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '10rem 2rem', background: 'var(--bg-deep)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>Join Our Newsletter</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.8' }}>
            Get updates on new flowers, special offers, <br /> and flower care tips — straight to your inbox.
          </p>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '0', background: 'var(--newsletter-bg)', padding: '5px', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={nlEmail}
              onChange={(e) => setNlEmail(e.target.value)}
              disabled={nlLoading || nlDone}
              required
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '0 2rem', outline: 'none', fontSize: '0.9rem' }}
            />
            <button
              type="submit"
              disabled={nlLoading || nlDone}
              className="btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: nlDone ? 'var(--primary)' : '' }}
            >
              {nlDone ? <><FaCheck /> Subscribed</> : nlLoading ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>BEAUTIFUL PACKAGING</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Each order comes in a nice box tied with a ribbon.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>SAME DAY DELIVERY</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We deliver fresh flowers to your door the same day.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>CUSTOM ORDERS</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Talk to us and we'll make a special bouquet just for you.</p>
        </div>
      </section>
    </div>
  );
}
