// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// !!! IMPORTANT !!!
// You must manually enter your Super Admin email here
const SUPER_ADMIN_EMAIL = "admin@example.com"; 
// (Change this to your actual super admin email)


function AdminDashboardPage() {
    // States (Original states)
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [message, setMessage] = useState('');
    const [currentAdminId, setCurrentAdminId] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.id : null;
    });

    // --- CUSTOM STYLES START ---
    const styles = {
        // Page Container
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', // Light grey page background
            padding: '2rem',
            minHeight: '100vh',
        },
        dashboardContainer: {
            maxWidth: '1600px',
            margin: '0 auto',
        },
        mainHeading: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '2rem',
        },
        // White card container for sections
        sectionCard: {
            backgroundColor: '#ffffff',
            padding: '2rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
            marginBottom: '2rem',
        },
        sectionTitle: {
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#343a40',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e9ecef',
        },
        // Modern Table Design
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
        },
        tableHead: {
            backgroundColor: '#f8f9fa', 
        },
        tableHeaderCell: {
            padding: '1rem 1.2rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        tableRow: {
            borderBottom: '1px solid #e9ecef', 
        },
        tableCell: {
            padding: '1rem 1.2rem',
            verticalAlign: 'middle',
            color: '#495057',
            fontSize: '1rem',
        },
        // --- Status Badges (Consistent) ---
        statusBadge: {
            padding: '0.35rem 0.75rem',
            borderRadius: '15px', 
            fontSize: '0.8rem',
            fontWeight: '700',
            textAlign: 'center',
            display: 'inline-block',
            whiteSpace: 'nowrap',
        },
        badgeGreen: { color: '#155724', backgroundColor: '#d4edda' },    // Delivered, Paid/Active, Unbanned
        badgeBlue: { color: '#004085', backgroundColor: '#cce5ff' },     // Shipped, Seller
        badgeOrange: { color: '#856404', backgroundColor: '#fff3cd' },   // Pending
        badgeRed: { color: '#721c24', backgroundColor: '#f8d7da' },      // Banned
        badgeGray: { color: '#383d41', backgroundColor: '#e2e3e5' },     // Cancelled, Buyer
        badgePurple: { color: '#4a007d', backgroundColor: '#e6ccff' },   // Admin/Super Admin
        
        // Action Buttons
        actionButton: {
            border: 'none',
            padding: '0.5rem 0.8rem',
            cursor: 'pointer',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.85rem',
            width: '120px', 
            marginBottom: '5px',
        },
        actionButtonContainer: {
            display: 'flex', 
            flexDirection: 'column', 
            gap: '5px', 
            alignItems: 'center',
        },
        // Specific Action Colors
        deliverButton: { backgroundColor: '#28a745' }, // Green
        payButton: { backgroundColor: '#007bff' },      // Blue
        banButton: { backgroundColor: '#dc3545' },      // Red
        unbanButton: { backgroundColor: '#28a745' },    // Green (for unban)
        makeBuyerButton: { backgroundColor: '#6c757d' }, // Dark Gray
        makeSellerButton: { backgroundColor: '#007bff' }, // Blue
        makeAdminButton: { backgroundColor: '#6f42c1' }, // Purple
        
        combine: (style1, style2) => ({ ...style1, ...style2 }),
    };
    // --- CUSTOM STYLES END ---


    // --- Data Fetching Functions (Original, using new styles for messages/loading) ---
    const fetchAllOrders = async () => {
        setLoadingOrders(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/admin/orders', config);
            setOrders(response.data);
            setLoadingOrders(false);
        } catch (error) {
            console.error('Error fetching all orders:', error);
            setMessage('Failed to load orders.');
            setLoadingOrders(false);
        }
    };
    const fetchAllUsers = async () => {
        setLoadingUsers(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(response.data);
            setLoadingUsers(false);
        } catch (error) {
            console.error('Error fetching all users:', error);
            setMessage('Failed to load users.');
            setLoadingUsers(false);
        }
    };

    // --- Order Action Functions (Original) ---
    const handleMarkDelivered = async (orderId) => {
        if (!window.confirm('Mark this order as DELIVERED?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/deliver`, {}, config);
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, isDelivered: true, deliveredAt: response.data.deliveredAt } : order
            ));
            alert('Order marked as delivered.');
        } catch (error) {
            console.error('Error marking as delivered:', error);
            alert(error.response?.data?.message || 'Failed to update order.');
        }
    };
    const handleMarkPaid = async (orderId) => {
        if (!window.confirm('Mark this order as PAID? (COD Confirmation)')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/pay`, {}, config);
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, isPaid: true, paidAt: response.data.paidAt } : order
            ));
            alert('Order marked as paid.');
        } catch (error) {
            console.error('Error marking as paid:', error);
            alert(error.response?.data?.message || 'Failed to update order.');
        }
    };
    
    // --- User Action Functions (Original) ---
    const handleBanUser = async (userId) => {
        if (!window.confirm('Are you sure you want to BAN this user?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.put(`http://localhost:5000/api/admin/users/${userId}/ban`, {}, config);
            setUsers(response.data); 
            alert('User has been banned.');
        } catch (error) {
            console.error('Error banning user:', error);
            alert(error.response?.data?.message || 'Failed to ban user.');
        }
    };
    const handleUnbanUser = async (userId) => {
        if (!window.confirm('Are you sure you want to UNBAN this user?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.put(`http://localhost:5000/api/admin/users/${userId}/unban`, {}, config);
            setUsers(response.data); 
            alert('User has been unbanned.');
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert(error.response?.data?.message || 'Failed to unban user.');
        }
    };

    // --- Set User Role Function (Original) ---
    const handleSetRole = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            const response = await axios.put(
                `http://localhost:5000/api/admin/users/${userId}/set-role`, 
                { role: newRole }, 
                config
            );
            
            setUsers(response.data); 
            alert(`User role updated to ${newRole}.`);
        } catch (error) {
            console.error('Error setting user role:', error);
            alert(error.response?.data?.message || 'Failed to set role.');
        }
    };
    // --- Data Fetching and Handlers End ---


    useEffect(() => {
        fetchAllOrders();
        fetchAllUsers();
    }, []);


    return (
        <div style={styles.pageContainer}>
            <div style={styles.dashboardContainer}>
                <h1 style={styles.mainHeading}>Admin Dashboard 👑</h1>
                {message && <p style={styles.combine(styles.statusBadge, styles.badgeRed)}>{message}</p>}

                {/* ------------------------------------------------------------- */}
                {/* --- Section 1: All Orders --- */}
                <div style={styles.sectionCard}>
                    <h2 style={styles.sectionTitle}>Manage All Orders</h2>
                    
                    {loadingOrders ? <p style={{ color: '#6c757d' }}>Loading all orders...</p> : (
                        <table style={styles.table}>
                            <thead style={styles.tableHead}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>ID</th>
                                    <th style={styles.tableHeaderCell}>Buyer</th>
                                    <th style={styles.tableHeaderCell}>Total</th>
                                    <th style={styles.tableHeaderCell}>Status</th>
                                    <th style={styles.tableHeaderCell}>Paid</th>
                                    <th style={styles.tableHeaderCell}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} style={styles.tableRow}>
                                        
                                        <td style={styles.tableCell}>
                                            <Link to={`/order/${order._id}`} style={{ color: styles.badgeBlue.color, textDecoration: 'none', fontWeight: 'bold' }}>
                                                {order._id.substring(0, 8)}...
                                            </Link>
                                        </td>
                                        <td style={styles.tableCell}>{order.user ? order.user.username : 'N/A'}</td>
                                        <td style={styles.tableCell}>${order.totalPrice}</td>
                                        
                                        {/* Status Badge */}
                                        <td style={styles.tableCell}>
                                            <span style={styles.combine(
                                                styles.statusBadge,
                                                order.isCancelled ? styles.badgeGray :
                                                order.isDelivered ? styles.badgeGreen :
                                                order.isShipped ? styles.badgeBlue :
                                                styles.badgeOrange
                                            )}>
                                                {order.isCancelled ? "CANCELLED" :
                                                order.isDelivered ? "DELIVERED" :
                                                order.isShipped ? "SHIPPED" :
                                                "PENDING"}
                                            </span>
                                        </td>
                                        
                                        {/* Paid Status Badge */}
                                        <td style={styles.tableCell}>
                                            <span style={styles.combine(
                                                styles.statusBadge,
                                                order.isPaid ? styles.badgeGreen : styles.badgeRed
                                            )}>
                                                {order.isPaid ? "YES" : "NO"}
                                            </span>
                                        </td>
                                        
                                        {/* Action Buttons */}
                                        <td style={styles.tableCell}>
                                            <div style={styles.actionButtonContainer}>
                                                
                                                {!order.isDelivered && !order.isCancelled && (
                                                    <button onClick={() => handleMarkDelivered(order._id)}
                                                        style={styles.combine(styles.actionButton, styles.deliverButton)}
                                                    >Mark Delivered</button>
                                                )}
                                                
                                                {!order.isPaid && !order.isCancelled && (
                                                    <button onClick={() => handleMarkPaid(order._id)}
                                                        style={styles.combine(styles.actionButton, styles.payButton)}
                                                    >Mark as Paid</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* --- Section 2: All Users --- */}
                <div style={styles.sectionCard}>
                    <h2 style={styles.sectionTitle}>Manage All Users</h2>
                    
                    {loadingUsers ? <p style={{ color: '#6c757d' }}>Loading all users...</p> : (
                        <table style={styles.table}>
                            <thead style={styles.tableHead}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>Username</th>
                                    <th style={styles.tableHeaderCell}>Email</th>
                                    <th style={styles.tableHeaderCell}>Role</th>
                                    <th style={styles.tableHeaderCell}>Status</th>
                                    <th style={styles.tableHeaderCell}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} style={styles.tableRow}>
                                        
                                        <td style={styles.tableCell}>{user.username}</td>
                                        <td style={styles.tableCell}>{user.email}</td>
                                        
                                        {/* Role Badge */}
                                        <td style={styles.tableCell}>
                                            <span style={styles.combine(
                                                styles.statusBadge,
                                                user.email === SUPER_ADMIN_EMAIL ? styles.badgePurple :
                                                user.role === 'admin' ? styles.badgePurple :
                                                user.role === 'seller' ? styles.badgeBlue :
                                                styles.badgeGray
                                            )}>
                                                {user.email === SUPER_ADMIN_EMAIL ? "SUPER ADMIN" : user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        
                                        {/* Ban Status Badge */}
                                        <td style={styles.tableCell}>
                                            <span style={styles.combine(
                                                styles.statusBadge,
                                                user.isBanned ? styles.badgeRed : styles.badgeGreen
                                            )}>
                                                {user.isBanned ? "BANNED" : "ACTIVE"}
                                            </span>
                                        </td>
                                        
                                        {/* Actions */}
                                        <td style={styles.tableCell}>
                                            
                                            {/* Hide buttons for Super Admin and Self */}
                                            {user._id === currentAdminId ? (
                                                <span style={{ color: '#6c757d' }}>(You)</span>
                                            ) : user.email === SUPER_ADMIN_EMAIL ? (
                                                <span style={{ color: styles.badgePurple.color }}>(Main Owner)</span>
                                            ) : (
                                                <div style={styles.actionButtonContainer}>
                                                    
                                                    {/* Ban/Unban */}
                                                    {user.isBanned ? (
                                                        <button onClick={() => handleUnbanUser(user._id)}
                                                            style={styles.combine(styles.actionButton, styles.unbanButton)}
                                                        >Unban</button>
                                                    ) : (
                                                        <button onClick={() => handleBanUser(user._id)}
                                                            style={styles.combine(styles.actionButton, styles.banButton)}
                                                        >Ban</button>
                                                    )}
                                                    
                                                    {/* Role Buttons */}
                                                    {user.role !== 'buyer' && (
                                                        <button onClick={() => handleSetRole(user._id, 'buyer')}
                                                            style={styles.combine(styles.actionButton, styles.makeBuyerButton)}
                                                        >Make Buyer</button>
                                                    )}
                                                    {user.role !== 'seller' && (
                                                        <button onClick={() => handleSetRole(user._id, 'seller')}
                                                            style={styles.combine(styles.actionButton, styles.makeSellerButton)}
                                                        >Make Seller</button>
                                                    )}
                                                    {user.role !== 'admin' && (
                                                        <button onClick={() => handleSetRole(user._id, 'admin')}
                                                            style={styles.combine(styles.actionButton, styles.makeAdminButton)}
                                                        >Make Admin</button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;