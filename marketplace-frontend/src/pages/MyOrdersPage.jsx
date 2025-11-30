// src/pages/MyOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // --- CUSTOM STYLES START ---
    const styles = {
        // Page container
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', // Light grey page background
            padding: '2rem',
            minHeight: '85vh',
        },
        ordersContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: '#ffffff', // White card background
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
        },
        mainHeading: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e9ecef',
        },
        loadingText: {
            padding: '2rem',
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#6c757d',
        },
        // Table Design
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
        // Action buttons
        detailButton: {
            background: '#007bff', // Primary Blue
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.9rem',
        },
        cancelButton: {
            background: '#dc3545', // Red
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.9rem',
        },
        // --- Status Badges ---
        statusBadge: {
            padding: '0.35rem 0.75rem',
            borderRadius: '15px', 
            fontSize: '0.85rem',
            fontWeight: '700',
            textAlign: 'center',
            display: 'inline-block',
        },
        statusDelivered: {
            color: '#155724',
            backgroundColor: '#d4edda', // Light Green
        },
        statusShipped: {
            color: '#004085',
            backgroundColor: '#cce5ff', // Light Blue
        },
        statusPending: {
            color: '#856404',
            backgroundColor: '#fff3cd', // Light Yellow/Orange
        },
        statusCancelled: {
            color: '#383d41',
            backgroundColor: '#e2e3e5', // Light Grey
        },
        combine: (style1, style2) => ({ ...style1, ...style2 }),
    };
    // --- CUSTOM STYLES END ---

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/orders/myorders', config);
            const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setMessage(error.response?.data?.message || 'Failed to load orders.');
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, config);
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, isCancelled: true } : order
            ));
            alert('Order successfully cancelled. Stock has been restored.');
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert(error.response?.data?.message || 'Failed to cancel order.');
        }
    };

    // --- JSX RENDER ---
    return (
        <div style={styles.pageContainer}>
            <div style={styles.ordersContainer}>
                <h1 style={styles.mainHeading}>My Orders</h1>
                
                {loading ? (
                    <p style={styles.loadingText}>Loading your orders...</p>
                ) : message ? (
                    <p style={styles.combine(styles.loadingText, { color: 'red' })}>{message}</p>
                ) : orders.length === 0 ? (
                    <p style={styles.loadingText}>You haven't placed any orders yet.</p>
                ) : (
                    <table style={styles.table}>
                        <thead style={styles.tableHead}>
                            <tr>
                                <th style={styles.tableHeaderCell}>ID</th>
                                <th style={styles.tableHeaderCell}>Date</th>
                                <th style={styles.tableHeaderCell}>Total</th>
                                <th style={styles.tableHeaderCell}>Status</th>
                                <th style={styles.tableHeaderCell}>Details</th>
                                <th style={styles.tableHeaderCell}>Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{order._id.substring(0, 8)}...</td>
                                    <td style={styles.tableCell}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={styles.tableCell}>${order.totalPrice}</td>
                                    
                                    {/* --- Status Badge --- */}
                                    <td style={styles.tableCell}>
                                        <span style={styles.combine(
                                            styles.statusBadge,
                                            order.isCancelled ? styles.statusCancelled :
                                            order.isDelivered ? styles.statusDelivered :
                                            order.isShipped ? styles.statusShipped :
                                            styles.statusPending
                                        )}>
                                            {order.isCancelled ? "Cancelled" :
                                            order.isDelivered ? "Delivered" :
                                            order.isShipped ? "Shipped" :
                                            "Pending"}
                                        </span>
                                    </td>
                                    
                                    {/* --- Details Button --- */}
                                    <td style={styles.tableCell}>
                                        <Link to={`/order/${order._id}`}>
                                            <button style={styles.detailButton}>
                                                View Details
                                            </button>
                                        </Link>
                                    </td>

                                    {/* --- Action Button --- */}
                                    <td style={styles.tableCell}>
                                        {/* Show Cancel button only if order is Pending/New (not shipped, delivered, or cancelled) */}
                                        {!order.isShipped && !order.isDelivered && !order.isCancelled && (
                                            <button 
                                                onClick={() => handleCancelOrder(order._id)}
                                                style={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MyOrdersPage;