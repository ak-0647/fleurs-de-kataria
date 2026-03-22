import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [requests, setRequests] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showFlowerModal, setShowFlowerModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, message: '' });
  const [editingFlower, setEditingFlower] = useState(null);
  const [flowerForm, setFlowerForm] = useState({
    name: '', description: '', price: '', image_url: '', category: '', color: '', occasion: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('fleurs_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [orderRes, reqRes, flowerRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/custom-requests', { headers }),
        fetch('/api/admin/flowers', { headers })
      ]);
      
      if (orderRes.ok) {
        const ordersData = await orderRes.json();
        setOrders(ordersData);
        const map = {};
        ordersData.forEach(o => { map[o.id] = o.status; });
        setStatusMap(map);
      }
      if (reqRes.ok) setRequests(await reqRes.json());
      if (flowerRes.ok) setFlowers(await flowerRes.json());
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleFlowerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('fleurs_token');
      const method = editingFlower ? 'PUT' : 'POST';
      const url = editingFlower ? `/api/admin/flowers/${editingFlower.id}` : '/api/admin/flowers';
      
      const data = new FormData();
      data.append('name', flowerForm.name);
      data.append('description', flowerForm.description);
      data.append('price', flowerForm.price);
      data.append('category', flowerForm.category);
      data.append('color', flowerForm.color);
      data.append('occasion', flowerForm.occasion);
      if (e.target.flower_file.files[0]) {
        data.append('flower_file', e.target.flower_file.files[0]);
      } else if (editingFlower) {
        data.append('image_url', flowerForm.image_url);
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      
      if (res.ok) {
        toast.success(editingFlower ? 'Flower updated' : 'Flower added');
        setShowFlowerModal(false);
        setEditingFlower(null);
        setFlowerForm({ name: '', description: '', price: '', image_url: '', category: '', color: '', occasion: '' });
        fetchData();
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Operation failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const deleteFlower = async (id) => {
    setConfirmData({ id, message: 'Erase this masterpiece from the collection?' });
    setShowConfirm(true);
  };

  const executeDelete = async () => {
    const { id } = confirmData;
    setShowConfirm(false);
    try {
      const res = await fetch(`/api/admin/flowers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('fleurs_token')}` }
      });
      if (res.ok) {
        toast.success('Flower deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openEditModal = (flower) => {
    setEditingFlower(flower);
    setFlowerForm(flower);
    setShowFlowerModal(true);
  };

  const updateOrder = async (orderId, updates) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('fleurs_token')}` },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        toast.success('Order status updated');
        fetchData();
      } else {
        toast.error('Failed to update order');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const updateRequest = async (reqId, status) => {
    try {
      const response = await fetch(`/api/admin/custom-requests/${reqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('fleurs_token')}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        toast.success('Request updated');
        fetchData();
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-main)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '3rem', margin: 0 }}>The Atelier Guild</h1>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Administrator Portal</p>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setActiveTab('orders')} style={{ padding: '1rem 2rem', background: 'transparent', border: 'none', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : 'none', transition: '0.3s' }}>Orders</button>
          <button onClick={() => setActiveTab('requests')} style={{ padding: '1rem 2rem', background: 'transparent', border: 'none', color: activeTab === 'requests' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: activeTab === 'requests' ? '2px solid var(--primary)' : 'none', transition: '0.3s' }}>Bespoke Requests</button>
          <button onClick={() => setActiveTab('flowers')} style={{ padding: '1rem 2rem', background: 'transparent', border: 'none', color: activeTab === 'flowers' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: activeTab === 'flowers' ? '2px solid var(--primary)' : 'none', transition: '0.3s' }}>Catalog</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '10rem', color: '#FBE29F', fontFamily: 'Cinzel, serif', letterSpacing: '4px' }}>ACCESSING RECORDS...</div>
        ) : (
          <div>
            {activeTab === 'orders' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100%, 1fr))', gap: '2rem' }}>
                {orders.length === 0 ? <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '5rem'}}>No transactions recorded.</p> : orders.map(order => (
                  <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(230,0,69,0.15)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ flex: '1 1 400px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <h3 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', margin: 0, fontSize: '1.5rem' }}>Order #{order.id}</h3>
                        <Link to={`/admin/orders/${order.id}`} style={{ color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', textDecoration: 'none' }}>Detailed View</Link>
                        <span style={{ background: 'rgba(5,3,8,0.8)', padding: '0.3rem 1rem', borderRadius: '20px', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{order.status}</span>
                      </div>
                      <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
                      
                      <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}><strong>Recipient:</strong> {order.full_name}</p>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}><strong>Contact:</strong> {order.email} | {order.phone}</p>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}><strong>Ship to:</strong> {order.delivery_address}</p>
                      </div>

                      <h4 style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Composition (Total: ₹{order.total_amount}):</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {order.items?.map(item => (
                          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={item.image_url} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem' }}>{item.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.quantity} units @ ₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ flex: '0 0 320px', background: 'var(--glass)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>Fulfillment</h4>
                      <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Status</label>
                        <select className="filter-select" value={statusMap[order.id] || order.status} onChange={(e) => {
                          const newStatus = e.target.value;
                          setStatusMap(prev => ({ ...prev, [order.id]: newStatus }));
                        }}>
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Curated By</label>
                        <input type="text" className="filter-input" placeholder="Executor Name..." defaultValue={order.delivery_personnel || ''} id={`personnel-${order.id}`} />
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Delivery Window</label>
                        <input type="datetime-local" className="filter-input" id={`time-${order.id}`} defaultValue={order.delivery_time ? new Date(order.delivery_time).toISOString().slice(0,16) : ''} />
                      </div>
                      <button className="btn" style={{ width: '100%', padding: '1rem', fontSize: '0.8rem' }} onClick={() => {
                        const personnel = document.getElementById(`personnel-${order.id}`).value;
                        const time = document.getElementById(`time-${order.id}`).value;
                        const currentStatus = statusMap[order.id] || order.status;
                        updateOrder(order.id, { status: currentStatus, delivery_personnel: personnel, delivery_time: time });
                      }}>Update Journey</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'requests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {requests.length === 0 ? <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '5rem'}}>No bespoke inquiries.</p> : requests.map(req => (
                  <div key={req.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(251,226,159,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem' }}>
                      <div style={{ flex: '1 1 500px' }}>
                        <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', margin: '0 0 1rem 0', fontSize: '1.8rem' }}>Bespoke Inquiry #{req.id}</h3>
                        <div style={{ background: 'rgba(230,0,69,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(230,0,69,0.1)', marginBottom: '1.5rem' }}>
                            <p style={{ margin: '0 0 0.8rem 0', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px' }}>Customer Brief</p>
                            <p style={{ margin: '0 0 0.5rem 0' }}><strong>Client:</strong> {req.full_name} ({req.email})</p>
                            <p style={{ margin: '0 0 1rem 0' }}><strong>Requested At:</strong> {new Date(req.created_at).toLocaleString()}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div><p style={{ color: 'var(--text-muted)', margin: 0 }}>FLORAL CHOICE</p><p style={{ margin: '0.2rem 0 0 0' }}>{req.flower_selection}</p></div>
                                <div><p style={{ color: 'var(--text-muted)', margin: 0 }}>WRAPPING</p><p style={{ margin: '0.2rem 0 0 0' }}>{req.wrapping_style}</p></div>
                                <div><p style={{ color: 'var(--text-muted)', margin: 0 }}>RIBBONS</p><p style={{ margin: '0.2rem 0 0 0' }}>{req.ribbon_color || 'Standard'}</p></div>
                                <div><p style={{ color: 'var(--text-muted)', margin: 0 }}>BUDGET</p><p style={{ margin: '0.2rem 0 0 0', color: '#FBE29F' }}>₹{req.budget || 'Open'}</p></div>
                            </div>
                        </div>
                        <p style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent)', color: 'var(--text-main)', lineClamp: '3', overflow: 'hidden' }}>
                            <strong>Personal Note:</strong> {req.note || "No custom note provided."}
                        </p>
                      </div>
                      
                      {req.image_path && (
                        <div style={{ flex: '0 0 250px' }}>
                          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Inspiration Reference</p>
                          <a href={req.image_path} target="_blank" rel="noreferrer">
                            <img src={req.image_path} alt="Reference" style={{ width: '100%', borderRadius: '16px', border: '1px solid rgba(251,226,159,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                          </a>
                        </div>
                      )}

                      <div style={{ flex: '0 0 250px', background: 'var(--glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Set Inquiry Status</label>
                        <select className="filter-select" value={req.status} onChange={(e) => updateRequest(req.id, e.target.value)} style={{ marginBottom: '1rem' }}>
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>Setting to 'Accepted' will notify the client via their registered portal.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'flowers' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                  <button className="btn" onClick={() => { setEditingFlower(null); setFlowerForm({ name: '', description: '', price: '', image_url: '', category: '', color: '', occasion: '' }); setShowFlowerModal(true); }}>
                    + Commission New Masterpiece
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                  {flowers.map(f => (
                    <div key={f.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <img src={f.image_url} alt={f.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      <div style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{f.name}</h3>
                        <p style={{ color: '#FBE29F', fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>₹{f.price}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                           <span style={{ fontSize: '0.7rem', background: 'rgba(230,0,69,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{f.category}</span>
                           <span style={{ fontSize: '0.7rem', background: 'rgba(251,226,159,0.1)', color: '#FBE29F', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{f.occasion}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button onClick={() => openEditModal(f)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => deleteFlower(f.id)} style={{ flex: 1, background: 'rgba(230,0,69,0.1)', border: '1px solid rgba(230,0,69,0.2)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Flower Modal */}
        {showFlowerModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <div style={{ background: '#0D050A', border: '1px solid #FBE29F', padding: '3rem', borderRadius: '24px', width: '600px', maxWidth: '90%' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', marginBottom: '2rem', textAlign: 'center' }}>{editingFlower ? 'Edit Masterpiece' : 'Commission New Masterpiece'}</h2>
              <form onSubmit={handleFlowerSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Full Name</label>
                  <input required className="filter-input" value={flowerForm.name} onChange={e => setFlowerForm({...flowerForm, name: e.target.value})} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Description</label>
                  <textarea required className="filter-input" style={{ height: '80px', padding: '1rem' }} value={flowerForm.description} onChange={e => setFlowerForm({...flowerForm, description: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Price (₹)</label>
                  <input required type="number" className="filter-input" value={flowerForm.price} onChange={e => setFlowerForm({...flowerForm, price: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Category</label>
                  <select required className="filter-select" value={flowerForm.category} onChange={e => setFlowerForm({...flowerForm, category: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="Rose">Rose</option>
                    <option value="Lily">Lily</option>
                    <option value="Tulip">Tulip</option>
                    <option value="Orchid">Orchid</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Color</label>
                  <input required className="filter-input" value={flowerForm.color} onChange={e => setFlowerForm({...flowerForm, color: e.target.value})} placeholder="e.g. Royal Red" />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Occasion</label>
                  <input required className="filter-input" value={flowerForm.occasion} onChange={e => setFlowerForm({...flowerForm, occasion: e.target.value})} placeholder="e.g. Anniversary" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Upload Image/Video</label>
                  <input type="file" name="flower_file" accept="image/*,video/*" className="filter-input" style={{ padding: '0.5rem' }} />
                  {editingFlower && <p style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Leave blank to keep current media</p>}
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn" style={{ flex: 2 }}>{editingFlower ? 'Update Masterpiece' : 'Add to Collection'}</button>
                  <button type="button" className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid #A19BAA', color: 'var(--text-muted)' }} onClick={() => setShowFlowerModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {showConfirm && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div style={{ background: 'rgba(15,5,10,0.95)', border: '1px solid rgba(230,0,69,0.3)', padding: '2.5rem', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 0 40px rgba(230,0,69,0.2)' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', marginBottom: '1rem', fontSize: '1.5rem' }}>Are you sure?</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>{confirmData.message}</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setShowConfirm(false)}
                  style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', borderRadius: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  style={{ flex: 1, padding: '0.8rem', background: '#E60045', border: 'none', color: 'var(--text-main)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(230,0,69,0.3)' }}
                >
                  Yes, Erase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
