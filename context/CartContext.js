'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    const getCurrentUser = async () => {
        try {
            const response = await fetch('/api/UserAuth');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setUser(data.user || null); 
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error("Error parsing cart from localStorage:", error);
                localStorage.removeItem('cart'); 
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    return (
        <CartContext.Provider value={{ cart, setCart, user }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  };