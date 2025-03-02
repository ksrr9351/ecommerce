import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySelector from './components/CategorySelector';
import CollectionHighlight from './components/CollectionHighlight';
import FeaturedProducts from './components/FeaturedProducts';
import LimitedOffer from './components/LimitedOffer';
import NewArrivals from './components/NewArrivals';
import PopularItems from './components/PopularItems';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';
import './App.css';

const App: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  // Initialize cart count from sessionStorage on app mount
  useEffect(() => {
    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCartCount(existingCart.length);
  }, []);

  // Function to update the cart count
  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        
        <Route
          path="/"
          element={
            <>
              <Hero />
              <CategorySelector />
              <CollectionHighlight />
              <FeaturedProducts updateCartCount={updateCartCount} />
              <LimitedOffer updateCartCount={updateCartCount} />
              <div className="two-column-section">
                <NewArrivals updateCartCount={updateCartCount} />
                <PopularItems updateCartCount={updateCartCount} />
              </div>
            </>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;