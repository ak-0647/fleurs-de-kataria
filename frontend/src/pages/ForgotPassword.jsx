import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const eInput = formData.get('email');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: eInput })
      });
      const result = await res.json();
      if (res.ok) {
        setEmail(eInput);
        setStep(2);
        toast.success(result.message || 'OTP Sent!');
      } else {
        toast.error(result.error || 'Failed to send OTP.');
      }
    } catch(err) {
      toast.error('Network Error');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: formData.get('otp'),
          new_password: formData.get('new_password')
        })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'Password reset success!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Failed to reset password');
      }
    } catch(err) {
      toast.error('Network Error');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card" style={{ maxWidth: '450px' }}>
        <div className="login-form-area" style={{ padding: '3rem 2rem' }}>
          <div className="login-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 className="login-title" style={{ fontSize: '1.6rem' }}>
              {step === 1 ? 'Reset Password' : 'Set New Password'}
            </h2>
            <p className="login-subtitle">
              {step === 1 
                ? 'Enter your email to receive an OTP' 
                : `OTP sent to ${email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="login-form">
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
              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? <span className="login-spinner">●</span> : 'Send OTP'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/login" className="login-register-link" style={{ fontSize: '0.9rem' }}>
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="login-form">
              <div className="login-field">
                <label className="login-label">Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  className="login-input"
                  placeholder="6-digit OTP"
                  required
                  maxLength="6"
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </div>
              <div className="login-field">
                <label className="login-label">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  className="login-input"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? <span className="login-spinner">●</span> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 50% 50%, var(--bg-deep) 0%, var(--bg-dark) 100%);
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
          background: radial-gradient(circle, rgba(230,0,69,0.12) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .login-blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(156,19,85,0.1) 0%, transparent 70%);
          bottom: -80px; right: -80px;
        }
        .login-card {
          width: 100%;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px var(--glass-border);
          animation: fadeUp 0.6s ease-out;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-form-area { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .login-title { font-family: 'Cinzel', serif; color: var(--text-main); }
        .login-subtitle { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem;}
        .login-form { display: flex; flex-direction: column; gap: 1.2rem; }
        .login-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .login-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .login-input {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0.9rem 1rem;
          color: var(--text-main);
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: all 0.3s;
        }
        .login-input:focus { border-color: var(--primary); background: rgba(230,0,69,0.02); }
        .login-submit-btn {
          padding: 1rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #E60045, #9C1355);
          color: #FFF;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 20px rgba(230,0,69,0.3);
        }
        .login-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(230,0,69,0.4); }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-register-link { color: #E60045; text-decoration: none; font-weight: 500; transition: 0.3s; }
        .login-register-link:hover { color: #ff2a6d; text-decoration: underline; }
        .login-spinner { display: inline-block; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
