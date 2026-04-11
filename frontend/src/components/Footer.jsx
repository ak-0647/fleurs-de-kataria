import React, { useState } from 'react';
import { FaInstagram, FaFacebookF, FaPinterestP, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Footer() {
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
      toast.success('You\'re subscribed! Welcome 🌸');
      setTimeout(() => { setNlDone(false); setNlEmail(''); }, 4000);
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe. Please try again later.');
      setNlDone(false);
    } finally {
      setNlLoading(false);
    }
  };

  return (
    <footer style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--glass-border)', padding: '5rem 2rem 2rem', marginTop: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>

        {/* Brand Section */}
        <div>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Fleurs de Kataria</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.9rem' }}>
            We make beautiful flower bouquets for every special moment in your life.
          </p>
          <div style={{ display: 'flex', gap: '1.2rem', marginTop: '2rem' }}>
            <a href="#" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}><FaInstagram /></a>
            <a href="#" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}><FaFacebookF /></a>
            <a href="#" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}><FaPinterestP /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link to="/collection" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Flower Collection</Link></li>
            <li><Link to="/custom-request" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Custom Orders</Link></li>
            <li><Link to="/orders" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>My Orders</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Contact Us</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><FaMapMarkerAlt color="var(--primary)" /> YNR, Haryana</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><FaPhoneAlt color="var(--primary)" /> 9416427080</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', wordBreak: 'break-all' }}><FaEnvelope color="var(--primary)" style={{ flexShrink: 0 }} /> katariadiljot@gmail.com</li>
          </ul>
        </div>

        {/* Newsletter Section — redesigned & functional */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(230,0,69,0.06) 0%, rgba(156,19,85,0.04) 100%)',
          padding: '1.8rem',
          borderRadius: '16px',
          border: '1px solid rgba(230,0,69,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌸</span>
            <h4 style={{ color: 'var(--accent)', fontFamily: 'Cinzel, serif', fontSize: '1rem', margin: 0 }}>Join the Inner Circle</h4>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
            Get updates on new flowers and special deals.
          </p>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={nlEmail}
              onChange={e => setNlEmail(e.target.value)}
              required
              disabled={nlLoading || nlDone}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass)',
                color: 'var(--text-main)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              disabled={nlLoading || nlDone}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: nlDone
                  ? 'linear-gradient(135deg, #1a7a3a, #145c2c)'
                  : 'linear-gradient(135deg, var(--primary), #9C1355)',
                color: '#FFF',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '0.88rem',
                letterSpacing: '0.5px',
                cursor: nlLoading || nlDone ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: nlDone ? '0 4px 15px rgba(26,122,58,0.3)' : '0 4px 15px rgba(230,0,69,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: nlLoading ? 0.7 : 1,
              }}
            >
              {nlDone ? <><FaCheck /> Subscribed!</> : nlLoading ? 'Joining...' : 'Join Now'}
            </button>
          </form>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '4rem', padding: '1.5rem 0 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} Fleurs de Kataria. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
