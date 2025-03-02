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

  // Load products and cart data on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        // Limit to only 8 products
        const limitedProducts = data.slice(0, 8); // Take only the first 8 products
        setProducts(limitedProducts);

        // Load cart data from sessionStorage
        const cartData = sessionStorage.getItem('cart');
        if (cartData) {
          const cartItems = JSON.parse(cartData);

          // Initialize cart quantities and addedToCart states based on sessionStorage
          const initialQuantities: { [key: number]: number } = {};
          const initialAddedToCart: { [key: number]: boolean } = {};

          cartItems.forEach((item: any) => {
            initialQuantities[item.id] = item.quantity;
            initialAddedToCart[item.id] = true;
          });

          setCartQuantities(initialQuantities);
          setAddedToCart(initialAddedToCart);

          // Update cart count
          updateCartCount(cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, [updateCartCount]);

  // Function to save the cart to sessionStorage
  const saveCartToSessionStorage = (updatedCart: any[]) => {
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));
    setCartQuantities((prev) => {
      const newQuantities = { ...prev, [product.id]: (prev[product.id] || 0) + 1 };

      // Update cart in sessionStorage
      const currentCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex !== -1) {
        // If product already exists, increment quantity
        currentCart[existingItemIndex].quantity += 1;
      } else {
        // If product doesn't exist, add it to cart
        currentCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
          rating: product.rating
        });
      }

      // Save updated cart to sessionStorage
      saveCartToSessionStorage(currentCart);

      // Update cart count
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0));

      return newQuantities;
    });
  };

  // Increase item quantity
  const handleIncrease = (product: Product) => {
    setCartQuantities((prev) => {
      const newQuantities = { ...prev, [product.id]: (prev[product.id] || 0) + 1 };

      // Update cart in sessionStorage
      const currentCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity += 1;
      }

      saveCartToSessionStorage(currentCart);

      // Update cart count
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0));

      return newQuantities;
    });
  };

  // Decrease item quantity
  const handleDecrease = (product: Product) => {
    setCartQuantities((prev) => {
      const newQuantities = { ...prev, [product.id]: Math.max((prev[product.id] || 0) - 1, 0) };

      if (newQuantities[product.id] === 0) {
        setAddedToCart((prevAdded) => {
          const newAdded = { ...prevAdded };
          delete newAdded[product.id]; // Remove the product from "addedToCart" when the quantity is 0
          return newAdded;
        });
      }

      // Update cart in sessionStorage
      const currentCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity = newQuantities[product.id];
        if (newQuantities[product.id] === 0) {
          currentCart.splice(existingItemIndex, 1); // Remove item from cart if quantity is 0
        }
      }

      saveCartToSessionStorage(currentCart);

      // Update cart count
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0));

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
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="cart-quantity-container">
                    <button
                      onClick={() => handleIncrease(product)}
                      className="cart-action-btn"
                    >
                      +
                    </button>
                    <span className="cart-quantity">{cartQuantities[product.id] || 0}</span>
                    <button
                      onClick={() => handleDecrease(product)}
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
