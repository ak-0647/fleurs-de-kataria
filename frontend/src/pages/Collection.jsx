import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaFilter } from 'react-icons/fa';

export default function Collection() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const [filters, setFilters] = useState({
    category: '',
    color: '',
    occasion: '',
    price_min: '',
    price_max: '',
    search: ''
  });

  useEffect(() => {
    fetchFlowers();
  }, [filters]);

  const fetchFlowers = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const query = new URLSearchParams(activeFilters).toString();
      const response = await fetch(`/api/flowers?${query}`);
      const data = await response.json();
      setFlowers(data);
    } catch (err) {
      toast.error('Failed to load masterpieces');
    } finally {
      setTimeout(() => setLoading(false), 500); // Artificial delay for smoother feel
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-main)' }}>
      <header style={{ textAlign: 'center', padding: '5rem 0 3rem' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '8px', margin: 0 }}>
          The Masterpiece Collection
        </h1>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '1rem', fontSize: '0.9rem' }}>Curated Excellence</p>
        <div style={{ width: '80px', height: '1px', background: 'var(--primary)', margin: '2rem auto' }}></div>
      </header>

      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '4rem', padding: '0 3rem 6rem' }}>
        {/* Sidebar Filters */}
        <aside style={{ width: '300px', flexShrink: 0, background: 'var(--sidebar-bg)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', height: 'fit-content', position: 'sticky', top: '120px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent)', marginBottom: '2rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Curate</h3>
          
          <div className="filter-group" style={{ marginBottom: '2rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>Search Masterpieces</label>
            <input 
              type="text" 
              name="search" 
              placeholder="E.g. Royal Rose..." 
              value={filters.search} 
              onChange={handleFilterChange} 
              className="filter-input"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="filter-group" style={{ marginBottom: '2rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>Flower Essence</label>
            <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
              <option value="">All Essences</option>
              <option value="Rose">Roses</option>
              <option value="Lily">Lilies</option>
              <option value="Tulip">Tulips</option>
              <option value="Orchid">Orchids</option>
              <option value="Mixed">Mixed Bouquets</option>
            </select>
          </div>

          <div className="filter-group" style={{ marginBottom: '2rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>Color Palette</label>
            <select name="color" value={filters.color} onChange={handleFilterChange} className="filter-select">
              <option value="">All Hues</option>
              <option value="Red">Crimson Red</option>
              <option value="White">Pure White</option>
              <option value="Pink">Soft Pink</option>
              <option value="Yellow">Golden Yellow</option>
              <option value="Purple">Royal Purple</option>
            </select>
          </div>

          <div className="filter-group" style={{ marginBottom: '2rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>Occasion</label>
            <select name="occasion" value={filters.occasion} onChange={handleFilterChange} className="filter-select">
              <option value="">All Occasions</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Birthday">Birthday</option>
              <option value="Wedding">Wedding</option>
              <option value="Sympathy">Sympathy</option>
              <option value="Just Because">Just Because</option>
            </select>
          </div>

          <div className="filter-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>Price Spectrum (₹)</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="number" name="price_min" placeholder="Min" value={filters.price_min} onChange={handleFilterChange} className="filter-input" />
              <input type="number" name="price_max" placeholder="Max" value={filters.price_max} onChange={handleFilterChange} className="filter-input" />
            </div>
          </div>

          <button 
            onClick={() => setFilters({ category: '', color: '', occasion: '', price_min: '', price_max: '', search: '' })}
            style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase', transition: '0.3s' }}
            onMouseOver={e => e.target.style.borderColor = 'var(--accent)'}
            onMouseOut={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            Reset Curation
          </button>
        </aside>

        {/* Gallery Grid */}
        <main style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} style={{ height: '500px', background: 'var(--skeleton-bg)', borderRadius: '24px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
               ))}
            </div>
          ) : flowers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--text-muted)', background: 'var(--skeleton-bg)', borderRadius: '24px' }}>
              <p style={{ fontSize: '1.2rem', fontFamily: 'Cinzel, serif', color: 'var(--accent)', letterSpacing: '2px' }}>A masterpiece of this nature has yet to be found.</p>
              <button 
                onClick={() => setFilters({ category: '', color: '', occasion: '', price_min: '', price_max: '', search: '' })}
                style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
              {flowers.map(flower => (
                <div key={flower.id} className="flower-card" style={{ background: 'var(--glass)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
                    <img src={flower.image_url} alt={flower.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '1s transform' }} className="zoom-on-hover" />
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--nav-bg)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--glass-border)', fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {flower.category}
                    </div>
                  </div>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>{flower.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', height: '45px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.6' }}>{flower.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                      <span style={{ fontSize: '1.8rem', color: 'var(--accent)', fontFamily: 'Cinzel, serif' }}>₹{flower.price}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(flower);
                        }}
                        className="btn" 
                        style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                      >
                        <FaShoppingCart /> Reserve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
