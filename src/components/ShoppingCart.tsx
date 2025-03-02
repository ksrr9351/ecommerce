import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import './ShoppingCart.css';

interface Product {
    id: string | number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

const ShoppingCart: React.FC = () => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [shipping, setShipping] = useState<number>(0);

    useEffect(() => {
        // Load cart from sessionStorage
        const loadCart = () => {
            const cartData = sessionStorage.getItem('cart');
            if (cartData) {
                try {
                    // Parse the cart data
                    const parsedCart = JSON.parse(cartData);
                    
                    // Ensure each item has a quantity property
                    const itemsWithQuantity = parsedCart.map((item: any) => ({
                        ...item,
                        quantity: item.quantity || 1 // Default to 1 if quantity is not specified
                    }));
                    
                    setCartItems(itemsWithQuantity);
                } catch (error) {
                    console.error('Error parsing cart data:', error);
                    setCartItems([]);
                }
            }
        };

        loadCart();
    }, []);

    useEffect(() => {
        // Calculate subtotal whenever cart items change
        const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSubtotal(newSubtotal);
        
        // Calculate shipping (free if subtotal > 100, otherwise $10)
        setShipping(newSubtotal > 100 ? 0 : 10);
        
        // Update sessionStorage with the updated cart
        if (cartItems.length > 0) {
            sessionStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
            sessionStorage.removeItem('cart');
        }
    }, [cartItems]);

    const handleRemoveItem = (id: string | number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id: string | number, newQuantity: number) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    if (cartItems.length === 0) {
        return (
            <div className="shopping-cart-container">
                <h2 className="cart-title">Your Shopping Cart</h2>
                <div className="cart-content">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p className="empty-cart-message">Your cart is empty</p>
                        <a href="/" className="return-to-shop">Continue Shopping</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="shopping-cart-container">
            <h2 className="cart-title">Your Shopping Cart <span className="cart-badge">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span></h2>
            
            <div className="cart-content">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-image-container">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="item-image" 
                            />
                        </div>
                        <div className="item-details">
                            <h3 className="item-title">{item.title}</h3>
                            <div className="quantity-control">
                                <button 
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="quantity-value">{item.quantity}</span>
                                <button 
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="item-price-container">
                            <div className="item-unit-price">${item.price.toFixed(2)} each</div>
                            <div className="item-total-price">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <button 
                            className="remove-item"
                            onClick={() => handleRemoveItem(item.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
                
                <div className="cart-summary">
                    <div className="summary-row">
                        <span className="summary-label">Subtotal</span>
                        <span className="subtotal-value">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span className="summary-label">Shipping</span>
                        <span className="shipping-value">
                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="total-row">
                        <span className="total-label">Total</span>
                        <span className="total-value">${(subtotal + shipping).toFixed(2)}</span>
                    </div>
                    
                    <button className="checkout-button">
                        Proceed to Checkout
                    </button>
                    
                    <a href="/" className="continue-shopping">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Continue Shopping
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;