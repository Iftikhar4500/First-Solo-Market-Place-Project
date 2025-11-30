// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating'; // Import Rating component
import { useCart } from '../context/CartContext'; // Import Cart

function ProductDetailsPage() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [currentUser, setCurrentUser] = useState(null);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
        
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load product.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, reviewSuccess]); // Reload product when review is successful

    const handleAddToCart = () => {
        addToCart(product, 1);
        alert('Product added to cart!');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        setReviewSuccess('');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            await axios.post(`http://localhost:5000/api/products/${productId}/reviews`, { rating, comment }, config);
            
            setReviewLoading(false);
            setReviewSuccess('Review submitted successfully! Thank you.');
            setRating(0);
            setComment('');
            
        } catch (err) {
            setReviewLoading(false);
            setReviewError(err.response?.data?.message || 'Failed to submit review.');
        }
    };

    const styles = {
        detailsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', // Responsive grid
            gap: '2rem',
            marginTop: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--grey-border)',
        },
        imageWrapper: {
            width: '100%',
            height: 'auto',
            maxHeight: '550px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--grey-border)',
            borderRadius: '10px',
            overflow: 'hidden',
        },
        productImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        infoWrapper: {
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '700',
            marginTop: 0,
            marginBottom: '0.5rem',
        },
        description: {
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: 'var(--text-light)',
            margin: '1rem 0',
        },
        cartBox: {
            border: '1px solid var(--grey-border)',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: 'var(--white)',
            boxShadow: 'var(--shadow-sm)',
            marginTop: '1rem'
        },
        price: {
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-dark)',
            marginBottom: '1rem',
        },
        status: {
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
        },
        reviewsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginTop: '2rem',
        },
        reviewBox: {
            borderBottom: '1px solid var(--grey-border)',
            padding: '1rem 0',
        },
        reviewDate: {
            fontSize: '0.85em',
            color: 'var(--text-light)',
            marginTop: '0.5rem',
        }
    };

    if (loading) return <p className="form-message">Loading product...</p>;
    if (error) return <p className="form-message error">Error: {error}</p>;
    if (!product) return <p className="form-message">Product not found.</p>;

    return (
        <div> {/* No padding here, we use .main-content's padding */}
            <RouterLink to="/" className="nav-link" style={{ fontSize: '0.9rem' }}>
                &larr; Back to Home
            </RouterLink>
            
            {/* --- Section 1: Product Details --- */}
            <div style={styles.detailsContainer}>
                
                {/* Left: Image */}
                <div style={styles.imageWrapper}>
                    <img 
                        src={`http://localhost:5000${product.imageUrl}`} 
                        alt={product.name}
                        style={styles.productImage}
                    />
                </div>

                {/* Right: Info & Add to Cart */}
                <div style={styles.infoWrapper}>
                    <h1 style={styles.title}>{product.name}</h1>
                    <Rating value={product.rating} text={`(${product.numReviews} reviews)`} />
                    
                    <p style={styles.description}>{product.description}</p>
                    
                    {/* Cart Box */}
                    <div style={styles.cartBox}>
                        <div style={styles.price}>${product.price}</div>
                        <div style={styles.status}>
                            Status: {product.stock > 0 ? 
                                <span style={{ color: 'var(--success-green)' }}>In Stock</span> : 
                                <span style={{ color: 'var(--danger-red)' }}>Out of Stock</span>
                            }
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || (currentUser && currentUser.role !== 'buyer')}
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem', background: 'orange', color: 'black' }} // Specific style for cart
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Section 2: Reviews --- */}
            <div style={styles.reviewsContainer}>
                
                {/* Left: Existing Reviews */}
                <div>
                    <h2>Reviews ({product.numReviews})</h2>
                    {product.reviews.length === 0 && <p>No reviews yet.</p>}
                    
                    {/* List of reviews */}
                    {product.reviews.map(review => (
                        <div key={review._id} style={styles.reviewBox}>
                            <strong style={{ fontSize: '1.1rem' }}>{review.name}</strong>
                            <Rating value={review.rating} />
                            <p>{review.comment}</p>
                            <span style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>

                {/* Right: Write a Review Form */}
                <div className="form-container" style={{ margin: 0, maxWidth: '100%', boxShadow: 'var(--shadow-sm)' }}> {/* Reuse form style */}
                    <h2 className="form-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Write a Customer Review</h2>
                    
                    {/* Messages */}
                    {reviewSuccess && <div className="form-message success">{reviewSuccess}</div>}
                    {reviewError && <div className="form-message error">{reviewError}</div>}
                    
                    {currentUser ? (
                        <form onSubmit={handleReviewSubmit} style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Rating:</label>
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)} 
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Comment:</label>
                                <textarea 
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    className="form-input"
                                    placeholder="Tell us what you thought..."
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={reviewLoading}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    ) : (
                        <p style={{ marginTop: '1rem' }}>
                            Please <RouterLink to="/login" style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>log in</RouterLink> to write a review.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default ProductDetailsPage;