import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import { Container, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function DeleteProductById() {
    const [productId, setProductId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productDetails, setProductDetails] = useState(null);

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

    const fetchProductDetails = async (id) => {
        try {
            const response = await FetchWithAuth(`${API_URL}/product-detail/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                toast.error(`Product with ID: ${id} not found`);
                setProductDetails(null);
                return;
            }

            if (!response.ok) {
                toast.error('An error occurred while fetching product details');
                setProductDetails(null);
                return;
            }

            const data = await response.json();
            setProductDetails(data);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
            setProductDetails(null);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductDetails(productId);
        }
    }, [productId]);

    const handleDelete = async () => {
        if (!productId) {
            toast.error('You must enter a product ID to delete');
            return;
        }

        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                toast.error(`No product found with ID: ${productId}`);
                return;
            }

            if (!response.ok) {
                toast.error('An error occurred while deleting the product');
                return;
            }

            toast.success(`Product with ID: ${productId} deleted successfully`);
            setProductId('');
            setProductDetails(null);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="DeleteProductById">
            <AdminNavBar />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Delete Product by ID
                </Typography>
                <TextField
                    fullWidth
                    label="Enter Product ID"
                    type="number"
                    variant="outlined"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDelete}
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
                {isLoading && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Deleting product...
                    </Typography>
                )}
                {productDetails && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" component="h3">
                            Product Details
                        </Typography>
                        <Typography>ID: {productDetails.id}</Typography>
                        <Typography>Name: {productDetails.name}</Typography>
                        <Typography>Price: {productDetails.price}</Typography>
                        <Typography>Description: {productDetails.description}</Typography>
                        {/* Add more product details as needed */}
                    </Box>
                )}
            </Box>
            <ToastContainer />
        </Container>
    );
}

export default DeleteProductById;
