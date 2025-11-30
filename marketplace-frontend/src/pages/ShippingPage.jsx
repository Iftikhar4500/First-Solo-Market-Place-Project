// src/pages/ShippingPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ShippingPage() {
    const { shippingAddress, saveShippingAddress } = useCart();
    
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const addressData = {
            address,
            city,
            postalCode,
            country
        };
        
        saveShippingAddress(addressData);
        navigate('/payment');
    };

    // --- STYLES ---
    const styles = {
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', 
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        },
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
        formGroup: {
            marginBottom: '1.5rem',
        },
        label: {
            display: 'block',
            marginBottom: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#495057',
        },
        input: {
            width: '100%',
            padding: '0.9rem 1rem',
            fontSize: '1rem',
            color: '#495057',
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            boxSizing: 'border-box', 
            transition: 'border-color 0.2s, box-shadow 0.2s',
        },
        submitButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#007bff', 
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginTop: '1rem',
            transition: 'background-color 0.2s'
        },
        submitButtonHover: {
             backgroundColor: '#0056b3', 
        }
    };
    // --- STYLES END ---

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                {/* --- CHANGED --- */}
                <h1 style={styles.heading}>Shipping Address</h1>
                {/* --- CHANGED --- */}
                <p style={styles.subheading}>Where should we deliver your order?</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Address Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="address">Address:</label>
                        <input 
                            style={styles.input}
                            id="address"
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required 
                            // --- CHANGED ---
                            placeholder="Enter your full address"
                        />
                    </div>
                    
                    {/* City Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="city">City:</label>
                        <input 
                            style={styles.input}
                            id="city"
                            type="text" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required 
                            // --- CHANGED ---
                            placeholder="e.g., Lahore"
                        />
                    </div>
                    
                    {/* Postal Code Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="postalCode">Postal Code:</label>
                        <input 
                            style={styles.input}
                            id="postalCode"
                            type="text" 
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required 
                            // --- CHANGED ---
                            placeholder="e.g., 54000"
                        />
                    </div>
                    
                    {/* Country Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="country">Country:</label>
                        <input 
                            style={styles.input}
                            id="country"
                            type="text" 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required 
                            // --- CHANGED ---
                            placeholder="e.g., Pakistan"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.submitButton}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor}
                    >
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ShippingPage;