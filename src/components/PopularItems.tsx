import React, { useEffect, useState } from 'react';
import { Product } from '../models/Product';

interface PopularItemsProps {
  updateCartCount: (count: number) => void;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  rating?: {
    rate: number;
    count: number;
  };
}

const PopularItems: React.FC<PopularItemsProps> = ({ updateCartCount }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});

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
        
        // Check if any products are already in the cart
        const cartData = sessionStorage.getItem('cart');
        if (cartData) {
          const cartItems: CartItem[] = JSON.parse(cartData);
          
          // Initialize cart quantities and addedToCart states based on sessionStorage
          const initialQuantities: { [key: number]: number } = {};
          const initialAddedToCart: { [key: number]: boolean } = {};
          
          cartItems.forEach(item => {
            initialQuantities[item.id] = item.quantity;
            initialAddedToCart[item.id] = true;
          });
          
          setCartQuantities(initialQuantities);
          setAddedToCart(initialAddedToCart);
          
          // Update cart count
          updateCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading popular items:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, [updateCartCount]);

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

  // Function to save the cart to sessionStorage
  const saveCartToSessionStorage = (updatedCart: CartItem[]) => {
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Function to get current cart from sessionStorage
  const getCartFromSessionStorage = (): CartItem[] => {
    const cartData = sessionStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  };

  // Function to increase product quantity
  const handleIncrease = (product: Product) => {
    setCartQuantities((prevQuantities) => {
      const updatedQuantities = { 
        ...prevQuantities, 
        [product.id]: (prevQuantities[product.id] || 0) + 1 
      };
      
      // Update cart in sessionStorage
      const currentCart = getCartFromSessionStorage();
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        currentCart[existingItemIndex].quantity = updatedQuantities[product.id];
      } else {
        // Add new item if it doesn't exist (shouldn't happen here but added for safety)
        currentCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: updatedQuantities[product.id],
          rating: product.rating
        });
      }
      
      saveCartToSessionStorage(currentCart);
      updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0));
      return updatedQuantities;
    });
  };

  // Function to decrease product quantity
  const handleDecrease = (product: Product) => {
    setCartQuantities((prevQuantities) => {
      if ((prevQuantities[product.id] || 0) > 1) {
        const updatedQuantities = { 
          ...prevQuantities, 
          [product.id]: (prevQuantities[product.id] || 0) - 1 
        };
        
        // Update cart in sessionStorage
        const currentCart = getCartFromSessionStorage();
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          currentCart[existingItemIndex].quantity = updatedQuantities[product.id];
          saveCartToSessionStorage(currentCart);
        }
        
        updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0));
        return updatedQuantities;
      } else {
        // If quantity reaches 0, remove the item from cart
        const updatedQuantities = { ...prevQuantities };
        delete updatedQuantities[product.id];
        
        // Remove item from sessionStorage
        const currentCart = getCartFromSessionStorage();
        const filteredCart = currentCart.filter(item => item.id !== product.id);
        saveCartToSessionStorage(filteredCart);
        
        // Reset addedToCart to false to show the "Add to Cart" button again
        setAddedToCart((prev) => ({
          ...prev,
          [product.id]: false,
        }));
        
        updateCartCount(Object.values(updatedQuantities).reduce((acc, curr) => acc + curr, 0));
        return updatedQuantities;
      }
    });
  };

  // Function to handle the "Add to Cart" button click
  const handleAddToCart = (product: Product) => {
    // Mark the product as added to cart
    setAddedToCart((prev) => ({
      ...prev,
      [product.id]: true,
    }));

    // Initialize the cart quantity for that product
    setCartQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: (prevQuantities[product.id] || 0) + 1,
    }));
    
    // Get current cart items from sessionStorage
    const currentCart = getCartFromSessionStorage();
    
    // Check if product already exists in cart
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
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
    
    // Update the cart count
    const newTotalCount = currentCart.reduce((acc, item) => acc + item.quantity, 0);
    updateCartCount(newTotalCount);
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
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="cart-quantity-container">
                  <button 
                    onClick={() => handleDecrease(product)} 
                    className="cart-action-btn"
                  >
                    -
                  </button>
                  <span className="cart-quantity">{cartQuantities[product.id] || 0}</span>
                  <button 
                    onClick={() => handleIncrease(product)} 
                    className="cart-action-btn"
                  >
                    +
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