import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login'; // Material UI login icon
import { useNavigate } from 'react-router-dom';

function LoginIconButton() {
    const [isLoginIconVisible, setIsLoginIconVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if accessToken is present
        const accessToken = localStorage.getItem('accessToken');
        setIsLoginIconVisible(!accessToken); // Icon visible only if accessToken is not present
    }, []);

    const handleClick = () => {
        navigate('/login'); // Redirects to the login page
    };

    return (
        <div>
            {isLoginIconVisible && (
                <IconButton
                    onClick={handleClick}
                    color="primary"
                    aria-label="login"
                    size="large"
                >
                    <LoginIcon style={{ fontSize: 40 }} />
                </IconButton>
            )}
        </div>
    );
}

export default LoginIconButton;
