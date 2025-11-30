// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// We must alias 'Link' from react-router-dom
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import Rating from '../components/Rating'; // Import the Rating component

function HomePage() {
    // --- All your existing logic remains exactly the same ---
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('Loading products...');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                if (response.data && response.data.length > 0) {
                    setProducts(response.data);
                    setMessage('');
                } else {
                    setMessage('No products found in the marketplace.');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setMessage('Failed to load products. Check server.');
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
            setProducts(products.filter(p => p._id !== productId));
            alert('Product deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(error.response?.data?.message || 'Failed to delete product.');
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        alert(`${product.name} added to cart.`);
    };
    // --- End of existing logic ---


    return (
        <div>
            <h1>Welcome to the Marketplace!</h1>
            {message && <p>{message}</p>}
            
            {/* --- NEW "A1" PRODUCT GRID (Using CSS classes) --- */}
            <div className="product-grid">
                {products.map((product) => (
                    // Card
                    <div key={product._id} className="product-card">
                        
                        {/* Image */}
                        <RouterLink to={`/product/${product._id}`} className="product-image-link">
                            {product.imageUrl && (
                                <img 
                                    src={`http://localhost:5000${product.imageUrl}`} 
                                    alt={product.name} 
                                    className="product-image"
                                />
                            )}
                        </RouterLink>
                        
                        {/* Info */}
                        <div className="product-info">
                            <RouterLink to={`/product/${product._id}`} className="product-name">
                                {product.name}
                            </RouterLink>

                            <div className="product-rating">
                                <Rating 
                                    value={product.rating} 
                                    text={`(${product.numReviews} reviews)`}
                                />
                            </div>
                            
                            <h4 className="product-price">${product.price}</h4>
                            <p className="product-seller">Seller: {product.seller ? product.seller.username : 'Unknown'}</p>

                            {/* Action Buttons */}
                            <div className="product-actions">
                                {currentUser && product.seller && currentUser.id === product.seller._id ? (
                                    // Seller's own buttons
                                    <>
                                        <RouterLink to={`/product/edit/${product._id}`} className="btn btn-light" style={{ width: '50%' }}>
                                            Edit
                                        </RouterLink>
                                        <button onClick={() => handleDelete(product._id)} className="btn btn-danger" style={{ width: '50%' }}>
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    // Buyer's button
                                    <button 
                                        onClick={() => handleAddToCart(product)} 
                                        disabled={product.stock === 0 || (currentUser && currentUser.role === 'seller')}
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* --- END OF GRID --- */}
        </div>
    );
}

export default HomePage;