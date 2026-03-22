import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-main)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', marginBottom: '2rem', fontSize: '2.5rem' }}>Your Collection</h1>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>Your cart is empty.</p>
            <button onClick={() => navigate('/collection')} className="btn" style={{ padding: '1rem 3rem' }}>Explore Collection</button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map(item => (
                <div key={item.flower_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--glass)', border: '1px solid rgba(230,0,69,0.2)', borderRadius: '12px', flexWrap: 'wrap', gap: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                    )}
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Cinzel, serif', letterSpacing: '1px', color: 'var(--text-main)' }}>{item.name}</h3>
                      <p style={{ margin: '0.5rem 0 0', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{item.price}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <button 
                        onClick={() => updateQuantity(item.flower_id, item.quantity - 1)} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.5rem', width: '30px' }}
                      >-</button>
                      <span style={{ fontSize: '1.2rem', minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.flower_id, item.quantity + 1)} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.5rem', width: '30px' }}
                      >+</button>
                    </div>
                    
                      <button 
                        onClick={() => removeFromCart(item.flower_id)} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1.8rem', padding: '0.5rem' }}
                      title="Remove Item"
                    >×</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Grand Total</p>
                <h2 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '2.8rem' }}>₹{cartTotal.toLocaleString()}</h2>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={clearCart} 
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', transition: '0.3s' }}
                  onMouseOver={e => e.target.style.color = '#FFF'}
                  onMouseOut={e => e.target.style.color = '#A19BAA'}
                >Clear Cart</button>
                
                <button 
                  onClick={() => {
                    if (!user) navigate('/login');
                    else navigate('/checkout');
                  }} 
                  className="btn" 
                  style={{ padding: '1rem 3rem', fontSize: '1rem' }}
                >Proceed to Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
