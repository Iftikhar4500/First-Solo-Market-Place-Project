// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ProfilePage from './pages/ProfilePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

// Context & Components
import { useCart } from './context/CartContext';
import SellerRoute from './components/SellerRoute';
import UserRoute from './components/UserRoute';
import AdminRoute from './components/AdminRoute';


function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false); // State for dropdown
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems } = useCart();
    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) { setCurrentUser(storedUser); }
        else { setCurrentUser(null); }
    }, [location]);
    
    // --- Updated Logout: Closes the menu ---
    const handleLogout = () => {
        setProfileMenuOpen(false); // Close menu
        localStorage.clear();
        setCurrentUser(null);
        navigate('/login');
        window.location.reload();
    };


    // Calculate total items in cart
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div>
            {/* ---  NAVBAR --- */}
            <nav className="navbar">
                
                {/* Left Side: Logo/Home and Role Links */}
                <div className="nav-left">
                    <RouterLink to="/" className="nav-link logo">
                        Marketplace
                    </RouterLink>
                    
                    {/* Admin Link */}
                    {currentUser && currentUser.role === 'admin' && (
                        <RouterLink to="/admin/dashboard" className="nav-link admin">
                            ADMIN PANEL
                        </RouterLink>
                    )}
                    {/* Seller Link */}
                    {currentUser && currentUser.role === 'seller' && (
                        <RouterLink to="/seller/dashboard" className="nav-link seller">
                            Seller Dashboard
                        </RouterLink>
                    )}
                </div>

                {/* Right Side: Cart and Profile/Login */}
                <div className="nav-right">
                    <RouterLink to="/cart" className="cart-link">
                        Cart 
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </RouterLink>

                    {/* Check if user is logged in */}
                    {currentUser ? (
                        // --- Logged-In State: Show "A1" Profile Menu ---
                        <div className="profile-menu">
                            <button 
                                className="profile-button" 
                                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                                // Close dropdown if user clicks outside
                                onBlur={() => setTimeout(() => setProfileMenuOpen(false), 200)} 
                            >
                                <img 
                                    src={`http://localhost:5000${currentUser.avatar}`} 
                                    alt="avatar" 
                                    className="profile-avatar"
                                />
                                {currentUser.username}
                            </button>
                            
                            {/* The Dropdown Menu (Animated) */}
                            {isProfileMenuOpen && (
                                <div className="profile-dropdown">
                                    <RouterLink to="/profile" className="profile-dropdown-link" onClick={() => setProfileMenuOpen(false)}>
                                        Manage Profile
                                    </RouterLink>
                                    <RouterLink to="/my-orders" className="profile-dropdown-link" onClick={() => setProfileMenuOpen(false)}>
                                        My Orders
                                    </RouterLink>
                                    <button onClick={handleLogout} className="logout-button">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // --- Logged-Out State: Show Login/Signup Links ---
                        <>
                            <RouterLink to="/login" className="nav-link">Login</RouterLink>
                            <RouterLink to="/signup" className="nav-link">Signup</RouterLink>
                        </>
                    )}
                </div>
            </nav>
            {/* --- END OF NAVBAR --- */}

            
            {/* --- Routes Section --- */}
            {/* We add a CSS class to give pages breathing room */}
            <main className="main-content">
                <Routes>
                    {/* (All your existing routes are here, no changes) */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/shipping" element={<UserRoute><ShippingPage /></UserRoute>} />
                    <Route path="/payment" element={<UserRoute><PaymentPage /></UserRoute>} />
                    <Route path="/placeorder" element={<UserRoute><PlaceOrderPage /></UserRoute>} />
                    <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
                    <Route path="/order/:id" element={<UserRoute><OrderDetailsPage /></UserRoute>} />
                    <Route path="/my-orders" element={<UserRoute><MyOrdersPage /></UserRoute>} />
                    <Route path="/add-product" element={<SellerRoute><AddProductPage /></SellerRoute>} />
                    <Route path="/product/edit/:id" element={<SellerRoute><EditProductPage /></SellerRoute>} />
                    <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboardPage /></SellerRoute>} />
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;