import React from "react";
import { Link } from 'react-router-dom';
import './AdminNavBar.css'; 
function AdminNavBar() {
    return (
        <div className="admin-nav-bar">
            <Link to='/deleteuserbyemail' className="nav-link">Delete User by Email</Link>
            <Link to='/deleteuserbyid' className="nav-link">Delete user by id</Link>
            <Link to='/deleteuserbyusername' className="nav-link">Delete user by username</Link>
            <Link to='/createproduct' className="nav-link">Create a product</Link>
            <Link to='/updateproduct' className="nav-link">Update a product</Link>
            <Link to='/sendmassiveeamil' className="nav-link">Email all users</Link>
            <Link to='/allusers' className="nav-link">See all users</Link>
            <Link to='/createbrand' className="nav-link">Add a new brand</Link>
            <Link to='/banuser' className="nav-link">Ban a User</Link>
            <Link to='/deletedusers' className="nav-link">See deleted users</Link>
            <Link to='/createuser' className="nav-link">Create a User</Link>
            <Link to='/deleteproductbyid' className="nav-link"> Delete product by ID  </Link>
            <Link to='/emailnewsletter' className="nav-link">Email newsletter users</Link>


            
        </div>

    );
}

export default AdminNavBar;
