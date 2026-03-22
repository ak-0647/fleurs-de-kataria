import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaBox, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchOrder();
  }, [user, id, navigate]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('fleurs_token');
      const res = await fetch(`/api/admin/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrder(await res.json());
      } else {
        toast.error('Order not found');
        navigate('/admin');
      }
    } catch (err) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (updates) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('fleurs_token')}` 
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        toast.success('Order updated successfully');
        fetchOrder();
      } else {
        toast.error('Failed to update order');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (loading) return (
    <div style={{ paddingTop: '200px', textAlign: 'center', color: 'var(--accent)', fontFamily: 'Cinzel, serif', letterSpacing: '4px' }}>
      RETRIEVING ORDER MANUSCRIPT...
    </div>
  );

  if (!order) return null;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-main)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', width: 'fit-content' }}>
          <FaArrowLeft /> Back to Atelier Guild
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid rgba(251,226,159,0.1)', paddingBottom: '1.5rem' }}>
          <div>
            <span style={{ color: '#E60045', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Detailed Acquisition</span>
            <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '3rem', margin: '0.5rem 0 0' }}>Order #{order.id}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Ordered on {new Date(order.created_at).toLocaleString()}</p>
            <span style={{ background: 'rgba(230,0,69,0.15)', padding: '0.5rem 1.5rem', borderRadius: '30px', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              {order.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          
          {/* Left Column: Customer & Shipping */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <section style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <FaUser size={18} /> Beneficiary
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{order.full_name}</p>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>{order.email}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{order.phone}</p>
            </section>

            <section style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <FaMapMarkerAlt size={18} /> Destination
              </h3>
              <p style={{ margin: 0, color: '#D5D0DB', lineHeight: '1.6' }}>{order.delivery_address}</p>
            </section>

            <section style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Fulfillment Control</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Update Status</label>
                <select 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer' }}
                  value={order.status} 
                  onChange={(e) => updateOrder({ status: e.target.value, delivery_personnel: order.delivery_personnel, delivery_time: order.delivery_time })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Delivery Personnel</label>
                <input 
                  type="text" 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '8px' }}
                  placeholder="Assign curating spirit..." 
                  defaultValue={order.delivery_personnel || ''} 
                  onBlur={(e) => updateOrder({ status: order.status, delivery_personnel: e.target.value, delivery_time: order.delivery_time })} 
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Scheduled Time</label>
                <input 
                  type="datetime-local" 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '8px' }}
                  defaultValue={order.delivery_time ? new Date(order.delivery_time).toISOString().slice(0,16) : ''} 
                  onBlur={(e) => updateOrder({ status: order.status, delivery_personnel: order.delivery_personnel, delivery_time: e.target.value })}
                  className="filter-input"
                />
              </div>
            </section>
          </div>

          {/* Right Column: Items */}
          <div style={{ background: 'var(--glass)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(251,226,159,0.1)' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <FaBox size={20} /> Composition
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(251,226,159,0.2)' }} />
                    <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#E60045', color: 'var(--text-main)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{item.name}</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{item.price} per specimen</p>
                  </div>
                  <p style={{ margin: 0, color: 'var(--accent)', fontWeight: 'bold' }}>₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '2px solid rgba(251,226,159,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Tribute</span>
                <span style={{ color: 'var(--accent)' }}>Complimentary</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', color: 'var(--text-main)' }}>Total Worth</span>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: 'var(--accent)' }}>₹{order.total_amount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
