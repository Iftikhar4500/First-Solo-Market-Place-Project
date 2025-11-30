// src/pages/OrderDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function OrderDetailsPage() {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // --- CUSTOM STYLES START ---
    const styles = {
        // Page container
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', 
            padding: '2rem',
            minHeight: '85vh',
        },
        // Main container (centered)
        mainContent: {
            maxWidth: '1400px',
            margin: '0 auto',
        },
        mainHeading: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e9ecef',
        },
        // Two-column layout
        detailsLayout: {
            display: 'flex',
            gap: '2.5rem',
        },
        // Left side (Details and Items)
        detailsColumn: {
            flex: '3',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
        },
        // Right side (Summary Card)
        summaryCard: {
            flex: '1',
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
            height: 'fit-content',
        },
        // Individual Detail Box (Shipping, Payment, Items)
        detailBox: {
            backgroundColor: '#ffffff',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        },
        sectionTitle: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#343a40',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #e9ecef',
        },
        detailText: {
            margin: '0.5rem 0',
            fontSize: '1rem',
            color: '#495057',
        },
        // Status Badges (Consistent with Seller Dashboard)
        statusBadge: {
            padding: '0.35rem 0.75rem',
            borderRadius: '15px', 
            fontSize: '0.85rem',
            fontWeight: '700',
            textAlign: 'center',
            display: 'inline-block',
            marginLeft: '0.5rem',
        },
        statusPaid: {
            color: '#155724',
            backgroundColor: '#d4edda', // Light Green (Paid/Delivered)
        },
        statusNotPaid: {
            color: '#721c24',
            backgroundColor: '#f8d7da', // Light Red (Not Paid)
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
        // Order Item Styling
        itemCard: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee',
        },
        itemImage: {
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginRight: '1rem',
        },
        itemLink: {
            flex: 1, 
            color: '#007bff', 
            textDecoration: 'none', 
            fontWeight: '600',
        },
        itemTotal: {
            marginLeft: 'auto',
            fontSize: '1rem',
            color: '#343a40',
        },
        // Summary Styles
        summaryLine: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '1rem',
            color: '#495057',
        },
        summaryTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '1.4em',
            paddingTop: '1rem',
            borderTop: '2px solid #e9ecef',
            marginTop: '1rem',
        },
        combine: (style1, style2) => ({ ...style1, ...style2 }),
    };
    // --- CUSTOM STYLES END ---

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setMessage(error.response?.data?.message || 'Failed to load order.');
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // Conditional Renders
    if (loading) return <p style={styles.combine(styles.detailText, { padding: '20px', textAlign: 'center' })}>Loading order details...</p>;
    if (message) return <p style={styles.combine(styles.error, { padding: '20px' })}>Error: {message}</p>;
    if (!order) return <p style={styles.combine(styles.detailText, { padding: '20px', textAlign: 'center' })}>Order not found.</p>;

    // Status logic helper
    const getShippingStatusBadge = () => {
        let statusText = 'Pending...';
        let statusStyle = styles.statusPending;

        if (order.isCancelled) {
            statusText = 'Cancelled';
            statusStyle = styles.statusCancelled;
        } else if (order.isDelivered) {
            statusText = `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`;
            statusStyle = styles.statusPaid; // Using paid/delivered style
        } else if (order.isShipped) {
            statusText = `Shipped on ${new Date(order.shippedAt).toLocaleDateString()}`;
            statusStyle = styles.statusShipped;
        }

        return <span style={styles.combine(styles.statusBadge, statusStyle)}>{statusText}</span>;
    };

    const getPaymentStatusBadge = () => {
        let statusText = 'Not Paid';
        let statusStyle = styles.statusNotPaid;

        if (order.isPaid) {
            statusText = `Paid on ${new Date(order.paidAt).toLocaleDateString()}`;
            statusStyle = styles.statusPaid;
        }
        return <span style={styles.combine(styles.statusBadge, statusStyle)}>{statusText}</span>;
    };
    
    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainContent}>
                <h1 style={styles.mainHeading}>Order Details <span style={{fontSize: '0.6em', fontWeight: '400', color: '#6c757d'}}>(ID: {order._id})</span></h1>
                
                <div style={styles.detailsLayout}>
                    
                    {/* Left Side: Details and Items */}
                    <div style={styles.detailsColumn}>
                        
                        {/* 1. Shipping Details */}
                        <div style={styles.detailBox}>
                            <h2 style={styles.sectionTitle}>Shipping</h2>
                            <p style={styles.detailText}>
                                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            <p style={styles.detailText}>
                                <strong>Delivery Status:</strong> {getShippingStatusBadge()}
                            </p>
                        </div>

                        {/* 2. Payment Details */}
                        <div style={styles.detailBox}>
                            <h2 style={styles.sectionTitle}>Payment Method</h2>
                            <p style={styles.detailText}><strong>Method:</strong> {order.paymentMethod}</p>
                            <p style={styles.detailText}>
                                <strong>Payment Status:</strong> {getPaymentStatusBadge()}
                            </p>
                        </div>

                        {/* 3. Order Items */}
                        <div style={styles.detailBox}>
                            <h2 style={styles.sectionTitle}>Order Items</h2>
                            {order.orderItems.length === 0 ? <p style={styles.detailText}>No items in this order.</p> : (
                                <div>
                                    {order.orderItems.map((item) => (
                                        <div key={item._id} style={styles.itemCard}>
                                            <img src={`http://localhost:5000${item.image}`} alt={item.name} style={styles.itemImage} />
                                            <Link to={`/product/${item.product}`} style={styles.itemLink}>{item.name}</Link>
                                            <div style={styles.itemTotal}>
                                                {item.qty} x ${item.price} = <strong style={{color: '#343a40'}}>${(item.qty * item.price).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Order Total */}
                    <div style={styles.summaryCard}>
                        <h2 style={styles.sectionTitle}>Order Summary</h2>
                        
                        <div style={styles.summaryLine}>
                            <span>Items Price:</span>
                            <span>${order.itemsPrice}</span>
                        </div>
                        <div style={styles.summaryLine}>
                            <span>Shipping Cost:</span>
                            <span>${order.shippingPrice}</span>
                        </div>
                        
                        <div style={styles.summaryTotal}>
                            <span>Final Total:</span>
                            <span>${order.totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsPage;