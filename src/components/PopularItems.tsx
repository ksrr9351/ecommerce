import React, { useEffect, useState } from 'react';
import { Product } from '../models/Product';

interface PopularItemsProps {
    updateCartCount: (count: number) => void;  // Define the prop type
  }

  const PopularItems: React.FC<PopularItemsProps> = ({ updateCartCount }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({}); // Track if product has been added to cart

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        // Filter products that are 'Popular' based on rating rate (greater than or equal to 4)
        const popularItems = data.filter((product: any) => product.rating?.rate >= 4);

        // Limit the number of displayed products to 4
        const limitedItems = popularItems.slice(0, 4);

        setProducts(limitedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error loading popular items:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Function to increase product quantity
  const handleIncrease = (productId: number) => {
    setCartQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities, [productId]: (prevQuantities[productId] || 0) + 1 };
      updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0));
      return updatedQuantities;
    });
  };

  // Function to decrease product quantity
  const handleDecrease = (productId: number) => {
    setCartQuantities((prevQuantities) => {
      if ((prevQuantities[productId] || 0) > 1) {
        const updatedQuantities = { ...prevQuantities, [productId]: (prevQuantities[productId] || 0) - 1 };
        updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0));
        return updatedQuantities;
      }
      // If quantity reaches 0, reset the addedToCart to false to show the "Add to Cart" button again
      const updatedQuantities = { ...prevQuantities, [productId]: 0 };
      setAddedToCart((prev) => ({
        ...prev,
        [productId]: false, // Reset addedToCart for this product
      }));
      updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0));
      return updatedQuantities;
    });
  };

  // Function to handle the "Add to Cart" button click
  const handleAddToCart = (productId: number) => {
    setAddedToCart((prev) => ({
      ...prev,
      [productId]: true, // Mark the product as added to cart
    }));

    // Initialize the cart quantity for that product
    setCartQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
    updateCartCount(Object.values(cartQuantities).reduce((acc, curr) => acc + curr, 0) + 1);
  };

  return (
    <section className="popular-items">
      <div className="section-header">
        <h2 className="section-title">Popular This Week</h2>
        <a href="/view-all" className="view-all">View all →</a>
      </div>

      <div className="popular-grid">
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
                {product.rating && (
                  <div className="product-rating">
                    {renderStars(Math.round(product.rating.rate))}
                  </div>
                )}
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
    </section>
  );
};

export default PopularItems;
