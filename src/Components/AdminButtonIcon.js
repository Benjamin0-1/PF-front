import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Material UI admin icon
import { useNavigate } from 'react-router-dom';

function AdminButtonIcon() {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIsAdmin = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    const response = await fetch('http://localhost:3001/profile-info', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    const data = await response.json();
                    if (data.is_admin) {
                        setIsAdmin(true);
                    } else {
                        navigate('/notadmin');
                    }
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }
        };

        checkIsAdmin();
    }, [navigate]);

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
