import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom'; // This is for navigation in React Router v6

function ProfileIcon() {
    const [showProfileButton, setShowProfileButton] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setShowProfileButton(!!accessToken);
    }, []);

    return (
        <div>
            {showProfileButton && (
                <IconButton
                    onClick={() => navigate('/viewprofile')} // Using navigate instead of window.location for better SPA behavior
                    color="primary"
                    aria-label="view profile"
                    size="large"
                >
                    <AccountCircleIcon style={{ fontSize: 40 }} />
                </IconButton>
            )}
        </div>
    );
}

export default ProfileIcon;
