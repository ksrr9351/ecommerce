import React from 'react';

interface Product {
    id: string | number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

interface ProductItemProps {
    product: Product;
    onRemove: (id: string | number) => void;
    onQuantityChange: (id: string | number, quantity: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onRemove, onQuantityChange }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-16 h-16 object-contain mr-4" 
                />
                <div>
                    <h3 className="font-medium text-gray-800">{product.title}</h3>
                    <div className="flex items-center mt-2">
                        <button 
                            className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center"
                            onClick={() => onQuantityChange(product.id, Math.max(1, product.quantity - 1))}
                        >
                            -
                        </button>
                        <span className="mx-3">{product.quantity}</span>
                        <button 
                            className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center"
                            onClick={() => onQuantityChange(product.id, product.quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <div className="text-gray-600">${product.price.toFixed(2)}</div>
                <div className="font-bold">${(product.price * product.quantity).toFixed(2)}</div>
                <button 
                    className="mt-2 text-red-500 text-xl"
                    onClick={() => onRemove(product.id)}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default ProductItem;