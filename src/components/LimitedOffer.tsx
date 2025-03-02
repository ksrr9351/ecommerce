import React, { useState, useEffect } from 'react';
import { Product } from '../models/Product';

interface LimitedOfferProps {
  updateCartCount: (count: number) => void;
}

const LimitedOffer: React.FC<LimitedOfferProps> = ({ updateCartCount }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});

  // Load cart data from sessionStorage on component mount
  useEffect(() => {
    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    
    // Initialize cart quantities and addedToCart state from sessionStorage
    const initialQuantities: { [key: number]: number } = {};
    const initialAddedToCart: { [key: number]: boolean } = {};
    
    // Count products by ID
    existingCart.forEach((item: any) => {
      if (item.id) {
        initialQuantities[item.id] = (initialQuantities[item.id] || 0) + 1;
        initialAddedToCart[item.id] = true;
      }
    });
    
    setCartQuantities(initialQuantities);
    setAddedToCart(initialAddedToCart);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        // Filter products that are on 'Limited Offer'
        const limitedOffers = data.filter((product: any) => product.price < 50);
        
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

  const updateSessionStorage = (productId: number, quantityChange: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    // Get current cart
    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    
    if (quantityChange > 0) {
      // Add product to cart
      const newItem = { 
        id: product.id, 
        title: product.title, 
        price: product.price,
        image: product.image
      };
      existingCart.push(newItem);
    } else if (quantityChange < 0) {
      // Remove one instance of the product from cart
      const indexToRemove = existingCart.findIndex((item: any) => item.id === productId);
      if (indexToRemove !== -1) {
        existingCart.splice(indexToRemove, 1);
      }
    }
    
    // Save updated cart
    sessionStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Update global cart count (outside of render cycle)
    updateCartCount(existingCart.length);
  };

  const handleIncrease = (productId: number) => {
    setCartQuantities((prevQuantities) => {
      const updatedQuantities = { 
        ...prevQuantities, 
        [productId]: (prevQuantities[productId] || 0) + 1 
      };
      return updatedQuantities;
    });
    
    // Update sessionStorage after state update
    setTimeout(() => {
      updateSessionStorage(productId, 1);
    }, 0);
  };

  const handleDecrease = (productId: number) => {
    setCartQuantities((prevQuantities) => {
      if ((prevQuantities[productId] || 0) > 1) {
        const updatedQuantities = { 
          ...prevQuantities, 
          [productId]: (prevQuantities[productId] || 0) - 1 
        };
        
        // Schedule update to happen after render is complete
        setTimeout(() => {
          updateSessionStorage(productId, -1);
        }, 0);
        
        return updatedQuantities;
      }
      
      // If quantity reaches 0, remove the product from the cart
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[productId];
      
      setAddedToCart((prev) => ({
        ...prev,
        [productId]: false, // Reset addedToCart for this product
      }));
      
      // Schedule update to happen after render is complete
      setTimeout(() => {
        updateSessionStorage(productId, -1);
      }, 0);
      
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
      [productId]: 1,
    }));
    
    // Schedule update to happen after render is complete
    setTimeout(() => {
      updateSessionStorage(productId, 1);
    }, 0);
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
