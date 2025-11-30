// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    
    const getInitialState = (key, defaultValue) => {
        const storedItem = localStorage.getItem(key);
        return storedItem ? JSON.parse(storedItem) : defaultValue;
    };

    const [cartItems, setCartItems] = useState(getInitialState('cartItems', []));
    const [shippingAddress, setShippingAddress] = useState(getInitialState('shippingAddress', {}));
    const [paymentMethod, setPaymentMethod] = useState(getInitialState('paymentMethod', 'Cash on Delivery'));

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    useEffect(() => {
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    }, [paymentMethod]);
    

    // --- ADD TO CART FUNCTION (Updated Bug Fix) ---
    const addToCart = (product, qty) => {
        
   
        const productId = product._id;
        
       
        const exist = cartItems.find((item) => item.product === productId);

        let newCartItems;
        if (exist) {
            
            newCartItems = cartItems.map((item) =>
                item.product === productId ? { ...item, qty: item.qty + qty } : item
            );
        } else {

            newCartItems = [
                ...cartItems, 
                { 
                    product: productId, 
                    name: product.name, 

                    image: product.image || product.imageUrl, 
                    price: product.price,
                    stock: product.stock,
                    qty: qty 
                }
            ];
        }

        setCartItems(newCartItems);
    };


    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter((item) => item.product !== productId));
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        shippingAddress,
        paymentMethod,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};