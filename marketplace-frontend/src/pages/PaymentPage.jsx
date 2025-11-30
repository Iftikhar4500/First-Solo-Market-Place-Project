// src/pages/PaymentPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function PaymentPage() {
    
    const { paymentMethod: savedPaymentMethod, savePaymentMethod } = useCart();
    
    const [paymentMethod, setPaymentMethod] = useState(savedPaymentMethod || 'Cash on Delivery');
    
    const navigate = useNavigate();

    // --- CUSTOM STYLES ---
    const styles = {
        // Page container
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', 
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        },
        // Form card container (White box)
        formContainer: {
            backgroundColor: '#ffffff',
            padding: '2.5rem 3rem',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            width: '100%',
        },
        heading: {
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#343a40',
            textAlign: 'center',
            marginBottom: '0.5rem',
        },
        subheading: {
            fontSize: '1rem',
            color: '#6c757d',
            textAlign: 'center',
            marginBottom: '2.5rem',
        },
        // Individual radio option
        formGroup: {
            marginBottom: '1.5rem',
            padding: '1rem',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
        },
        radioInput: {
            // Browser default styles par zyada control nahi hota, lekin size set kar sakte hain
            width: '20px',
            height: '20px',
            marginRight: '15px',
            cursor: 'pointer',
        },
        radioLabel: {
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#343a40',
            cursor: 'pointer',
            flex: 1, // Label ko poori jagah lene dein
        },
        submitButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#007bff', // Primary blue color
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginTop: '1rem',
        },
        submitButtonHover: {
             backgroundColor: '#0056b3', 
        },
        // Helper to combine styles
        combine: (style1, style2) => ({ ...style1, ...style2 }),
    };
    // --- CUSTOM STYLES END ---

    // 3. Form Submit Function (Logic Unchanged)
    const handleSubmit = (event) => {
        event.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h1 style={styles.heading}>Payment Method</h1>
                <p style={styles.subheading}>How would you like to pay for your order?</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Cash on Delivery Option */}
                    <div 
                        style={styles.combine(
                            styles.formGroup, 
                            paymentMethod === 'Cash on Delivery' && { border: '2px solid #007bff', backgroundColor: '#e9f2ff' } // Selected state
                        )}
                    >
                        <input 
                            style={styles.radioInput}
                            type="radio" 
                            id="cod" 
                            name="paymentMethod" 
                            value="Cash on Delivery"
                            checked={paymentMethod === 'Cash on Delivery'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="cod" style={styles.radioLabel}>
                            Cash on Delivery (COD)
                        </label>
                    </div>

                    {/* Future Payment Option (Disabled/Placeholder) */}
                    <div style={styles.combine(styles.formGroup, { opacity: 0.6, cursor: 'not-allowed' })}>
                         <input 
                            style={styles.radioInput}
                            type="radio" 
                            id="stripe" 
                            name="paymentMethod" 
                            value="Stripe"
                            disabled
                        />
                        <label htmlFor="stripe" style={styles.radioLabel}>
                            Stripe (Coming Soon)
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.submitButton}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor}
                    >
                        Continue to Place Order
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PaymentPage;