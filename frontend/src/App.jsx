import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomRequest from './pages/CustomRequest';
import AdminDashboard from './pages/AdminDashboard';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';
import Footer from './components/Footer';
import PetalBackground from './components/PetalBackground';
import ProtectedRoute from './components/ProtectedRoute';
import { FaShoppingBag, FaUser, FaSeedling, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = React.useContext(AuthContext);
  const { cartItems } = React.useContext(CartContext);
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          Fleurs de Kataria
        </Link>
        <ul className="nav-links">
          <li><Link to="/collection" className="nav-link"><FaSeedling /> Collection</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/custom-request" className="nav-link">Bespoke</Link></li>
          {user && (
            <li><Link to="/orders" className="nav-link"><FaHistory /> Orders</Link></li>
          )}
          {user && user.role === 'ADMIN' && (
            <li><Link to="/admin" className="nav-link" style={{ color: 'var(--accent)' }}>Dashboard</Link></li>
          )}
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <Link to="/cart" className="nav-link" style={{ position: 'relative', fontSize: '1.2rem' }}>
             <FaShoppingBag />
             {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>
          {user ? (
            <div className="user-menu-container">
               <div className="nav-link user-trigger">
                 <FaUser /> {user.name.split(' ')[0]}
               </div>
               <div className="user-dropdown">
                 <Link to="/profile" className="dropdown-item">Profile</Link>
                 <button onClick={() => { logout(); navigate('/'); }} className="dropdown-item logout-btn">Logout</button>
               </div>
            </div>
          ) : (
            <Link to="/login" className="login-pill">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <PetalBackground />
          <Router>
            <Toaster position="top-center" />
            <div className="app-wrapper">
              <Navbar />
              <main className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/custom-request" element={<CustomRequest />} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/orders/:id" element={<ProtectedRoute adminOnly={true}><OrderDetail /></ProtectedRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
