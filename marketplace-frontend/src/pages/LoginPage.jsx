// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Import Link

function LoginPage() {
    // --- All your existing logic remains exactly the same ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user)); 

            // Show success message
            setMessage('Login successful! Redirecting...');
            setLoading(false);
            
            // Redirect after 1 second
            setTimeout(() => {
                navigate('/');
                window.location.reload(); // Force reload to update Navbar
            }, 1000);

        } catch (error) {
            console.error('Login Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Login failed. Please check connection or credentials.');
            }
            setLoading(false); // Stop loading
        }
    };
    // --- End of existing logic ---


    // --- This is the new "A1" JSX ---
    return (
        <div className="form-container">
            <h2 className="form-title">Welcome Back!</h2>
            
            <form onSubmit={handleLogin}>
                
                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input 
                        type="email" 
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        placeholder="e.g., you@example.com"
                    />
                </div>
                
                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password"
                        id="password"
                        className="form-input" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        placeholder="Enter your password"
                    />
                </div>
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{ width: '100%', fontSize: '1.1rem' }} // Make button full width
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Error or Success Message */}
            {message && (
                <div 
                    className={`form-message ${message.includes('successful') ? 'success' : 'error'}`}
                >
                    {message}
                </div>
            )}

            {/* Link to Signup */}
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Don't have an account? 
                <RouterLink to="/signup" style={{ color: 'var(--primary-blue)', fontWeight: '600', marginLeft: '5px' }}>
                    Sign Up
                </RouterLink>
            </p>
        </div>
    );
}

export default LoginPage;