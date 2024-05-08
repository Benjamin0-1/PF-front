import React from "react";
import logOutbuttonstyles from './module.Logout.css';

function Logout() {

    const handleLogout = () => {
            
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/login'
    };
    

    return (
        <button className="Logout" onClick={handleLogout}>Logout</button>

    )

};



export default Logout;
