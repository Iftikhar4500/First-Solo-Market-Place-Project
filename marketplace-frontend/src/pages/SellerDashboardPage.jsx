// src/pages/SellerDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SellerDashboardPage() {
    // States
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingSales, setLoadingSales] = useState(true);
    const [message, setMessage] = useState(''); // Note: Yeh message state use nahi ho raha, but maine rakha hai
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        fetchMyProducts();
        fetchMySales();
    }, []);

    const fetchMyProducts = async () => {
        setLoadingProducts(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/products/myproducts', config);
            setProducts(response.data);
            setLoadingProducts(false);
        } catch (error) {
            console.error('Error fetching seller products:', error);
            setMessage('Failed to load products.'); // State set ho raha hai
            setLoadingProducts(false);
        }
    };

    const fetchMySales = async () => {
        setLoadingSales(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/orders/my-sales', config);
            setSales(response.data);
            setLoadingSales(false);
        } catch (error) {
            console.error('Error fetching seller sales:', error);
            setMessage('Failed to load sales data.'); // State set ho raha hai
            setLoadingSales(false);
        }
    };

    // --- Event Handlers ---
    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
            setProducts(products.filter(p => p._id !== productId));
            alert('Product deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(error.response?.data?.message || 'Failed to delete product.');
        }
    };

    const handleMarkShipped = async (orderId) => {
        if (!window.confirm('Mark this order as shipped?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/ship`, {}, config);
            setSales(sales.map(order => 
                order._id === orderId ? { ...order, isShipped: true, shippedAt: response.data.shippedAt } : order
            ));
            alert('Order marked as shipped.');
        } catch (error) {
            console.error('Error marking as shipped:', error);
            alert(error.response?.data?.message || 'Failed to update order.');
        }
    };

    const toggleOrderItems = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };


    // --- CUSTOM STYLES ---
    const styles = {
        pageContainer: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8f9fa', // Light grey page background
            padding: '2rem',
            minHeight: '100vh',
        },
        dashboardContainer: {
            maxWidth: '1400px',
            margin: '0 auto',
        },
        mainHeading: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#343a40',
            marginBottom: '2rem',
        },
        // White card container
        sectionCard: {
            backgroundColor: '#ffffff',
            padding: '2rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.07)',
            marginBottom: '2rem',
        },
        // Header for each card (Title + Button)
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e9ecef',
        },
        sectionTitle: {
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#343a40',
            margin: 0,
        },
        // "+ Add New Product" button
        primaryButton: {
            textDecoration: 'none',
            backgroundColor: '#28a745', // Green
            color: 'white',
            padding: '0.7rem 1.2rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s',
        },
        // Modern Table
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
        },
        tableHead: {
            backgroundColor: '#f8f9fa', // Light grey header row
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
            borderBottom: '1px solid #e9ecef', // Row separator
        },
        tableCell: {
            padding: '1rem 1.2rem',
            verticalAlign: 'middle',
            color: '#495057',
            fontSize: '1rem',
        },
        productImage: {
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
        },
        // Action buttons (Edit, Delete, Ship)
        actionButton: {
            border: 'none',
            padding: '0.5rem 0.8rem',
            cursor: 'pointer',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.85rem',
            transition: 'opacity 0.2s',
        },
        editButton: {
            backgroundColor: '#007bff', // Blue
            marginRight: '8px',
        },
        deleteButton: {
            backgroundColor: '#dc3545', // Red
        },
        shipButton: {
            backgroundColor: '#17a2b8', // Info/Teal
        },
        // "Show/Hide Items" button
        toggleButton: {
            background: 'transparent',
            border: '1px solid #ced4da',
            color: '#495057',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
        },
        // --- Status Badges ---
        statusBadge: {
            padding: '0.35rem 0.75rem',
            borderRadius: '15px', // Pill shape
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
            backgroundColor: '#fff3cd', // Light Yellow
        },
        statusCancelled: {
            color: '#383d41',
            backgroundColor: '#e2e3e5', // Light Grey
        },
        // --- Expanded Row ---
        expandedRow: {
            backgroundColor: '#fdfdfd', // Slightly off-white
        },
        expandedCell: {
            padding: '1.5rem 2rem',
        },
        itemList: {
            listStyle: 'none',
            paddingLeft: 0,
            margin: 0,
        },
        itemListItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 0',
            borderBottom: '1px solid #e9ecef',
        },
        itemListItemImage: {
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginRight: '1rem',
        },
        loadingText: {
            padding: '2rem',
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#6c757d',
        },
        combine: (style1, style2) => ({ ...style1, ...style2 }),
    };


    return (
        <div style={styles.pageContainer}>
            <div style={styles.dashboardContainer}>
                <h1 style={styles.mainHeading}>Seller Dashboard</h1>
                {message && <p style={{ color: 'red' }}>{message}</p>}

                {/* --- SECTION 1: My Products Card --- */}
                <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>My Products</h2>
                        <Link to="/add-product" style={styles.primaryButton}>
                            + Add New Product
                        </Link>
                    </div>

                    {loadingProducts ? (
                        <p style={styles.loadingText}>Loading your products...</p>
                    ) : products.length === 0 ? (
                        <p style={styles.loadingText}>You have not added any products yet.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead style={styles.tableHead}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>Image</th>
                                    <th style={styles.tableHeaderCell}>Name</th>
                                    <th style={styles.tableHeaderCell}>Price</th>
                                    <th style={styles.tableHeaderCell}>Stock</th>
                                    <th style={styles.tableHeaderCell}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} style={styles.tableRow}>
                                        <td style={styles.tableCell}>
                                            <img 
                                                src={`http://localhost:5000${product.imageUrl}`} 
                                                alt={product.name} 
                                                style={styles.productImage}
                                            />
                                        </td>
                                        <td style={styles.tableCell}>{product.name}</td>
                                        <td style={styles.tableCell}>${product.price}</td>
                                        <td style={styles.tableCell}>{product.stock}</td>
                                        <td style={styles.tableCell}>
                                            <Link to={`/product/edit/${product._id}`}>
                                                <button style={styles.combine(styles.actionButton, styles.editButton)}>
                                                    Edit
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                style={styles.combine(styles.actionButton, styles.deleteButton)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>


                {/* --- SECTION 2: My Sales (Orders) Card --- */}
                <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>My Sales (Orders)</h2>
                    </div>
                    
                    {loadingSales ? (
                        <p style={styles.loadingText}>Loading your sales data...</p>
                    ) : sales.length === 0 ? (
                        <p style={styles.loadingText}>You have not made any sales yet.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead style={styles.tableHead}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>Order ID</th>
                                    <th style={styles.tableHeaderCell}>Date</th>
                                    <th style={styles.tableHeaderCell}>Buyer</th>
                                    <th style={styles.tableHeaderCell}>Status</th>
                                    <th style={styles.tableHeaderCell}>Items</th>
                                    <th style={styles.tableHeaderCell}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr style={styles.tableRow}>
                                            <td style={styles.tableCell}>{order._id.substring(0, 8)}...</td>
                                            <td style={styles.tableCell}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={styles.tableCell}>{order.user ? order.user.username : 'N/A'}</td>
                                            <td style={styles.tableCell}>
                                                {/* Status Badge Logic */}
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
                                            <td style={styles.tableCell}>
                                                <button style={styles.toggleButton} onClick={() => toggleOrderItems(order._id)}>
                                                    {expandedOrderId === order._id ? 'Hide' : 'Show'} ({order.orderItems.length})
                                                </button>
                                            </td>
                                            <td style={styles.tableCell}>
                                                {!order.isShipped && !order.isDelivered && !order.isCancelled && (
                                                    <button
                                                        onClick={() => handleMarkShipped(order._id)}
                                                        style={styles.combine(styles.actionButton, styles.shipButton)}
                                                    >
                                                        Mark as Shipped
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        
                                        {/* --- Expanded Row --- */}
                                        {expandedOrderId === order._id && (
                                            <tr style={styles.expandedRow}>
                                                <td colSpan="6" style={styles.expandedCell}>
                                                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: '600' }}>
                                                        Items to Ship (Order {order._id.substring(0, 8)}):
                                                    </h4>
                                                    <ul style={styles.itemList}>
                                                        {order.orderItems.map((item) => (
                                                            <li key={item.product} style={styles.itemListItem}>
                                                                <img 
                                                                    src={`http://localhost:5000${item.image}`} 
                                                                    alt={item.name} 
                                                                    style={styles.itemListItemImage} 
                                                                />
                                                                {item.qty} x <strong>{item.name}</strong> (Price: ${item.price})
                                                            </li>
                                                        ))}
                                                        <li style={styles.combine(styles.itemListItem, { borderBottom: 'none', fontWeight: '700', marginTop: '1rem' })}>
                                                            Shipping to: {order.shippingAddress.address}, {order.shippingAddress.city}
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
}

export default SellerDashboardPage;