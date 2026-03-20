import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBoxOpen, FaClipboardList, FaShuttleVan, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['PENDING', 'PREPARING', 'OUT FOR DELIVERY', 'DELIVERED'];

const OrderTracker = ({ currentStatus }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus.toUpperCase());
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem 0', position: 'relative', marginBottom: '1rem' }}>
      <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '50%', left: '0', height: '2px', background: '#E60045', width: `${(currentIndex / 3) * 100}%`, zIndex: 1, transition: 'width 0.5s ease-in-out' }}></div>
      
      {STATUS_STEPS.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        
        return (
          <div key={step} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: isCurrent ? '#E60045' : isActive ? '#9C1355' : 'rgba(255,255,255,0.1)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              border: '2px solid',
              borderColor: isCurrent ? '#FBE29F' : 'transparent',
              transition: 'all 0.3s'
            }}>
              {step === 'PENDING' && <FaClipboardList color={isActive ? '#FFF' : '#A19BAA'} />}
              {step === 'PREPARING' && <FaBoxOpen color={isActive ? '#FFF' : '#A19BAA'} />}
              {step === 'OUT FOR DELIVERY' && <FaShuttleVan color={isActive ? '#FFF' : '#A19BAA'} />}
              {step === 'DELIVERED' && <FaCheckCircle color={isActive ? '#FFF' : '#A19BAA'} />}
            </div>
            <span style={{ fontSize: '0.7rem', color: isActive ? '#FBE29F' : '#A19BAA', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: isCurrent ? 'bold' : 'normal' }}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('fleurs_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const ordersRes = await fetch('/api/orders', { headers });
      const requestsRes = await fetch('/api/user/custom-requests', { headers });
      
      const ordersData = await ordersRes.json();
      const requestsData = await requestsRes.json();
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCustomRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      toast.error('Failed to load your journey');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center', color: '#FBE29F' }}>Recalling your floral memories...</div>;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-deep)', color: '#FFF' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '3rem', color: '#FBE29F', marginBottom: '3rem', textAlign: 'center' }}>My Orders</h1>
        
        {orders.length === 0 && customRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            <p style={{ color: '#A19BAA', fontSize: '1.2rem' }}>Your floral story hasn't begun yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'rgba(15,5,10,0.6)', border: '1px solid rgba(230,0,69,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
                <div 
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div>
                    <span style={{ color: '#A19BAA', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order #{order.id}</span>
                    <h3 style={{ margin: '0.5rem 0 0', fontFamily: 'Cinzel, serif', color: '#FFF' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div>
                      <span style={{ color: '#FBE29F', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{order.total_amount}</span>
                      <p style={{ margin: 0, color: '#E60045', fontSize: '0.8rem', textTransform: 'uppercase' }}>{order.status}</p>
                    </div>
                    {expandedOrder === order.id ? <FaChevronUp color="#A19BAA" /> : <FaChevronDown color="#A19BAA" />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <OrderTracker currentStatus={order.status} />
                    
                    <div style={{ marginTop: '2rem' }}>
                      <h4 style={{ color: '#FBE29F', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Items in this order</h4>
                      {order.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                          <img src={item.image_url} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
                            <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.8rem' }}>Quantity: {item.quantity}</p>
                          </div>
                          <p style={{ margin: 0, color: '#FBE29F' }}>₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(230,0,69,0.05)', borderRadius: '12px', border: '1px solid rgba(230,0,69,0.1)' }}>
                      <h4 style={{ color: '#FFF', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Delivery Information</h4>
                      <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.85rem' }}>{order.delivery_address}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Custom Requests Session */}
            {customRequests.length > 0 && (
              <div style={{ marginTop: '4rem' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', marginBottom: '2rem' }}>Custom Masterpieces</h2>
                {customRequests.map(req => (
                  <div key={req.id} style={{ background: 'rgba(15,5,10,0.6)', border: '1px solid rgba(251,226,159,0.2)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Custom Request - {req.flower_selection}</h3>
                      <p style={{ margin: '0.3rem 0', color: '#A19BAA', fontSize: '0.8rem' }}>{new Date(req.created_at).toLocaleDateString()}</p>
                      {req.budget && <p style={{ margin: 0, color: '#FBE29F' }}>Budget: ₹{req.budget}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ padding: '0.4rem 1rem', background: 'rgba(230,0,69,0.2)', color: '#FFF', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'uppercase' }}>{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
