import React, { useEffect, useState } from 'react';
import { Product } from '../models/Product';

interface FeaturedProductsProps {
  updateCartCount: (count: number) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ updateCartCount }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        // Limit to only 8 products
        const limitedProducts = data.slice(0, 8); // Take only the first 8 products
        setProducts(limitedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Add to cart handler
  const handleAddToCart = (productId: number) => {
    setAddedToCart((prev) => ({ ...prev, [productId]: true }));
    setCartQuantities((prev) => {
      const newQuantities = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0)); // Update total cart count
      return newQuantities;
    });
  };

  // Increase item quantity
  const handleIncrease = (productId: number) => {
    setCartQuantities((prev) => {
      const newQuantities = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0)); // Update total cart count
      return newQuantities;
    });
  };

  // Decrease item quantity
  const handleDecrease = (productId: number) => {
    setCartQuantities((prev) => {
      const newQuantities = { ...prev, [productId]: Math.max((prev[productId] || 0) - 1, 0) };
      if (newQuantities[productId] === 0) {
        setAddedToCart((prevAdded) => {
          const newAdded = { ...prevAdded };
          delete newAdded[productId]; // Remove the product from "addedToCart" when the quantity is 0
          return newAdded;
        });
      }
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0)); // Update total cart count
      return newQuantities;
    });
  };

  return (
    <section className="featured-products">
      <div className="section-header">
        <h2 className="section-title">Featured</h2>
        <a href="/view-all" className="view-all">View all →</a>
      </div>
      
      <div className="featured-grid">
        <div className="featured-main">
          <div className="featured-product-banner">
            <div className="banner-content">
              <h3>Discover Our</h3>
              <h2>Featured Product</h2>
            </div>
          </div>
        </div>
        
        <div className="featured-items">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.title}</h3>
                  <span className="product-price">${product.price}</span>
                </div>

                {/* Add to Cart Button or Quantity Controls */}
                {!addedToCart[product.id] ? (
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="cart-quantity-container">
                    <button
                      onClick={() => handleIncrease(product.id)}
                      className="cart-action-btn"
                    >
                      +
                    </button>
                    <span className="cart-quantity">{cartQuantities[product.id] || 0}</span>
                    <button
                      onClick={() => handleDecrease(product.id)}
                      className="cart-action-btn"
                    >
                      -
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
