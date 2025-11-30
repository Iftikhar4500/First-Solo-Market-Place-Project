// src/pages/AddProductPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProductPage() {
    // 1. Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(1);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null); 

    const navigate = useNavigate();

    // 2. File select handler
    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    // 3. Form Submit Function
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('Uploading product...');

        // File check
        if (!image) {
            setMessage('Please upload an image.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You are not logged in. Please log in.');
            return;
        }

        // FormData creation
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('image', image); 

        // Axios config
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', 
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            // Backend call
            await axios.post('http://localhost:5000/api/products', formData, config);

            setMessage('Product added successfully!');
            setTimeout(() => {
                navigate('/seller/dashboard'); // Seller Return to dashboard
            }, 1500);

        } catch (error) {
            console.error('Error adding product:', error);
            setMessage(error.response?.data?.message || 'An error occurred.');
        }
    };
    
    // --- CUSTOM STYLES START ---
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
            maxWidth: '700px',
            width: '100%',
        },
        heading: {
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#343a40',
            textAlign: 'center',
            marginBottom: '2rem',
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
            resize: 'none', 
        },
        
        fileInput: {
             // File input ko bhi basic input jaisa banane ki koshish
             width: '100%',
             padding: '0.7rem 0', // Padding kam rakhi kyunki file input alag tarah se render hota hai
             border: 'none', 
             borderRadius: '8px',
             boxSizing: 'border-box',
        },
        // Submit button (Green)
        submitButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#28a745', // Success green color
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginTop: '1.5rem',
            transition: 'background-color 0.2s'
        },
        message: {
            textAlign: 'center',
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#d4edda', // Light green background for success
            color: '#155724', // Dark green text
        },
        error: {
            textAlign: 'center',
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f8d7da', // Light red background for error
            color: '#721c24', // Dark red text
        }
    };
    // --- CUSTOM STYLES END ---

    // 7. Form JSX (Updated with styles)
    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Add a New Product</h2>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Product Name */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="name">Product Name:</label>
                        <input 
                            style={styles.input}
                            id="name"
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="Enter product name"
                        />
                    </div>
                    
                    {/* Description */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="description">Description:</label>
                        <textarea 
                            style={styles.input}
                            id="description"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                            rows="4" 
                            placeholder="Detailed description of the product"
                        />
                    </div>
                    
                    {/* Price */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="price">Price ($):</label>
                        <input 
                            style={styles.input}
                            id="price"
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            required 
                            min="0" 
                            placeholder="0.00"
                        />
                    </div>
                    
                    {/* Stock */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="stock">Stock:</label>
                        <input 
                            style={styles.input}
                            id="stock"
                            type="number" 
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)} 
                            required 
                            min="1" 
                            placeholder="Minimum 1"
                        />
                    </div>
                    
                    {/* Product Image (File Input) */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="image">Product Image:</label>
                        <input 
                            style={styles.fileInput}
                            id="image"
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg" 
                            onChange={handleFileChange} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" style={styles.submitButton}>
                        Add Product
                    </button>
                </form>

                {message && (
                    <p style={message.includes('success') ? styles.message : styles.error}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default AddProductPage;