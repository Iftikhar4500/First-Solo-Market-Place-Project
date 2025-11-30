// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A protected route component that only allows access
 * if the user is logged in AND has an 'admin' role.
 * Otherwise, it redirects them to the homepage.
 */
function AdminRoute({ children }) {
    
    // 1. Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Check if user exists AND is an admin
    if (user && user.role === 'admin') {
        // 3. If true, render the child component (the page)
        return children;
    }

    // 4. If not an admin, redirect to the homepage
    return <Navigate to="/" replace />;
}

export default AdminRoute;