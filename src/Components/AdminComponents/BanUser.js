import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import { Container, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function BanUser() {
    const [banDurationHours, setBanDurationHours] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [userToBanDetails, setUserToBanDetails] = useState(null);

    useEffect(() => {
        if (!accessToken) {
            window.location.href = '/login';
        }

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

    const fetchUserDetails = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/user-details/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                toast.error(`User with id: ${userId} does not exist`);
                setUserToBanDetails(null);
                return;
            }

            if (!response.ok) {
                toast.error(`Error fetching user details: ${response.status}`);
                setUserToBanDetails(null);
                return;
            }

            const data = await response.json();
            setUserToBanDetails(data);

        } catch (error) {
            toast.error(`Error: ${error.message}`);
            setUserToBanDetails(null);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleBan = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/ban/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ banDurationHours })
            });

            if (response.headers.get('content-type')?.includes('application/json')) {
                const data = await response.json();

                if (data.invalidBan) {
                    toast.error('You cannot ban another admin or yourself');
                    setIsLoading(false);
                    return;
                }

                if (response.status === 404) {
                    toast.error(`User with id: ${userId} does not exist`);
                    setIsLoading(false);
                    return;
                }
            } else {
                throw new Error('Invalid response format');
            }

            if (!response.ok) {
                toast.error('An error occurred while banning the user');
                setIsLoading(false);
                return;
            }

            toast.success(`User banned successfully for ${banDurationHours} hours`);
            setBanDurationHours('');
            setUserId('');
            setUserToBanDetails(null);

        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="BanUser">
            <AdminNavBar />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Ban User
                </Typography>
                <form onSubmit={handleBan}>
                    <TextField
                        fullWidth
                        label="User ID"
                        variant="outlined"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Ban Duration (hours)"
                        variant="outlined"
                        value={banDurationHours}
                        onChange={(e) => setBanDurationHours(e.target.value)}
                        margin="normal"
                    />
                    {userToBanDetails && (
                        <Box className="user-details" sx={{ mt: 2 }}>
                            <Typography variant="h6" component="h3">
                                User Details
                            </Typography>
                            <Typography>ID: {userToBanDetails.id}</Typography>
                            <Typography>Name: {userToBanDetails.username}</Typography>
                            <Typography>Email: {userToBanDetails.email}</Typography>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Ban User'}
                    </Button>
                </form>
            </Box>
            <ToastContainer />
        </Container>
    );
}

export default BanUser;
