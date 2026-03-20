import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div style={{ paddingTop: '20vh', color: 'white', textAlign: 'center' }}>Please login to view your profile.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)', color: '#FFF' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4rem', borderRadius: '16px', border: '1px solid rgba(230,0,69,0.3)', width: '100%', maxWidth: '500px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        <FaUserCircle size={80} color="#E60045" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>{user.name}</h2>
        <p style={{ color: '#A19BAA', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3rem', fontSize: '0.9rem' }}>Member Profile</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaEnvelope color="#E60045" size={20} />
            <div>
              <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email Address</p>
              <p style={{ margin: 0, color: '#FFF', fontSize: '1.1rem' }}>{user.email}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaShieldAlt color="#E60045" size={20} />
            <div>
              <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.8rem', textTransform: 'uppercase' }}>Security Role</p>
              <p style={{ margin: 0, color: '#FFF', fontSize: '1.1rem' }}>{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
