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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
      {step === 1 ? (
        <form className="contact-form" onSubmit={handleRequestOTP} style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', color: '#FFF', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>Reset Password</h2>
          <p style={{ textAlign: 'center', color: '#A19BAA', marginBottom: '2rem' }}>Enter your email to receive an OTP.</p>
          <div className="form-group"><input type="email" name="email" placeholder="Email Address" required /></div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}><Link to="/login" style={{color: '#A19BAA'}}>Back to Login</Link></div>
        </form>
      ) : (
        <form className="contact-form" onSubmit={handleResetPassword} style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', color: '#FFF', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>Set New Password</h2>
          <p style={{ textAlign: 'center', color: '#A19BAA', marginBottom: '2rem' }}>OTP sent to {email}</p>
          <div className="form-group"><input type="text" name="otp" placeholder="6-digit OTP" required maxLength="6" style={{ textAlign: 'center', letterSpacing: '5px' }} /></div>
          <div className="form-group"><input type="password" name="new_password" placeholder="New Password" required /></div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      )}
    </div>
  );
}
