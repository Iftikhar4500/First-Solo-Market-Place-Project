// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
import axios from 'axios';

function ProfilePage() {
    // --- User's current data from localStorage ---
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // --- State for Form 1 (Avatar) ---
    const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar ? `http://localhost:5000${currentUser.avatar}` : '');
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarMessage, setAvatarMessage] = useState('');

    // --- State for Form 2 (Profile Details) ---
    const [profileData, setProfileData] = useState({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        currentPassword: '' // Required for verification
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');

    // --- State for Form 3 (Password Change) ---
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');

    // --- Handlers (Each form is separate) ---

    // 1. Avatar Handler (Auto-uploads on file change)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarPreview(URL.createObjectURL(file)); // Show preview instantly
        setAvatarLoading(true);
        setAvatarMessage('Uploading...');

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            // Call the specific 'avatar' route
            const response = await axios.put('http://localhost:5000/api/users/profile/avatar', formData, config);

            // Update localStorage with the new user data
            localStorage.setItem('user', JSON.stringify(response.data)); 
            setAvatarLoading(false);
            setAvatarMessage('Picture updated successfully!');
            
            // Reload the page to update the Navbar avatar
            setTimeout(() => window.location.reload(), 1500); 

        } catch (error) {
            setAvatarLoading(false);
            setAvatarMessage(error.response?.data?.message || 'Upload failed. Please try again.');
        }
    };

    // 2. Profile Details Handler (Name/Email)
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage('');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            // Call the specific 'details' route
            const response = await axios.put('http://localhost:5000/api/users/profile/details', profileData, config);

            localStorage.setItem('user', JSON.stringify(response.data));
            setProfileLoading(false);
            setProfileMessage('Details updated successfully!');
            setProfileData({ ...profileData, currentPassword: '' }); // Clear password field
            
            // Reload to update Navbar username
            setTimeout(() => window.location.reload(), 1500);

        } catch (error) {
            setProfileLoading(false);
            setProfileMessage(error.response?.data?.message || 'Update failed. Please try again.');
        }
    };
    
    // 3. Password Change Handler
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage('New passwords do not match!');
            return;
        }

        setPasswordLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            // Call the specific 'password' route
            await axios.put('http://localhost:5000/api/users/profile/password', passwordData, config);

            setPasswordLoading(false);
            setPasswordMessage('Password updated successfully!');
            // Clear all password fields
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 

        } catch (error) {
            setPasswordLoading(false);
            setPasswordMessage(error.response?.data?.message || 'Password update failed.');
        }
    };

    // --- Input Change Handlers ---
    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    return (
        <div className="form-container" style={{ maxWidth: '700px' }}> {/* Wider container */}
            <h1 className="form-title" style={{ fontSize: '2.5rem' }}>Manage Profile</h1>
            
            {/* --- SECTION 1: Avatar Update --- */}
            <div style={{ 
                border: '1px solid var(--grey-border)', 
                borderRadius: '8px', 
                padding: '25px', 
                marginBottom: '30px', 
                boxShadow: 'var(--shadow-sm)' 
            }}>
                <h2 style={{ textAlign: 'center', marginTop: 0 }}>Profile Picture</h2>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {avatarPreview && (
                        <img 
                            src={avatarPreview} 
                            alt="Profile Avatar" 
                            style={{ 
                                width: '150px', height: '150px', borderRadius: '50%', 
                                objectFit: 'cover', border: '4px solid var(--grey-border)' 
                            }} 
                        />
                    )}
                    <div>
                        <label 
                            htmlFor="avatar-upload" 
                            style={{ 
                                cursor: 'pointer', color: 'var(--primary-blue)', 
                                textDecoration: 'underline', fontSize: '0.9em', fontWeight: '600'
                            }}
                        >
                            {avatarLoading ? 'Uploading...' : 'Change Picture'}
                        </label>
                        <input 
                            id="avatar-upload"
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            disabled={avatarLoading}
                        />
                    </div>
                    {avatarMessage && (
                        <p style={{ 
                            marginTop: '10px', fontWeight: 'bold',
                            color: avatarMessage.includes('fail') ? 'var(--danger-red)' : 'var(--success-green)'
                        }}>
                            {avatarMessage}
                        </p>
                    )}
                </div>
            </div>

            {/* --- SECTION 2: Profile Details (Name/Email) --- */}
            <div style={{ 
                border: '1px solid var(--grey-border)', 
                borderRadius: '8px', 
                padding: '25px', 
                marginBottom: '30px', 
                boxShadow: 'var(--shadow-sm)' 
            }}>
                <h2>Profile Details</h2>
                <form onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            id="username"
                            name="username" 
                            value={profileData.username} 
                            onChange={handleProfileChange} 
                            className="form-input" 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            value={profileData.email} 
                            onChange={handleProfileChange} 
                            className="form-input" 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="currentPasswordDetails" style={{ color: 'var(--danger-red)', fontWeight: 'bold' }}>
                            Current Password (Required for verification)
                        </label>
                        <input 
                            type="password" 
                            id="currentPasswordDetails"
                            name="currentPassword" 
                            value={profileData.currentPassword} 
                            onChange={handleProfileChange} 
                            className="form-input" 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={profileLoading} 
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '1rem' }}
                    >
                        {profileLoading ? 'Saving...' : 'Save Details'}
                    </button>
                    {profileMessage && (
                        <p style={{ 
                            marginTop: '10px', fontWeight: 'bold',
                            color: profileMessage.includes('fail') ? 'var(--danger-red)' : 'var(--success-green)'
                        }}>
                            {profileMessage}
                        </p>
                    )}
                </form>
            </div>

            {/* --- SECTION 3: Change Password --- */}
            <div style={{ 
                border: '1px solid var(--grey-border)', 
                borderRadius: '8px', 
                padding: '25px', 
                marginBottom: '30px', 
                boxShadow: 'var(--shadow-sm)' 
            }}>
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="currentPasswordPass">Current Password:</label>
                        <input 
                            type="password" 
                            id="currentPasswordPass"
                            name="currentPassword" 
                            value={passwordData.currentPassword} 
                            onChange={handlePasswordChange} 
                            className="form-input" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="newPassword">New Password:</label>
                        <input 
                            type="password" 
                            id="newPassword"
                            name="newPassword" 
                            value={passwordData.newPassword} 
                            onChange={handlePasswordChange} 
                            className="form-input" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm New Password:</label>
                        <input 
                            type="password" 
                            id="confirmPassword"
                            name="confirmPassword" 
                            value={passwordData.confirmPassword} 
                            onChange={handlePasswordChange} 
                            className="form-input" 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={passwordLoading} 
                        className="btn btn-danger" // Use danger color for password
                        style={{ width: '100%', fontSize: '1rem' }}
                    >
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                    {passwordMessage && (
                        <p style={{ 
                            marginTop: '10px', fontWeight: 'bold',
                            color: passwordMessage.includes('fail') ? 'var(--danger-red)' : 'var(--success-green)'
                        }}>
                            {passwordMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;