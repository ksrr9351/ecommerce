import React, { useEffect, useState } from 'react';
import { Product } from '../models/Product';

interface NewArrivalsProps {
  updateCartCount: (count: number) => void;
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ updateCartCount }) => {
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
        // Filter products that are 'New Arrivals' (you can modify the filter condition as needed)
        const newArrivals = data.filter((product: Product) => product.category === "men's clothing"); // Adjust category as needed
        setProducts(newArrivals);

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
        console.error('Error loading new arrivals:', error);
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
    // If the product is already in the cart, we just update the quantity
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
          rating: product.rating
        });
      }

      // Save updated cart to sessionStorage
      saveCartToSessionStorage(currentCart);

      // Update cart count
      updateCartCount(Object.values(newQuantities).reduce((sum, val) => sum + val, 0));

      return newQuantities;
    });

    // Mark the product as added to cart
    setAddedToCart((prev) => ({
      ...prev,
      [product.id]: true,
    }));
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
    <section className="new-arrivals">
      <div className="section-header">
        <h2 className="section-title">New Arrival</h2>
        <a href="/view-all" className="view-all">View all →</a>
      </div>

      <div className="arrivals-grid">
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
    </section>
  );
};

export default NewArrivals;
