import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const email = localStorage.getItem('fleurs_verify_email') || '';
  const [loading, setLoading] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) refs[idx + 1].current.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs[idx - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    paste.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    refs[Math.min(paste.length, 5)].current.focus();
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) { toast.error('Please enter all 6 digits'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Account verified! Please login.');
        localStorage.removeItem('fleurs_verify_email');
        navigate('/login');
      } else {
        toast.error(result.error || 'Verification failed');
      }
    } catch (err) {
      toast.error('Network error. Check backend connection.');
    }
    setLoading(false);
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 6)) + c)
    : '';

  return (
    <div className="otp-page">
      <div className="otp-blob otp-blob-1" />
      <div className="otp-blob otp-blob-2" />

      <form className="otp-card" onSubmit={handleSubmit}>
        {/* Icon */}
        <div className="otp-icon-wrap">
          <span className="otp-icon">✉️</span>
        </div>

        <h2 className="otp-title">Check Your Email</h2>
        <p className="otp-subtitle">
          We've sent a 6-digit verification code to
        </p>
        <p className="otp-email">{maskedEmail}</p>

        {/* 6-box OTP input */}
        <div className="otp-boxes" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              className={`otp-box ${d ? 'otp-box-filled' : ''}`}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <button type="submit" className="otp-submit" disabled={loading}>
          {loading ? <span className="otp-spinner">●</span> : '✓ Verify & Continue'}
        </button>

        <p className="otp-back">
          Wrong address?{' '}
          <Link to="/register" className="otp-link">Re-register</Link>
        </p>
      </form>

      <style>{`
        .otp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 20% 50%, #1a0010 0%, #050308 60%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .otp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .otp-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(230,0,69,0.18) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .otp-blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(156,19,85,0.14) 0%, transparent 70%);
          bottom: -80px; right: -80px;
        }

        .otp-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          animation: otpFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
          text-align: center;
        }

        @keyframes otpFadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .otp-icon-wrap {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(230,0,69,0.15), rgba(156,19,85,0.1));
          border: 1px solid rgba(230,0,69,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.8rem;
          box-shadow: 0 0 40px rgba(230,0,69,0.12);
        }
        .otp-icon { font-size: 2rem; }

        .otp-title {
          font-family: 'Cinzel', serif;
          font-size: 1.7rem;
          color: #FFF;
          margin: 0;
        }
        .otp-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 0.88rem;
          margin: 0;
        }
        .otp-email {
          color: #FBE29F;
          font-size: 0.88rem;
          font-weight: 600;
          margin: 0 0 1.2rem;
        }

        /* OTP boxes */
        .otp-boxes {
          display: flex;
          gap: 0.6rem;
          margin: 0.5rem 0 1.5rem;
        }
        .otp-box {
          width: 48px; height: 56px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #FFF;
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          caret-color: #E60045;
          font-family: 'Outfit', monospace;
        }
        .otp-box:focus {
          border-color: rgba(230,0,69,0.6);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(230,0,69,0.12);
        }
        .otp-box-filled {
          border-color: rgba(230,0,69,0.4);
          background: rgba(230,0,69,0.06);
        }

        .otp-submit {
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
          margin-top: 0.4rem;
        }
        .otp-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(230,0,69,0.5);
        }
        .otp-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .otp-spinner {
          display: inline-block;
          animation: otpPulse 0.8s ease-in-out infinite;
        }
        @keyframes otpPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        .otp-back {
          color: rgba(255,255,255,0.35);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        .otp-link {
          color: #E60045;
          text-decoration: none;
          font-weight: 600;
        }
        .otp-link:hover { color: #ff2060; }
      `}</style>
    </div>
  );
}
