import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <span className="offer-text">50% Off Limited Offer</span>
          <h1 className="hero-title">Summer Collection</h1>
          <button className="shop-now-button">
            Shop Now <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;