import React, { useState } from "react";
import { Link } from 'react-router-dom';
import adminNar from './module.AdminNavBar.css';

function AdminNavBar() {
    const [isOpen, setIsOpen] = useState(true);  // State to manage the sidebar visibility

    const toggleSidebar = () => {
        setIsOpen(!isOpen);  // Toggle the state to show/hide the sidebar
    };

    return (
        <div className={`admin-nav-bar ${isOpen ? 'open' : ''}`}>
            <button onClick={toggleSidebar} className="admin-sidebar-toggle-button">
              { /* {isOpen ? 'Close' : 'Menu'} */ }
            </button>
            {isOpen && (
                <div>
                    <Link to='/visualchart' className="admin-navbar-nav-link">Visual Chart</Link>
                    
                    <Link to='/deleteuserbyemail' className="admin-navbar-nav-link">Delete User by Email</Link>

                    <Link to='/deleteuserbyid' className="admin-navbar-nav-link">Delete User by ID</Link>
                    <Link to='/deleteuserbyusername' className="admin-navbar-nav-link">Delete User by Username</Link>
                    <Link to='/createproduct' className="admin-navbar-nav-link">Create a Product</Link>
                    <Link to='/updateproduct' className="admin-navbar-nav-link">Update a Product</Link>
                    <Link to='/sendmassiveeamil' className="admin-navbar-nav-link">Email All Users</Link>
                    <Link to='/allusers' className="admin-navbar-nav-link">See All Users</Link>
                    <Link to='/createbrand' className="admin-navbar-nav-link">Add a New Brand</Link>
                    <Link to='/banuser' className="admin-navbar-nav-link">Ban a User</Link>
                    <Link to='/deletedusers' className="admin-navbar-nav-link">See Deleted Users</Link>
                    <Link to='/createuser' className="admin-navbar-nav-link">Create a User</Link>
                    <Link to='/deleteproductbyid' className="admin-navbar-nav-link">Delete Product by ID</Link>
                    <Link to='/reportedproducts' className="admin-navbar-nav-link">See All Reported Products</Link>
                    <Link to='/emailnewsletter' className="admin-navbar-nav-link">Email Newsletter Users</Link>
                    <Link to='/allpendingorders' className="admin-navbar-nav-link">All Pending Orders</Link>
                    <Link to='/grantadminbyusername' className="admin-navbar-nav-link">Grant Admin</Link>
                </div>
            )}
        </div>
    );
}

export default AdminNavBar;
