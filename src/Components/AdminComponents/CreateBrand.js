import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import ProfileIcon from "../ProfileIcon";
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function CreateBrand() {
    const [brandName, setBrandName] = useState('');

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

    const handleCreation = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/brand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ brandName })
            });

            const data = await response.json();
            if (data.brandAlreadyExists) {
                toast.error('Brand already exists')
                return
            }

            if (!response.ok) {
                toast.error('An error occurred while creating the brand');
                return;
            }

            toast.success(`Brand ${brandName} created successfully`);
            setBrandName('');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleChange = (e) => {
        setBrandName(e.target.value);
    };

    return (
        <Container maxWidth="sm" className="create-brand-container">
            <ProfileIcon />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Create Brand
                </Typography>
                <TextField
                    fullWidth
                    label="Brand Name"
                    variant="outlined"
                    value={brandName}
                    onChange={handleChange}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreation}
                    sx={{ mt: 2 }}
                >
                    Create Brand
                </Button>
            </Box>
            <Box sx={{ mt: 4 }}>
                <AdminNavBar />
            </Box>
            <ToastContainer />
        </Container>
    );
}

export default CreateBrand;
