import React, { useState, useEffect, useContext } from 'react';
import { FaStar, FaQuoteLeft, FaPen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OCCASIONS = ['Anniversary', 'Wedding', 'Birthday', 'Proposal', 'Gift', 'Just Because', 'Other'];

const StarRating = ({ rating, interactive = false, onRate }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <FaStar
        key={s}
        color={s <= rating ? '#FBE29F' : 'var(--glass-border)'}
        size={interactive ? 24 : 14}
        style={{ cursor: interactive ? 'pointer' : 'default', transition: 'color 0.2s' }}
        onClick={() => interactive && onRate && onRate(s)}
      />
    ))}
  </div>
);

export default function Reviews() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', rating: 0, title: '', review: '', occasion: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name }));
  }, [user]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to submit a review'); return; }
    if (form.rating === 0) { toast.error('Please select a star rating'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('fleurs_token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        let errStr = `Status ${res.status}`;
        try { const errData = await res.json(); errStr = errData.error || errStr; } catch {}
        throw new Error(errStr);
      }
      
      toast.success('Thank you for your review! 🌸');
      setForm({ name: user?.name || '', rating: 0, title: '', review: '', occasion: '' });
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-main)', paddingTop: '100px', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(230,0,69,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '0.75rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1rem' }}>Client Stories</p>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-main)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          Words From Our<br />
          <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Beloved Patrons</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          Every bouquet carries a story. Share yours or read what our patrons have to say.
        </p>

        {/* Stats Row */}
        {reviews.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2.2rem', color: 'var(--accent)' }}>{reviews.length}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>Reviews</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2.2rem', color: 'var(--accent)' }}>{avgRating}★</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '4px' }}>Average Rating</div>
            </div>
          </div>
        )}

        {/* Write Review Button */}
        <button
          onClick={() => { if (!user) { toast.error('Please login to write a review'); return; } setShowForm(v => !v); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'linear-gradient(135deg, var(--primary), #9C1355)', color: '#fff', border: 'none', padding: '0.9rem 2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 6px 24px rgba(230,0,69,0.3)', transition: 'all 0.3s' }}
        >
          <FaPen size={14} /> Write a Review
        </button>
      </section>

      {/* Submit Form */}
      {showForm && (
        <section style={{ maxWidth: '700px', margin: '0 auto 3rem', padding: '0 2rem' }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--glass)', border: '1px solid rgba(230,0,69,0.2)', borderRadius: '24px', padding: '2.5rem', backdropFilter: 'blur(16px)' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Share Your Experience</h2>

            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>Your Rating *</p>
              <StarRating rating={form.rating} interactive onRate={r => setForm(f => ({ ...f, rating: r }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Your Name *</label>
                <input required className="filter-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Priya Sharma" />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Occasion</label>
                <select className="filter-select" value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}>
                  <option value="">Select occasion</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Review Title</label>
              <input className="filter-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Absolutely Breathtaking" />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Your Review *</label>
              <textarea required className="filter-input" style={{ height: '120px', padding: '1rem', resize: 'vertical' }} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} placeholder="Tell us about your experience..." />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, var(--primary), #9C1355)', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting...' : 'Submit Review 🌸'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Reviews Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', letterSpacing: '3px', padding: '5rem' }}>LOADING STORIES...</p>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--glass)', borderRadius: '24px', border: '1px dashed var(--glass-border)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌸</div>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', marginBottom: '1rem' }}>Be the First to Share</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.8 }}>No reviews yet. If you've experienced our floral art, we'd love to hear your story.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {reviews.map(r => (
              <div
                key={r.id}
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '2.5rem', backdropFilter: 'blur(16px)', transition: 'all 0.35s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(230,0,69,0.3)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(230,0,69,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <FaQuoteLeft style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'rgba(230,0,69,0.1)', fontSize: '2.5rem' }} />

                {r.occasion && (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(230,0,69,0.1)', color: 'var(--primary)', border: '1px solid rgba(230,0,69,0.2)', marginBottom: '1rem' }}>{r.occasion}</span>
                )}

                <StarRating rating={r.rating} />

                {r.title && <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.05rem', color: 'var(--text-main)', margin: '1rem 0 0.8rem' }}>{r.title}</h3>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.85, marginBottom: '1.8rem' }}>"{r.review}"</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.2rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(230,0,69,0.15), rgba(156,19,85,0.1))', border: '1px solid rgba(230,0,69,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel, serif', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1rem' }}>
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'var(--text-main)' }}>{r.name}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ textAlign: 'center', padding: '2rem 2rem 6rem' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '3rem 2rem', backdropFilter: 'blur(16px)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Had an experience with Fleurs de Kataria? <strong style={{ color: 'var(--text-main)' }}>Login to share your story.</strong>
            </p>
            <Link to="/login" style={{ background: 'linear-gradient(135deg, var(--primary), #9C1355)', color: '#fff', padding: '0.9rem 2.2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 6px 24px rgba(230,0,69,0.3)' }}>
              Login to Write a Review
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
