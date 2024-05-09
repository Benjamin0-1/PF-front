import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Material UI admin icon
import { useNavigate } from 'react-router-dom';

function AdminButtonIcon() {
    const [isAdmin, setIsAdmin] = useState(true);
    const navigate = useNavigate();

   

    const handleClick = () => {
        navigate('/admin');
    };

    return (
        <div>
            {isAdmin && (
                <IconButton
                    onClick={handleClick}
                    color="primary"
                    aria-label="admin dashboard"
                    size="large"
                >
                    <AdminPanelSettingsIcon style={{ fontSize: 40 }} />
                </IconButton>
            )}
        </div>
    );
}

export default AdminButtonIcon;
