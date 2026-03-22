import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomRequest() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    flower_selection: '',
    wrapping_style: '',
    ribbon_color: '',
    note: '',
    budget: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div style={{ paddingTop: '150px', textAlign: 'center', color: 'var(--text-main)' }}>Please <a href="/login" style={{color: 'var(--primary)'}}>login</a> to make a custom request.</div>;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.flower_selection || !formData.wrapping_style) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('flower_selection', formData.flower_selection);
      data.append('wrapping_style', formData.wrapping_style);
      data.append('ribbon_color', formData.ribbon_color);
      data.append('note', formData.note);
      data.append('budget', formData.budget);
      if (image) data.append('image', image);

      const response = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fleurs_token')}`
        },
        body: data
      });

      if (response.ok) {
        toast.success('Custom request submitted successfully! We will contact you soon.');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit request');
      }
    } catch (err) {
      toast.error('Network Error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '4rem' }}>
      <form onSubmit={handleSubmit} className="form-container" style={{ width: '90%', maxWidth: '700px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
        <h2 style={{ color: 'var(--accent)', fontFamily: 'Cinzel, serif', textAlign: 'center', margin: '0 0 1rem 0', fontSize: '2.5rem' }}>Make Your Own</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem', fontWeight: 300 }}>
          Design the bouquet of your dreams. Our artisans will bring it to life.
        </p>

        <div className="input-group">
          <label style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Flower Selection (Required) *</label>
          <textarea 
            name="flower_selection" value={formData.flower_selection} onChange={handleChange}
            required rows="3" placeholder="e.g. 12 Red Roses, 5 White Lilies..."
            style={{ width: '100%', padding: '1rem 0.5rem', background: 'transparent', border: 'none', borderBottom: '2px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '0', resize: 'vertical', fontFamily: 'Outfit, sans-serif', transition: '0.3s' }}
            onFocus={(e) => { e.target.style.borderBottomColor = 'var(--primary)'; e.target.style.background = 'rgba(230,0,69,0.02)'; }}
            onBlur={(e) => { e.target.style.borderBottomColor = 'var(--glass-border)'; e.target.style.background = 'transparent'; }}
          ></textarea>
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Wrapping Style (Required) *</label>
          <select name="wrapping_style" value={formData.wrapping_style} onChange={handleChange} required className="filter-select">
            <option value="">Select a Wrapping Style</option>
            <option value="Classic Paper">Classic Paper</option>
            <option value="Luxury Velvet">Luxury Velvet</option>
            <option value="Rustic Burlap">Rustic Burlap</option>
            <option value="Glass Vase">Glass Vase</option>
            <option value="Signature Box">Signature Box</option>
          </select>
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Ribbon Color</label>
          <input 
            type="text" name="ribbon_color" value={formData.ribbon_color} onChange={handleChange}
            placeholder="e.g. Crimson Red, Gold, Ivory..."
            className="filter-input"
          />
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Approximate Budget (₹)</label>
          <input 
            type="text" name="budget" value={formData.budget} onChange={handleChange}
            placeholder="e.g. 5000"
            className="filter-input"
          />
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Handwritten Note</label>
          <textarea 
            name="note" value={formData.note} onChange={handleChange}
            rows="2" placeholder="Message to be included with the bouquet..."
            style={{ width: '100%', padding: '1rem 0.5rem', background: 'transparent', border: 'none', borderBottom: '2px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '0', resize: 'vertical', fontFamily: 'Outfit, sans-serif', transition: '0.3s' }}
            onFocus={(e) => { e.target.style.borderBottomColor = 'var(--primary)'; e.target.style.background = 'rgba(230,0,69,0.02)'; }}
            onBlur={(e) => { e.target.style.borderBottomColor = 'var(--glass-border)'; e.target.style.background = 'transparent'; }}
          ></textarea>
        </div>

        <div className="input-group">
          <label style={{ color: '#D5D0DB', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Reference Image or Video (Optional)</label>
          <input 
            type="file" accept="image/*,video/*" onChange={handleFileChange}
            style={{ padding: '1rem 0', color: 'var(--text-main)' }}
          />
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Custom Request'}
        </button>
      </form>
    </div>
  );
}
