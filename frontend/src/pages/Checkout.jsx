import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div style={{ paddingTop: '150px', textAlign: 'center', color: 'var(--text-main)' }}>Please login to checkout.</div>;
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Cart is empty");
    if (!address.trim()) return toast.error("Please enter a delivery address");

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fleurs_token')}`
        },
        body: JSON.stringify({
          items: cartItems.map(i => ({ flower_id: i.flower_id, quantity: i.quantity, price: i.price })),
          delivery_address: address,
          total_amount: cartTotal
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order #${data.orderId} placed successfully!`);
        clearCart();
        navigate('/dashboard');
      } else {
        toast.error(data.error || 'Checkout failed');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '4rem' }}>
      <form onSubmit={handleCheckout} className="form-container" style={{ width: '90%', maxWidth: '600px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
        <h2 style={{ color: 'var(--accent)', fontFamily: 'Cinzel, serif', textAlign: 'center', margin: '0 0 2rem 0', fontSize: '2rem' }}>Secure Checkout</h2>
        
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--text-main)', margin: '0 0 1rem 0', fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>Order Summary</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Total Items: {cartItems.reduce((a,b)=>a+b.quantity,0)}</p>
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>
          <h3 style={{ color: 'var(--primary)', margin: '0', fontSize: '1.5rem' }}>Total: ₹{cartTotal.toFixed(2)}</h3>
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Delivery Address</label>
          <textarea 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows="4"
            style={{ width: '100%', padding: '1rem 0.5rem', background: 'transparent', border: 'none', borderBottom: '2px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '0', resize: 'vertical', fontFamily: 'Outfit, sans-serif', transition: '0.3s' }}
            onFocus={(e) => { e.target.style.borderBottomColor = 'var(--primary)'; e.target.style.background = 'rgba(230,0,69,0.02)'; }}
            onBlur={(e) => { e.target.style.borderBottomColor = 'var(--glass-border)'; e.target.style.background = 'transparent'; }}
            placeholder="Enter full delivery address..."
          ></textarea>
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm & Place Order'}
        </button>
      </form>
    </div>
  );
}
