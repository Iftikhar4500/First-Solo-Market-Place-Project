// src/components/UserRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// This component check is user logged-in yes or no
function UserRoute({ children }) {
    
    // 1. Remove user data from LocalStorage
    const user = localStorage.getItem('user');

    // 2. Check: is this user available (logged-in)?
    if (user) {
        // 3. If Yes,Then print/show page (children) that user want
        return children;
    }
    return <Navigate to="/login" replace />;
}

export default UserRoute;