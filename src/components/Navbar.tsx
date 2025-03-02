import React, { useState } from 'react';
// Importing FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faNewspaper, faStar, faBox, faTag, faSearch, faShoppingCart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // assuming you are using react-router for navigation

interface NavbarProps {
    cartCount: number;  // Accept cartCount as a prop
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // For navigating to the shopping cart page

    const handleCartClick = () => {
        navigate('/ShoppingCart'); // Navigate to the shopping cart when the cart icon is clicked
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <a href="/">
                        {/* <img src="/logo.svg" alt="Elliye" /> */}
                        <span>DemoWocommerce</span>
                    </a>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button">
                        {/* Using FontAwesome search icon */}
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </button>
                </div>
                <div className="nav-actions">
                    <button className="cart-button" onClick={handleCartClick}>
                        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Show cart count */}
                    </button>
                    <button className="notification-button">
                        {/* Using FontAwesome envelope icon for notifications */}
                        <FontAwesomeIcon icon={faEnvelope} className="notification-icon" />
                    </button>
                    <button className="login-button">Login</button>
                </div>
            </div>

            <nav className="categories">
                <ul>
                    <li><a href="/categories"><FontAwesomeIcon icon={faThLarge} /> Categories</a></li>
                    <li><a href="/new-arrival"><FontAwesomeIcon icon={faNewspaper} /> New Arrival</a></li>
                    <li><a href="/features"><FontAwesomeIcon icon={faStar} /> Features</a></li>
                    <li><a href="/collections"><FontAwesomeIcon icon={faBox} /> Collections</a></li>
                    <li><a href="/discount"><FontAwesomeIcon icon={faTag} /> Discount</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
