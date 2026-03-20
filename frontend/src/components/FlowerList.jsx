import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function FlowerList() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // Filters state
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    occasion: '',
    price_min: '',
    price_max: ''
  });

  const fetchFlowers = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.color) params.append('color', filters.color);
      if (filters.occasion) params.append('occasion', filters.occasion);
      if (filters.price_min) params.append('price_min', filters.price_min);
      if (filters.price_max) params.append('price_max', filters.price_max);

      const response = await fetch(`/api/flowers?${params.toString()}`);
      const data = await response.json();
      if (Array.isArray(data)) {
          setFlowers(data);
      }
    } catch (err) {
      console.error('Failed to fetch', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const categories = ['Rose', 'Lily', 'Tulip', 'Orchid', 'Mixed'];
  const colors = ['Red', 'White', 'Pink', 'Yellow', 'Purple', 'Mixed'];
  const occasions = ['Birthday', 'Anniversary', 'Wedding', 'Sympathy', 'Just Because'];

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      
      {/* Sidebar Filters */}
      <div style={{ flex: '1 1 250px', background: 'rgba(15, 5, 10, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(230,0,69,0.15)', borderRadius: '12px', padding: '1.5rem', alignSelf: 'flex-start' }}>
        <h3 style={{ fontFamily: 'Cinzel, serif', color: '#FBE29F', borderBottom: '1px solid rgba(251,226,159,0.2)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Curate Collection</h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#E60045', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Flower Type</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
            <option value="">All Types</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#E60045', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Color Palette</label>
          <select name="color" value={filters.color} onChange={handleFilterChange} className="filter-select">
            <option value="">All Colors</option>
            {colors.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#E60045', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Occasion</label>
          <select name="occasion" value={filters.occasion} onChange={handleFilterChange} className="filter-select">
            <option value="">All Occasions</option>
            {occasions.map(occ => <option key={occ} value={occ}>{occ}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#E60045', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price Range (₹)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <input type="number" name="price_min" placeholder="Min" value={filters.price_min} onChange={handleFilterChange} className="filter-input" style={{ width: '50%' }} />
             <input type="number" name="price_max" placeholder="Max" value={filters.price_max} onChange={handleFilterChange} className="filter-input" style={{ width: '50%' }} />
          </div>
        </div>

        <button onClick={() => setFilters({category: '', color: '', occasion: '', price_min: '', price_max: ''})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#A19BAA', padding: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', borderRadius: '4px', transition: 'all 0.3s' }} onMouseOver={e=>e.target.style.color='#FFF'} onMouseOut={e=>e.target.style.color='#A19BAA'}>Reset Filters</button>

      </div>

      {/* Flower Grid */}
      <div style={{ flex: '3 1 700px' }}>
        {loading ? (
           <div style={{textAlign: "center", padding: '3rem 0', color: '#FBE29F'}}>Curating collection...</div>
        ) : (
          <div className="flower-grid">
            {flowers.length > 0 ? flowers.map((flower) => (
              <div key={flower.id} className="flower-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {flower.image_url && (
                  <div className="flower-image-container">
                    <img src={flower.image_url} alt={flower.name} className="flower-image" />
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '1rem 0 0.5rem 0', fontFamily: 'Cinzel, serif', color: '#FFF' }}>{flower.name}</h3>
                  <p style={{ color: '#A19BAA', fontSize: '0.9rem', flex: 1 }}>{flower.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div className="flower-price" style={{ color: '#FBE29F', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{flower.price}</div>
                    <button onClick={() => addToCart(flower)} style={{ background: '#E60045', border: 'none', color: '#FFF', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', transition: 'all 0.3s' }} onMouseOver={e=>e.target.style.background='#9C1355'} onMouseOut={e=>e.target.style.background='#E60045'}>Add to Cart</button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{textAlign: "center", width: "100%", color: "var(--gold)", padding: '3rem 0'}}>We couldn't find any masterpieces matching your criteria.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
