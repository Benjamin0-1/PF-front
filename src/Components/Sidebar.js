import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);

    const toggleSidebar = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`Sidebar ${expanded ? 'expanded' : ''}`}>
            <div className="toggle-button" onClick={toggleSidebar}>
                {expanded ? '<' : '>'}
            </div>
            {expanded && (
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/buy">Buy a product</Link>
                    </li>
                    <li>
                        <Link to="/viewprofile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/security">Security</Link>
                    </li>
                    <li>
                        <Link to="/favorites">Favorites</Link>
                    </li>
                    <li>
                        <Link to="/faq">FAQS</Link>
                    </li>
                    <li>
                        <Link to="/favorites">Favorites</Link>
                    </li>
                    <li>
                        <Link to="/shipping">Shipping</Link>
                    </li>

                    <li>
                        <Link to="/orders">Orders</Link>
                    </li>
                    <li>
                        <Link to="/paymenthistory">Payment History</Link>
                    </li>
                    
                    {/* Add more links as needed */}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
