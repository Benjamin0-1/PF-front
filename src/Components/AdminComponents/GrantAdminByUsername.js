import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminDashboard from "./AdminDashboard";
import ProfileIcon from "../ProfileIcon";
import { Container, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function GrantAdminByUsername() {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!accessToken) {
        window.location.href = '/login';
    }

    useEffect(() => {
        const checkIsAdmin = async () => {
            try {
                const response = await FetchWithAuth(`${API_URL}/profile-info`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                if (!data.is_admin) {
                    window.location.href = '/notadmin';
                }
            } catch (error) {
                toast.error(`Error: ${error.message}`);
            }
        };

        checkIsAdmin();
    }, [accessToken]);

    const handleCreateAdmin = async () => {
        if (!username) {
            toast.error('Username is required');
            return;
        }

        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/grant-admin-by-username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (data.userNotFound) {
                toast.error(`User: ${username} does not exist`);
                return;
            }

            if (data.isUserAdmin) {
                toast.error(`User ${username} is already an admin`);
                return;
            }

            toast.success(`User ${username} has been granted admin role successfully`);
            setUsername('');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="GrantAdminByUsername">
            <ProfileIcon />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Grant Admin by Username
                </Typography>
                <TextField
                    fullWidth
                    label="Enter username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateAdmin}
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Grant Admin'}
                </Button>
                {isLoading && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Loading...
                    </Typography>
                )}
            </Box>
            <AdminDashboard />
            <ToastContainer />
        </Container>
    );
}

export default GrantAdminByUsername;
