// src/pages/PlaceOrderPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function PlaceOrderPage() {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Price Calculations ---
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50; 
    const totalPrice = (itemsPrice + shippingPrice).toFixed(2);
    // --- Calculations End ---

    // --- CUSTOM STYLES ---
    const styles = {
        // Page container
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', 
            padding: '2rem',
            minHeight: '85vh',
        },
        mainContent: {
            maxWidth: '1400px',
            margin: '0 auto',
        },
        mainHeading: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e9ecef',
        },
        // Two-column layout
        detailsLayout: {
            display: 'flex',
            gap: '2.5rem',
        },
        // Left side (Details and Items)
        detailsColumn: {
            flex: '3',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
        },
        // Right side (Summary Card)
        summaryCard: {
            flex: '1',
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
            height: 'fit-content',
        },
        // Individual Detail Box (Shipping, Payment, Items)
        detailBox: {
            backgroundColor: '#ffffff',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        },
        sectionTitle: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#343a40',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #e9ecef',
        },
        detailText: {
            margin: '0.5rem 0',
            fontSize: '1rem',
            color: '#495057',
        },
        // Order Item Styling
        itemCard: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee',
        },
        itemImage: {
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginRight: '1rem',
        },
        itemLink: {
            flex: 1, 
            color: '#007bff', 
            textDecoration: 'none', 
            fontWeight: '500',
            fontSize: '1rem',
        },
        itemTotal: {
            marginLeft: 'auto',
            fontSize: '0.95rem',
            color: '#343a40',
        },
        // Summary Styles
        summaryTitle: {
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#343a40',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e9ecef',
            paddingBottom: '0.75rem',
            margin: 0,
        },
        summaryLine: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '1rem',
            color: '#495057',
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '1.4em',
            paddingTop: '1rem',
            borderTop: '2px solid #e9ecef',
            marginTop: '1rem',
        },
        placeOrderButton: {
            width: '100%', 
            padding: '1rem', 
            backgroundColor: '#28a745', // Green for final action
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            marginTop: '1.5rem',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '1.1rem',
        },
        placeOrderButtonDisabled: {
            backgroundColor: '#adb5bd', 
            cursor: 'not-allowed',
        },
        message: {
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
        },
        successMessage: {
            backgroundColor: '#d4edda', 
            color: '#155724',
        },
        errorMessage: {
            backgroundColor: '#f8d7da', 
            color: '#721c24',
        },
        combine: (style1, style2) => ({ ...style1, ...style2 }),
    };
    // --- CUSTOM STYLES END ---

    // --- Order Place karne ka Main Function ---
    const handlePlaceOrder = async () => {
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod,
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                totalPrice: totalPrice
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderData, config);

            setLoading(false);
            setMessage('Order successfully placed!');
            
            clearCart();
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');

            // We will redirect to the specific order page once it's built
            alert(`Order successful! Redirecting you to Order ID: ${response.data._id}`);
            setTimeout(() => {
                navigate(`/order/${response.data._id}`); // Redirect to new order details page
            }, 1500);

        } catch (error) {
            setLoading(false);
            console.error('Error placing order:', error);
            setMessage(error.response?.data?.message || 'Order placement failed.');
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainContent}>
                <h1 style={styles.mainHeading}>Order Summary (Review & Place)</h1>
                
                <div style={styles.detailsLayout}>
                    
                    {/* Left Side: Details (Items, Shipping, Payment) */}
                    <div style={styles.detailsColumn}>
                        
                        {/* 1. Shipping */}
                        <div style={styles.detailBox}>
                            <h2 style={styles.sectionTitle}>Shipping</h2>
                            <p style={styles.detailText}>
                                <strong>Address: </strong>
                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            <p style={styles.detailText}>
                                <Link to="/shipping" style={styles.itemLink}>Change Shipping Address</Link>
                            </p>
                        </div>

                        {/* 2. Payment */}
                        <div style={styles.detailBox}>
                            <h2 style={styles.sectionTitle}>Payment Method</h2>
                            <p style={styles.detailText}>
                                <strong>Method: </strong> {paymentMethod}
                            </p>
                            <p style={styles.detailText}>
                                <Link to="/payment" style={styles.itemLink}>Change Payment Method</Link>
                            </p>
                        </div>

                        {/* 3. Items */}
                        <div style={styles.detailBox}>
                            <h2 style={styles.sectionTitle}>Order Items</h2>
                            {cartItems.length === 0 ? <p style={styles.detailText}>Your cart is empty.</p> : (
                                <div>
                                    {cartItems.map((item) => (
                                        <div key={item.product} style={styles.itemCard}>
                                            <img src={`http://localhost:5000${item.image}`} alt={item.name} style={styles.itemImage} />
                                            <Link to={`/product/${item.product}`} style={styles.itemLink}>{item.name}</Link>
                                            <div style={styles.itemTotal}>
                                                {item.qty} x ${item.price} = <strong style={{color: '#343a40'}}>${(item.qty * item.price).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Order Total (Summary Card) */}
                    <div style={styles.summaryCard}>
                        <h2 style={styles.summaryTitle}>Order Total</h2>
                        
                        <div style={styles.summaryLine}>
                            <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                            <span>${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryLine}>
                            <span>Shipping ({itemsPrice > 500 ? 'Free' : 'Standard'}):</span>
                            <span>${shippingPrice.toFixed(2)}</span>
                        </div>
                        
                        <div style={styles.summaryTotal}>
                            <span>Order Total:</span>
                            <span>${totalPrice}</span>
                        </div>
                        
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={cartItems.length === 0 || loading || !paymentMethod || !shippingAddress.address}
                            style={styles.combine(
                                styles.placeOrderButton, 
                                (cartItems.length === 0 || loading || !paymentMethod || !shippingAddress.address) && styles.placeOrderButtonDisabled
                            )}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>

                        {message && (
                            <p style={styles.combine(
                                styles.message, 
                                message.includes('successfully') ? styles.successMessage : styles.errorMessage
                            )}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceOrderPage;