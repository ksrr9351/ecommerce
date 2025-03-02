import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySelector from './components/CategorySelector';
import CollectionHighlight from './components/CollectionHighlight';
import FeaturedProducts from './components/FeaturedProducts';
import LimitedOffer from './components/LimitedOffer';
import NewArrivals from './components/NewArrivals';
import PopularItems from './components/PopularItems';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart'; // Import ShoppingCart
import './App.css';

const App: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);  // State for the cart count

  // Function to update the cart count
  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  return (
    <div className="app">
      <Navbar cartCount={cartCount} /> {/* Pass cartCount to Navbar */}

      <Routes>
        {/* Define the route for the ShoppingCart page */}
        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        
        {/* Default route to show homepage components */}
        <Route
          path="/"
          element={
            <>
              {/* Only these components will be shown on the homepage */}
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

      {/* Footer will be present on all pages */}
      <Footer />
    </div>
  );
};

export default App;
