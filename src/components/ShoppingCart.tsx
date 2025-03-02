import React, { useState } from 'react';
import ProductItem from './ProductItem';

interface Product {
    id: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

const ShoppingCart: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]); // Here, we store the products in cart.
    const [couponCode, setCouponCode] = useState('');

    const handleRemove = (id: string) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        setProducts(
            products.map(product => 
                product.id === id ? { ...product, quantity } : product
            )
        );
    };

    const calculateTotal = () => {
        return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    };

    return (
        <div className="shopping-cart">
            <div className="containered">
                <h1 className="page-titles">Shopping Cart</h1>

                {/* Steps */}
                <div className="progress-steps">
                    <div className="step active">
                        <div className="step-number">1</div>
                        <div className="step-title">Shopping Cart</div>
                        <div className="step-line"></div>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-title">Checkout</div>
                        <div className="step-line"></div>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-title">Completed</div>
                    </div>
                </div>

                {/* Cart Table */}
                <div className="cart-table">
                    <div className="cart-header">
                        <div className="header-product">Product</div>
                        <div className="header-quantity">Quantity</div>
                        <div className="header-price">Price</div>
                        <div className="header-total">Total</div>
                        <div className="header-action"></div>
                    </div>

                    <div className="cart-items">
                        {products.map(product => (
                            <ProductItem 
                                key={product.id} 
                                product={product} 
                                onRemove={handleRemove}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Cart Footer */}
                <div className="cart-footer">
                    <div className="coupon-container">
                        <input 
                            type="text" 
                            placeholder="Enter coupon code" 
                            className="coupon-input"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="apply-coupon-button">Apply Code</button>
                    </div>
                    <div className="cart-total">
                        <span className="total-label">Total</span>
                        <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>

                {/* Cart Actions */}
                <div className="cart-actions">
                    <button className="continue-shopping-button">Continue Shopping</button>
                    <button className="checkout-button">Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
