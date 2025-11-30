// src/components/SellerRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// This component check. is this user 'seller' Yes or No
function SellerRoute({ children }) {
    
    // 1. Remove user data from LocalStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Do Check : is this user available? and his/her role as a 'seller' or 'admin'?
    if (user && (user.role === 'seller' || user.role === 'admin')) {
        // 3. If Yes, Then show the page (children)
        return children;
    }

    // 4. If Not, Return Back to the Home Page
    return <Navigate to="/" />;
}

export default SellerRoute;