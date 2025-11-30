// src/pages/EditProductPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditProductPage() {
    const { id: productId } = useParams();

    // Form data states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(1);
    const [message, setMessage] = useState('Loading product details...');
    
    // Image states
    const [oldImageUrl, setOldImageUrl] = useState(''); // Old image URL
    const [image, setImage] = useState(null); // New file object
    const [imagePreview, setImagePreview] = useState(null); // For local preview of new image

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
             width: '100%',
             padding: '0.7rem 0', 
             border: 'none', 
             borderRadius: '8px',
             boxSizing: 'border-box',
        },
        imagePreviewContainer: {
            marginBottom: '1.5rem',
            padding: '1rem',
            border: '1px dashed #ced4da',
            borderRadius: '8px',
            textAlign: 'center',
        },
        imagePreview: {
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            marginTop: '0.5rem',
        },
        imagePlaceholderText: {
            margin: '0',
            color: '#6c757d',
            fontSize: '0.9rem',
        },
        submitButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#007bff', // Primary blue color for Update
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginTop: '1.5rem',
        },
        message: {
            textAlign: 'center',
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#d4edda', 
            color: '#155724', 
        },
        error: {
            textAlign: 'center',
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
        }
    };
    // --- CUSTOM STYLES END ---

    // 1. useEffect (Page load)
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
                const product = response.data;
                
                // Set old data
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setStock(product.stock);
                setOldImageUrl(product.imageUrl || '');
                setMessage('');

            } catch (error) {
                console.error('Error fetching product details:', error);
                setMessage('Could not load product details.');
            }
        };
        fetchProductDetails();
    }, [productId]);

    // New file select handler
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        
        // Local preview setup
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    // 2. Form Submit Function (Update)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('Updating product...');

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You are not logged in.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        
        // Append new image only if selected
        if (image) {
            formData.append('image', image);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            await axios.put(`http://localhost:5000/api/products/${productId}`, formData, config);

            setMessage('Product successfully updated!');
            // Redirect to dashboard (assuming seller dashboard is '/seller/dashboard')
            setTimeout(() => navigate('/seller/dashboard'), 1500); 

        } catch (error) {
            console.error('Product update failed:', error);
            setMessage(error.response?.data?.message || 'Update failed.');
        }
    };

    // 3. Form ka JSX (Updated with styles)
    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Edit Product</h2>
                
                {message.includes('Loading') ? (
                    <p style={styles.error}>{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        
                        {/* --- Image Preview Section --- */}
                        <div style={styles.imagePreviewContainer}>
                            <p style={styles.imagePlaceholderText}>
                                {imagePreview ? "New Image Preview:" : "Current Image:"}
                            </p>
                            <img 
                                src={imagePreview || (oldImageUrl ? `http://localhost:5000${oldImageUrl}` : 'placeholder.jpg')} 
                                alt="Product" 
                                style={styles.imagePreview} 
                            />
                        </div>
                        
                        {/* --- Product Name --- */}
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
                        
                        {/* --- Description --- */}
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
                        
                        {/* --- Price --- */}
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
                        
                        {/* --- Stock --- */}
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="stock">Stock:</label>
                            <input 
                                style={styles.input}
                                id="stock"
                                type="number" 
                                value={stock} 
                                onChange={(e) => setStock(e.target.value)} 
                                required 
                                min="0" 
                                placeholder="Minimum 0"
                            />
                        </div>
                        
                        {/* --- New Image Upload Option --- */}
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="imageUpload">Upload New Image (Optional):</label>
                            <input 
                                style={styles.fileInput}
                                id="imageUpload"
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange} 
                            />
                            <p style={styles.imagePlaceholderText}>
                                If you don't upload a new image, the existing one will be kept.
                            </p>
                        </div>
                        
                        <button type="submit" style={styles.submitButton}>
                            Update Product
                        </button>
                    </form>
                )}

                {/* --- Message Display --- */}
                {message && !message.includes('Loading') && (
                    <p style={message.includes('success') ? styles.message : styles.error}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default EditProductPage;