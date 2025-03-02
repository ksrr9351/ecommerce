import React from 'react';

interface Product {
    id: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

interface ProductItemProps {
    product: Product;
    onRemove: (id: string) => void;
    onQuantityChange: (id: string, quantity: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onRemove, onQuantityChange }) => {
    return (
        <div className="product-item">
            <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
            </div>
            <div className="product-name">{product.title}</div>
            <div className="quantity-control">
                <button 
                    className="quantity-button" 
                    onClick={() => onQuantityChange(product.id, Math.max(1, product.quantity - 1))}
                >
                    -
                </button>
                <input 
                    type="text" 
                    value={product.quantity} 
                    readOnly 
                    className="quantity-input" 
                />
                <button 
                    className="quantity-button dark" 
                    onClick={() => onQuantityChange(product.id, product.quantity + 1)}
                >
                    +
                </button>
            </div>
            <div className="product-price">${product.price.toFixed(2)}</div>
            <div className="product-total">${(product.price * product.quantity).toFixed(2)}</div>
            <button className="remove-button" onClick={() => onRemove(product.id)}>
                ×
            </button>
        </div>
    );
};

export default ProductItem;
