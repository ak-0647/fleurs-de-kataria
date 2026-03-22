import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`Welcome back, ${result.user.name}!`);
        login(result.user, result.token);
        navigate('/about');
      } else {
        toast.error(result.error || 'Authentication failed');
      }
    } catch (err) {
      toast.error('Network error. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Decorative blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        {/* Left accent strip */}
        <div className="login-accent-strip">
          <div className="login-brand">
            <span className="login-brand-icon">🌸</span>
            <span className="login-brand-name">Fleurs de Kataria</span>
          </div>
          <p className="login-brand-tagline">Luxury Floral Artistry</p>
        </div>

        {/* Right form area */}
        <div className="login-form-area">
          <div className="login-header">
            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="login-role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'USER' ? 'role-btn-active' : ''}`}
              onClick={() => setRole('USER')}
            >
              <span className="role-icon">👤</span> User
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'ADMIN' ? 'role-btn-active-admin' : ''}`}
              onClick={() => setRole('ADMIN')}
            >
              <span className="role-icon">🛡️</span> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="login-input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <div className="login-pw-header">
                <label className="login-label">Password</label>
                <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
              </div>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="login-spinner">●</span>
              ) : (
                `Sign in as ${role === 'USER' ? 'User' : 'Admin'}`
              )}
            </button>
          </form>

          <p className="login-register-text">
            Don't have an account?{' '}
            <Link to="/register" className="login-register-link">Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 20% 50%, var(--bg-deep) 0%, var(--bg-dark) 60%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .login-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .login-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(230,0,69,0.18) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .login-blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(156,19,85,0.14) 0%, transparent 70%);
          bottom: -80px; right: -80px;
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 820px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px var(--glass-border);
          animation: loginFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Accent strip ── */
        .login-accent-strip {
          width: 280px;
          flex-shrink: 0;
          background: var(--dropdown-bg);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          gap: 1rem;
          position: relative;
        }
        .login-accent-strip::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E60045' fill-opacity='0.04'%3E%3Cpath d='M30 30 L35 20 L30 25 L25 20 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }
        .login-brand-icon {
          font-size: 2.8rem;
          filter: drop-shadow(0 0 20px rgba(230,0,69,0.5));
        }
        .login-brand-name {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--accent);
          letter-spacing: 2px;
          text-align: center;
        }
        .login-brand-tagline {
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 3px;
          text-transform: uppercase;
          text-align: center;
        }

        /* ── Form area ── */
        .login-form-area {
          flex: 1;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
        }

        .login-header { }
        .login-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          color: var(--text-main);
          margin-bottom: 0.3rem;
        }
        .login-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* Role toggle */
        .login-role-toggle {
          display: flex;
          gap: 0.6rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 6px;
        }
        .role-btn {
          flex: 1;
          padding: 0.6rem;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .role-btn:hover {
          color: var(--text-main);
          background: rgba(0,0,0,0.05);
        }
        .role-btn-active {
          background: linear-gradient(135deg, var(--primary), #9C1355) !important;
          color: var(--text-main) !important;
          border-color: transparent !important;
          box-shadow: 0 4px 16px rgba(230,0,69,0.35);
        }
        .role-btn-active-admin {
          background: linear-gradient(135deg, #6d1b7b, #9C1355) !important;
          color: var(--text-main) !important;
          border-color: transparent !important;
          box-shadow: 0 4px 16px rgba(156,19,85,0.35);
        }
        .role-icon { font-size: 0.9rem; }

        /* Form fields */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .login-pw-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .login-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .login-forgot {
          font-size: 0.78rem;
          color: rgba(230,0,69,0.8);
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-forgot:hover { color: var(--primary); }

        .login-input {
          background: rgba(0,0,0,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          color: var(--text-main);
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          width: 100%;
        }
        .login-input::placeholder { color: var(--text-muted); }
        .login-input:focus {
          border-color: rgba(230,0,69,0.5);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(230,0,69,0.1);
        }

        /* Submit */
        .login-submit-btn {
          margin-top: 0.4rem;
          width: 100%;
          padding: 0.9rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), #9C1355);
          color: #FFF;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(230,0,69,0.3);
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(230,0,69,0.5);
        }
        .login-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .login-spinner {
          display: inline-block;
          animation: spinPulse 0.8s ease-in-out infinite;
        }
        @keyframes spinPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        /* Register link */
        .login-register-text {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.87rem;
        }
        .login-register-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .login-register-link:hover { color: #ff2060; }

        /* Responsive */
        @media (max-width: 600px) {
          .login-accent-strip { display: none; }
          .login-form-area { padding: 2.5rem 1.8rem; }
        }
      `}</style>
    </div>
  );
}
