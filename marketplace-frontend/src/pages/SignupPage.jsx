// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // <-- NEW state for loading
    
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault(); 
        setMessage('');
        setLoading(true); // <-- NEW: Start loading

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                username: username,
                email: email,
                password: password,
                role: role
            });

            
            setMessage('Signup successful! Redirecting to login...');
            setLoading(false); // <-- NEW: Stop loading
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Signup Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                
                setMessage(error.response.data.message);
            } else {
                setMessage('Signup failed. Please try again.');
            }
            setLoading(false); 
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Create Your Account</h2>
            
            <form onSubmit={handleSignup}>
                {/* Username Field */}
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                        placeholder="e.g., JohnDoe"
                    />
                </div>

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
                        placeholder="Enter a secure password"
                    />
                </div>

                {/* Account Type Field */}
                <div className="form-group">
                    <label htmlFor="role" className="form-label">Account Type</label>
                    {/* We use .form-select class for the <select> element */}
                    <select 
                        id="role" 
                        className="form-select" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{ width: '100%', fontSize: '1.1rem' }}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
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

            {/* Link to Login */}
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Already have an account? 
                <RouterLink to="/login" style={{ color: 'var(--primary-blue)', fontWeight: '600', marginLeft: '5px' }}>
                    Log In
                </RouterLink>
            </p>
        </div>
    );
}

export default SignupPage;