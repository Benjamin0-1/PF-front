import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

function ViewCartIcon() {
    const [isViewCartVisible, setIsViewCartVisible] = useState(false); // Visibility based on accessToken
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setIsViewCartVisible(!!accessToken); // Set visibility based on the presence of accessToken
    }, []);

    const handleClick = () => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login'); // Redirects to login page if not logged in
        } else {
            navigate('/viewcart'); // Redirects to the cart page if logged in
        }
    };

    return (
        <div>
            {isViewCartVisible && (
                <IconButton
                    onClick={handleClick}
                    color="primary"
                    aria-label="view cart"
                    size="large"
                >
                    <ShoppingCartIcon style={{ fontSize: 40 }} />
                </IconButton>
            )}
        </div>
    );
}

export default ViewCartIcon;
