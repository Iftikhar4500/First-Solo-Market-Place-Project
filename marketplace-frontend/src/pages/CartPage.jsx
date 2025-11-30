// src/pages/CartPage.jsx

import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    const checkoutHandler = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        } else {
            navigate('/shipping');
        }
    };

    // --- Quantity Functions ---
    const increaseQty = (item) => {
        const productObject = {
            _id: item.product,
            name: item.name,
            imageUrl: item.image, 
            price: item.price,
            stock: item.stock
        };
        addToCart(productObject, 1);
    };

    const decreaseQty = (item) => {
        const productObject = {
            _id: item.product,
            name: item.name,
            imageUrl: item.image,
            price: item.price,
            stock: item.stock
        };
        addToCart(productObject, -1);
    };
    
    // Hum ne saare styles ko ek object mein jama kar liya hai
    const styles = {
        // Poore page ka container
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            padding: '2rem',
            maxWidth: '1300px',
            margin: '0 auto',
            backgroundColor: '#f8f9fa' // Light grey background
        },
        heading: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e9ecef'
        },
        // Main layout (Items left, Summary right)
        cartLayout: {
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
            // Responsive design ke liye
            '@media (maxWidth: 900px)': {
                 flexDirection: 'column',
            }
        },
        // Items ki list ka container
        itemsListContainer: {
            flex: '3',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        // Har item ka card
        itemCard: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
            gap: '1.5rem',
        },
        itemImage: {
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        },
        // Item ka naam, price, etc.
        itemDetails: {
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
        },
        itemName: {
            textDecoration: 'none',
            color: '#212529',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '0.25rem'
        },
        itemPrice: {
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#007bff', // Primary color
            marginBottom: '0.5rem'
        },
        // Quantity +/- buttons ka group
        quantityControl: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f3f5',
            borderRadius: '6px',
            width: 'fit-content'
        },
        quantityButton: {
            background: 'transparent',
            border: 'none',
            padding: '0.6rem 0.9rem',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#495057'
        },
        quantityButtonDisabled: {
             background: 'transparent',
            border: 'none',
            padding: '0.6rem 0.9rem',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#adb5bd', // Disabled color
            cursor: 'not-allowed'
        },
        quantityText: {
            padding: '0 0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#343a40',
            minWidth: '30px',
            textAlign: 'center'
        },
        // Remove button (Trash Icon jaisa look)
        removeButton: {
            background: 'transparent',
            border: 'none',
            color: '#e63946', // Red color
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '0.5rem',
            marginLeft: 'auto', // Button ko right par push karega
            alignSelf: 'center'
        },

        // --- Summary Card (Right side) ---
        summaryCard: {
            flex: '1',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
            height: 'fit-content' // Yeh card ko apni height tak rakhega
        },
        summaryTitle: {
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e9ecef',
            paddingBottom: '1rem'
        },
        summaryLine: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.1rem',
            color: '#495057',
            marginBottom: '1rem'
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#212529',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #e9ecef'
        },
        checkoutButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#28a745', // Green color
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginTop: '1.5rem',
            transition: 'background-color 0.2s' // Hover effect
        },
        checkoutButtonDisabled: {
             width: '100%',
            padding: '1rem',
            backgroundColor: '#ced4da', // Greyed out
            color: '#6c757d',
            border: 'none',
            borderRadius: '8px',
            cursor: 'not-allowed',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginTop: '1.5rem',
        },

        // --- Empty Cart Message ---
        emptyCartContainer: {
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
        },
        emptyCartText: {
            fontSize: '1.5rem',
            color: '#6c757d',
            marginBottom: '2rem'
        },
        goHomeLink: {
            display: 'inline-block',
            padding: '0.8rem 2rem',
            backgroundColor: '#007bff', // Primary color
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'background-color 0.2s'
        }
    };
    // --- STYLES YAHAN KHATAM HAIN ---


    return (
        // Hum ne yahan 'styles' object se styles apply kiye hain
        <div style={styles.pageContainer}>
            <h1 style={styles.heading}>Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                // --- Khali Cart ka Design ---
                <div style={styles.emptyCartContainer}>
                    <div style={styles.emptyCartText}>
                        Cart is Empty.
                    </div>
                    <Link to="/" style={styles.goHomeLink}>
                        Return Home Page
                    </Link>
                </div>
            ) : (
                // --- Bhari hui Cart ka Design ---
                <div style={styles.cartLayout}>
                    
                    {/* 1. Items ki List (Left Side) */}
                    <div style={styles.itemsListContainer}>
                        {cartItems.map((item) => (
                            <div key={item.product} style={styles.itemCard}>
                                
                                <img 
                                    src={`http://localhost:5000${item.image}`} 
                                    alt={item.name} 
                                    style={styles.itemImage} 
                                />
                                
                                <div style={styles.itemDetails}>
                                    <Link to={`/product/${item.product}`} style={styles.itemName}>
                                        {item.name}
                                    </Link>
                                    <div style={styles.itemPrice}>${item.price}</div>
                                    
                                    {/* Quantity Controls */}
                                    <div style={styles.quantityControl}>
                                        <button 
                                            style={item.qty === 1 ? styles.quantityButtonDisabled : styles.quantityButton} 
                                            onClick={() => decreaseQty(item)} 
                                            disabled={item.qty === 1}
                                        >
                                            -
                                        </button>
                                        <span style={styles.quantityText}>{item.qty}</span>
                                        <button 
                                            style={item.qty >= item.stock ? styles.quantityButtonDisabled : styles.quantityButton} 
                                            onClick={() => increaseQty(item)} 
                                            disabled={item.qty >= item.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Remove Button */}
                                <button 
                                    style={styles.removeButton} 
                                    onClick={() => removeFromCart(item.product)}
                                >
                                    Remove
                                </button>

                            </div>
                        ))}
                    </div>

                    {/* 2. Summary Card (Right Side) */}
                    <div style={styles.summaryCard}>
                        <h2 style={styles.summaryTitle}>
                            Order Summary
                        </h2>
                        
                        <div style={styles.summaryLine}>
                            <span>Kul Items:</span>
                            <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                        </div>
                        
                        <div style={styles.summaryTotal}>
                            <span>Total Price:</span>
                            <span>${total}</span>
                        </div>
                        
                        <button 
                            onClick={checkoutHandler} 
                            disabled={cartItems.length === 0}
                            style={cartItems.length === 0 ? styles.checkoutButtonDisabled : styles.checkoutButton}
                        >
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default CartPage;