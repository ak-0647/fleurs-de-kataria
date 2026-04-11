import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';
import { FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const aboutRef = useRef(null);
  const footerRef = useRef(null);
  
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  useEffect(() => {
    if (user) {
      const tl = gsap.timeline();
      tl.fromTo(cardRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .fromTo(aboutRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, "-=0.6")
        .fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' }, "-=0.4");

      // Continuous Floating Ambient Orbs
      gsap.to(orb1Ref.current, {
        x: '150px', y: '100px', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to(orb2Ref.current, {
        x: '-200px', y: '-150px', duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
      });
      gsap.to(orb3Ref.current, {
        scale: 1.3, x: '80px', y: '-60px', duration: 15, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2
      });
    }
  }, [user]);

  if (!user) {
    return <div style={{ paddingTop: '20vh', color: 'white', textAlign: 'center' }}>Please login to view your profile.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-deep)', color: 'var(--text-main)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Ambient Animated Glowing Background Orbs */}
      <div ref={orb1Ref} style={{ position: 'absolute', top: '15%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(230,0,69,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div ref={orb2Ref} style={{ position: 'absolute', top: '50%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(156,19,85,0.15) 0%, transparent 70%)', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div ref={orb3Ref} style={{ position: 'absolute', bottom: '10%', left: '30%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(251,226,159,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }}></div>


      {/* Welcome Card */}
      <div ref={cardRef} style={{ background: 'var(--glass)', padding: '4rem', borderRadius: '16px', border: '1px solid var(--glass-border)', textAlign: 'center', maxWidth: '650px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', marginBottom: '5rem', position: 'relative', zIndex: 10, backdropFilter: 'blur(16px)' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', marginBottom: '1rem', fontSize: '3rem' }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Authentication Level: {user.role}</p>
        
        <p style={{ marginBottom: '3rem', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 300 }}>
          Your exclusive access to the Haute Couture Floral Art collection is now active.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/collection')} className="btn">Enter The Masterpiece Collection</button>
        </div>
      </div>

      {/* About Section - Wrapped in Luxe Glassmorphism */}
      <div ref={aboutRef} style={{ maxWidth: '900px', width: '90%', textAlign: 'center', marginBottom: '5rem', padding: '4rem 3rem', background: 'var(--glass)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', borderRadius: '24px', position: 'relative', zIndex: 10, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '2rem', textShadow: '0 0 20px rgba(230,0,69,0.3)' }}>The Art of Fleurs de Kataria</h2>
        <div style={{ color: 'var(--text-main)', fontSize: '1.15rem', lineHeight: '1.9', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p>Welcome to a sanctuary of haute couture floral artistry, where passion blossoms into tangible elegant masterpieces. As an independent artisan, I dedicate myself fully to the craft of botanical design, ensuring that every single petal, arrangement, and bouquet is meticulously handcrafted by me.</p>
          <p>I specialize in weaving nature's finest elements into bespoke, custom-made floral creations tailored exactly to your unique requirements, sentiments, and lavish celebrations. From intimate, heartfelt gestures to grand, unforgettable events, my floral artistry speaks the timeless language of luxury and profound devotion.</p>
          <p>By personally sourcing, crafting, and orchestrating every bouquet, I ensure that your vision is brought to life with unparalleled dedication and precision. Let us transform your most cherished moments into breathtaking memories with the delicate touch of true artisan craftsmanship.</p>
        </div>
      </div>

      {/* Luxury Footer */}
      <footer ref={footerRef} style={{ width: '100%', position: 'relative', zIndex: 10, background: 'var(--glass)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--glass-border)', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: 'auto' }}>
        <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1.8rem', letterSpacing: '2px', margin: 0 }}>Fleurs de Kataria</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FaMapMarkerAlt color="var(--primary)" size={20} />
            <span>YNR, Haryana</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FaEnvelope color="var(--primary)" size={20} />
            <a href="mailto:katariadiljot@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--text-main)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>katariadiljot@gmail.com</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FaPhoneAlt color="var(--primary)" size={20} />
            <a href="tel:9416427080" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color='var(--text-main)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>+91 94164 27080</a>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <a href="https://www.instagram.com/fleursdekataria/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#FFF', textDecoration: 'none', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', transition: 'transform 0.3s', boxShadow: '0 4px 15px rgba(220, 39, 67, 0.4)' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
            <FaInstagram size={24} />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <p style={{ color: '#6A6373', fontSize: '0.9rem', marginTop: '2rem' }}>
          &copy; {new Date().getFullYear()} Fleurs de Kataria. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
