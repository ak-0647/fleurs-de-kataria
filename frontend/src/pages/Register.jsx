import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'OTP Sent!');
        localStorage.setItem('fleurs_verify_email', data.email);
        navigate('/verify-otp');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Network error. Check if backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="reg-page">
      <div className="reg-blob reg-blob-1" />
      <div className="reg-blob reg-blob-2" />

      <div className="reg-card">
        {/* Left accent strip */}
        <div className="reg-accent-strip">
          <div className="reg-brand">
            <span className="reg-brand-icon">🌸</span>
            <span className="reg-brand-name">Fleurs de Kataria</span>
          </div>
          <p className="reg-brand-tagline">Luxury Floral Artistry</p>
          <div className="reg-steps">
            <div className="reg-step reg-step-active">
              <span className="reg-step-dot">1</span>
              <span>Your Details</span>
            </div>
            <div className="reg-step-line" />
            <div className="reg-step">
              <span className="reg-step-dot reg-step-dot-muted">2</span>
              <span>Verify OTP</span>
            </div>
          </div>
        </div>

        {/* Right form area */}
        <div className="reg-form-area">
          <div className="reg-header">
            <h2 className="reg-title">Create Account</h2>
            <p className="reg-subtitle">Join us to experience floral luxury</p>
          </div>

          <form onSubmit={handleSubmit} className="reg-form">
            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Full Name</label>
                <input type="text" name="full_name" className="reg-input" placeholder="Jane Doe" required />
              </div>
              <div className="reg-field">
                <label className="reg-label">Phone Number</label>
                <input type="tel" name="phone" className="reg-input" placeholder="+1 234 567 8900" required />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label">Email Address</label>
              <input type="email" name="email" className="reg-input" placeholder="you@example.com" required />
            </div>

            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label">Security Question</label>
                <select name="sec_question" className="reg-select" required defaultValue="">
                  <option value="" disabled>Select a question</option>
                  <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                  <option value="What is the name of your favorite pet?">What is the name of your favorite pet?</option>
                  <option value="What city were you born in?">What city were you born in?</option>
                </select>
              </div>
              <div className="reg-field">
                <label className="reg-label">Security Answer</label>
                <input type="text" name="sec_answer" className="reg-input" placeholder="Your answer" required />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label">Password</label>
              <input type="password" name="password" className="reg-input" placeholder="••••••••" required />
            </div>

            <button type="submit" className="reg-submit-btn" disabled={loading}>
              {loading ? <span className="reg-spinner">●</span> : 'Create Account'}
            </button>
          </form>

          <p className="reg-login-text">
            Already have an account?{' '}
            <Link to="/login" className="reg-login-link">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .reg-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 20% 50%, #1a0010 0%, #050308 60%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .reg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .reg-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(230,0,69,0.18) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .reg-blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(156,19,85,0.14) 0%, transparent 70%);
          bottom: -80px; right: -80px;
        }

        .reg-card {
          display: flex;
          width: 100%;
          max-width: 900px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          animation: regFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes regFadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Accent strip ── */
        .reg-accent-strip {
          width: 260px;
          flex-shrink: 0;
          background: linear-gradient(160deg, #2a001a 0%, #140010 50%, #0D050A 100%);
          border-right: 1px solid rgba(230,0,69,0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          gap: 1.5rem;
        }

        .reg-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }
        .reg-brand-icon {
          font-size: 2.8rem;
          filter: drop-shadow(0 0 20px rgba(230,0,69,0.5));
        }
        .reg-brand-name {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: #FBE29F;
          letter-spacing: 2px;
          text-align: center;
        }
        .reg-brand-tagline {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 3px;
          text-transform: uppercase;
          text-align: center;
        }

        /* Steps */
        .reg-steps {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin-top: 1rem;
          width: 100%;
        }
        .reg-step {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: rgba(255,255,255,0.35);
          font-size: 0.82rem;
          width: 100%;
        }
        .reg-step-active {
          color: rgba(255,255,255,0.85);
        }
        .reg-step-dot {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E60045, #9C1355);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(230,0,69,0.4);
        }
        .reg-step-dot-muted {
          background: rgba(255,255,255,0.08) !important;
          box-shadow: none !important;
          color: rgba(255,255,255,0.3);
        }
        .reg-step-line {
          width: 1px; height: 24px;
          background: rgba(255,255,255,0.1);
          margin: 4px 0 4px 12px;
        }

        /* ── Form area ── */
        .reg-form-area {
          flex: 1;
          padding: 2.8rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.4rem;
        }

        .reg-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          color: #FFF;
          margin-bottom: 0.3rem;
        }
        .reg-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
        }

        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .reg-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .reg-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .reg-input, .reg-select {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.8rem 1rem;
          color: #FFF;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          width: 100%;
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.2); }
        .reg-input:focus, .reg-select:focus {
          border-color: rgba(230,0,69,0.5);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(230,0,69,0.1);
        }
        .reg-select option {
          background: #1a0010;
          color: #FFF;
        }

        .reg-submit-btn {
          margin-top: 0.3rem;
          width: 100%;
          padding: 0.9rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #E60045, #9C1355);
          color: #FFF;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(230,0,69,0.3);
        }
        .reg-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(230,0,69,0.5);
        }
        .reg-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .reg-spinner {
          display: inline-block;
          animation: regPulse 0.8s ease-in-out infinite;
        }
        @keyframes regPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        .reg-login-text {
          text-align: center;
          color: rgba(255,255,255,0.35);
          font-size: 0.87rem;
        }
        .reg-login-link {
          color: #E60045;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .reg-login-link:hover { color: #ff2060; }

        @media (max-width: 640px) {
          .reg-accent-strip { display: none; }
          .reg-form-area { padding: 2.5rem 1.8rem; }
          .reg-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
