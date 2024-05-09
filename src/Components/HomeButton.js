import React from "react";
import { IconButton, Tooltip, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Importing Home icon

const StyledIconButton = styled(IconButton)({
    padding: '10px 20px',
    backgroundImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    border: 'none',
    borderRadius: '30px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    position: 'fixed',
    bottom: '20px',
    right: '60px', // Adjusted positioning for better accessibility
    '&:hover': {
        backgroundImage: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(0)',
    },
    '&:focus': {
        outline: '2px solid #fff',
        outlineOffset: '2px',
    },
    '@media (max-width: 768px)': {
        padding: '8px 16px',
        fontSize: '14px',
        bottom: '10px',
        right: '50px',
    },
    '@media (max-width: 480px)': {
        width: '90%',
        maxWidth: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '15px', 
    }
});

function HomeButton() {
    const handleHome = () => {
        window.location.href = '/home'; 
    };

    return (
        <Tooltip title="Home">
            <StyledIconButton onClick={handleHome}>
                <HomeIcon />
            </StyledIconButton>
        </Tooltip>
    );
}

export default HomeButton;
