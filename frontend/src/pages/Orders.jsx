import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBoxOpen, FaClipboardList, FaShuttleVan, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['PENDING', 'PREPARING', 'OUT FOR DELIVERY', 'DELIVERED'];
const BESPOKE_STEPS = ['PENDING', 'REVIEWED', 'ACCEPTED', 'COMPLETED'];

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
              padding: '10px',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              border: isActive ? '2px solid #FBE29F' : '2px solid transparent',
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

const BespokeTracker = ({ currentStatus }) => {
  const currentIndex = BESPOKE_STEPS.indexOf(currentStatus.toUpperCase());
  const steps = [
    { name: 'PENDING', icon: FaClipboardList },
    { name: 'REVIEWED', icon: FaClipboardList }, // Could use another icon if imported
    { name: 'ACCEPTED', icon: FaCheckCircle },
    { name: 'COMPLETED', icon: FaCheckCircle }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', position: 'relative', marginBottom: '1rem', width: '100%' }}>
      <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '50%', left: '0', height: '2px', background: '#FBE29F', width: `${(currentIndex / 3) * 100}%`, zIndex: 1, transition: 'width 0.5s' }}></div>
      
      {BESPOKE_STEPS.map((step, idx) => {
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: isCurrent ? '#FBE29F' : isActive ? 'rgba(251,226,159,0.3)' : 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              border: '1px solid',
              borderColor: isCurrent ? '#FFF' : 'transparent',
              transition: 'all 0.3s'
            }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? '#000' : '#444' }}></div>
            </div>
            <span style={{ fontSize: '0.6rem', color: isActive ? '#FBE29F' : '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{step}</span>
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

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center', color: '#FBE29F', fontFamily: 'Cinzel, serif', letterSpacing: '4px' }}>RECALLING YOUR FLORAL MEMORIES...</div>;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-deep)', color: '#FFF' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '3.5rem', color: '#FBE29F', marginBottom: '4rem', textAlign: 'center' }}>My Orders & Masterpieces</h1>
        
        {orders.length === 0 && customRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '10rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(251,226,159,0.1)' }}>
            <p style={{ color: '#A19BAA', fontSize: '1.2rem', fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}>Your floral story hasn't begun yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(230,0,69,0.15)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
                <div 
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#A19BAA', textTransform: 'uppercase', letterSpacing: '1px' }}>Order</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', color: '#FBE29F', fontFamily: 'Cinzel, serif' }}>#{order.id}</p>
                    </div>
                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
                      <h3 style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: '1.2rem', color: '#FFF' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                      <p style={{ margin: '0.3rem 0 0', color: '#A19BAA', fontSize: '0.8rem' }}>{order.items.length} unique treasures</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div>
                      <span style={{ color: '#FBE29F', fontSize: '1.6rem', fontWeight: 'lighter', fontFamily: 'Cinzel, serif' }}>₹{order.total_amount}</span>
                      <p style={{ margin: 0, color: '#E60045', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>{order.status}</p>
                    </div>
                    {expandedOrder === order.id ? <FaChevronUp color="#E60045" /> : <FaChevronDown color="#A19BAA" />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div style={{ padding: '0 2rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    <OrderTracker currentStatus={order.status} />
                    
                    <div style={{ marginTop: '3rem' }}>
                      <h4 style={{ color: '#FBE29F', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '2rem', textAlign: 'center' }}>Composition</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {order.items.map(item => (
                          <div key={item.id} style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <img src={item.image_url} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <p style={{ margin: 0, fontWeight: 'bold', color: '#FFF' }}>{item.name}</p>
                              <p style={{ margin: '0.2rem 0', color: '#A19BAA', fontSize: '0.8rem' }}>Quantity: {item.quantity}</p>
                              <p style={{ margin: 0, color: '#FBE29F', fontSize: '0.9rem' }}>₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(230,0,69,0.03)', borderRadius: '16px', border: '1px solid rgba(230,0,69,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: '#E60045', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Delivery Destination</h4>
                        <p style={{ margin: 0, color: '#D5D0DB', fontSize: '0.85rem' }}>{order.delivery_address}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</p>
                         <p style={{ margin: 0, color: '#FFF', fontSize: '0.9rem' }}>{order.status}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Custom Requests Session */}
            {customRequests.length > 0 && (
              <div style={{ marginTop: '5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(251,226,159,0.3))', flex: 1 }}></div>
                    <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', fontSize: '2rem', margin: 0 }}>Bespoke Masterpieces</h2>
                    <div style={{ height: '1px', background: 'linear-gradient(to left, transparent, rgba(251,226,159,0.3))', flex: 1 }}></div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
                  {customRequests.map(req => (
                    <div key={req.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(251,226,159,0.15)', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ color: '#FBE29F', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid rgba(251,226,159,0.3)', padding: '2px 8px', borderRadius: '10px' }}>Inquiry #{req.id}</span>
                          <h3 style={{ margin: '1rem 0 0.5rem', fontFamily: 'Cinzel, serif', fontSize: '1.4rem' }}>{req.flower_selection}</h3>
                          <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.8rem' }}>Requested on {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ margin: 0, color: '#FBE29F', fontSize: '1.2rem', fontFamily: 'Cinzel, serif' }}>₹{req.budget || '---'}</p>
                           <p style={{ margin: '0.2rem 0 0', color: '#A19BAA', fontSize: '0.7rem', textTransform: 'uppercase' }}>Estimated Budget</p>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                         <BespokeTracker currentStatus={req.status} />
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <p style={{ margin: 0, color: '#FBE29F', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current State</p>
                            <p style={{ margin: 0, color: '#FFF', fontSize: '0.85rem', fontWeight: 'bold' }}>{req.status}</p>
                         </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {req.image_path && (
                          <img src={req.image_path} alt="Reference" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(251,226,159,0.2)' }} />
                        )}
                        <div style={{ flex: 1 }}>
                           <p style={{ margin: 0, color: '#A19BAA', fontSize: '0.8rem', fontStyle: 'italic' }}>"{req.note || "No custom note provided."}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
