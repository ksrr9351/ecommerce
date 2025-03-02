import React, { useState, useEffect } from 'react';
import { Product } from '../models/Product';

interface LimitedOfferProps {
  updateCartCount: (count: number) => void;
}

const LimitedOffer: React.FC<LimitedOfferProps> = ({ updateCartCount }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({}); // Track if product has been added to cart

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        // Filter products that are on 'Limited Offer' (you can modify the filter condition as needed)
        const limitedOffers = data.filter((product: any) => product.price < 50); // Example condition for limited offers
        
        // Limit the number of displayed products to 2
        const limitedItems = limitedOffers.slice(0, 2);

        setProducts(limitedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error loading limited offers:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleIncrease = (productId: number) => {
    setCartQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities, [productId]: (prevQuantities[productId] || 0) + 1 };
      updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0)); // Update the total cart count
      return updatedQuantities;
    });
  };

  const handleDecrease = (productId: number) => {
    setCartQuantities((prevQuantities) => {
      if ((prevQuantities[productId] || 0) > 1) {
        const updatedQuantities = { ...prevQuantities, [productId]: (prevQuantities[productId] || 0) - 1 };
        updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0)); // Update the total cart count
        return updatedQuantities;
      }
      // If quantity reaches 0, remove the product from the cart and revert back to "Add to Cart" button
      const updatedQuantities = { ...prevQuantities, [productId]: 0 };
      setAddedToCart((prev) => ({
        ...prev,
        [productId]: false, // Reset addedToCart for this product to show the Add to Cart button again
      }));
      updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0)); // Update the total cart count
      return updatedQuantities;
    });
  };

  const handleAddToCart = (productId: number) => {
    // Mark the product as added to cart
    setAddedToCart((prev) => ({
      ...prev,
      [productId]: true,
    }));

    // Initialize the cart quantity for that product
    setCartQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));

    // Get the product info
    const product = products.find((product) => product.id === productId);

    if (product) {
      // Retrieve the cart from localStorage (if it exists)
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Add the new product to the cart
      const updatedCart = [...existingCart, { id: product.id, title: product.title, price: product.price }];

      // Save the updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Update the total cart count
      updateCartCount(Object.values(cartQuantities).reduce((acc, curr) => acc + curr, 0) + 1); // Update the total cart count
    }
  };

  return (
    <section className="limited-offer">
      <h2 className="section-title">Limited Offer</h2>
      
      <div className="limited-offers-container">
        {loading ? (
          <div className="loading">Loading offers...</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="limited-offer-card">
              <div className="offer-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="offer-details">
                <div className="offer-header">
                  <h3>Limited Deals</h3>
                </div>
                <div className="countdown">
                  <div className="time-box">
                    <span className="number">08</span>
                    <span className="unit">Hours</span>
                  </div>
                  <div className="time-box">
                    <span className="number">58</span>
                    <span className="unit">Minutes</span>
                  </div>
                  <div className="time-box">
                    <span className="number">18</span>
                    <span className="unit">Seconds</span>
                  </div>
                </div>
                <h3 className="product-name">{product.title}</h3>
                <div className="price-container">
                  <span className="original-price">${product.price}</span>
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
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LimitedOffer;
