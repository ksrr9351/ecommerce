import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCreditCard, faLock, faHeadphones } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="service-features">
        <div className="feature">
          <FontAwesomeIcon icon={faTruck} className="feature-icon" />
          <div className="feature-text">
            <h4>Free Delivery</h4>
            <p>Orders $50 or more</p>
          </div>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faCreditCard} className="feature-icon" />
          <div className="feature-text">
            <h4>Payment Method</h4>
            <p>100% secure payment</p>
          </div>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faLock} className="feature-icon" />
          <div className="feature-text">
            <h4>Warranty</h4>
            <p>30 days money back</p>
          </div>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faHeadphones} className="feature-icon" />
          <div className="feature-text">
            <h4>Customer Support</h4>
            <p>24/7 dedicated support</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand">
          <div className="logo">
            {/* <img src="/logo.svg" alt="demo wocommerce" /> */}
            <span>Demo Wocommerce</span>
          </div>
          <p className="brand-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          <div className="contact-info">
            <p className="phone">+12345678900</p>
            <p className="email">info@example.com</p>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="links-column">
            <h4>Product Links</h4>
            <ul>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/new-arrival">New Arrival</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/collections">Collections</a></li>
            </ul>
          </div>
          
          <div className="links-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="newsletter">
            <h4>Join our Newsletter</h4>
            <p>Drop your email below to get update, promotions, coupons, and more!</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">→</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="copyright">
        <p>Copyright © 2025. Elliye All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
