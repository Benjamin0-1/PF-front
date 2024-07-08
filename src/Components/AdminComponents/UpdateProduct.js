import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import { Container, TextField, Button, Typography, CircularProgress, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function UpdateProduct() {
    const [productId, setProductId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [productName, setProductName] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (!productId) {
            return;
        }

        const fetchProductDetail = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/product-detail/${productId}`);

                if (response.status === 404) {
                    toast.error('Product not found');
                    setIsLoading(false);
                    return;
                }

                if (!response.ok) {
                    toast.error('Failed to fetch product details');
                    setIsLoading(false);
                    return;
                }

                const productData = await response.json();
                setBrandId(productData.brandId);
                setProductName(productData.product);
                setStock(productData.stock);
                setPrice(productData.price);
                setDescription(productData.description);
                setIsLoading(false);

            } catch (error) {
                toast.error(`ERROR: ${error.message}`);
                setIsLoading(false);
            }
        };

        fetchProductDetail();

    }, [productId]);

    const handleUpdate = async () => {
        const numberRegex = /^[0-9]+$/;
        const descriptionLengthRegex = /^.{10,}$/;

        if (!numberRegex.test(brandId)) {
            toast.error('Brand ID must be a number.');
            return;
        }
        if (productName.length < 3) {
            toast.error('Product name must be at least 3 characters long.');
            return;
        }
        if (!numberRegex.test(stock)) {
            toast.error('Stock must be a number.');
            return;
        }
        if (!/^\d+(\.\d{1,2})?$/.test(price)) {
            toast.error('Price must be a number.');
            return;
        }
        if (!descriptionLengthRegex.test(description)) {
            toast.error('Description must be at least 10 characters long.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/update-product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    brandId,
                    product: productName,
                    stock,
                    price,
                    description
                })
            });

            if (response.status === 404) {
                toast.error(`The product with id: ${productId} does not exist`);
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || 'An error occurred');
                setIsLoading(false);
                return;
            }

            toast.success('Product updated successfully');
            setIsLoading(false);
        } catch (error) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="UpdateProduct">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Update Product
                </Typography>
                <TextField
                    fullWidth
                    label="Product ID to update"
                    variant="outlined"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Brand ID"
                    variant="outlined"
                    value={brandId}
                    placeholder="Previous Brand ID"
                    onChange={(e) => setBrandId(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Product Name"
                    variant="outlined"
                    value={productName}
                    placeholder="Previous Product Name"
                    onChange={(e) => setProductName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Stock"
                    variant="outlined"
                    value={stock}
                    placeholder="Previous Stock"
                    onChange={(e) => setStock(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Price"
                    variant="outlined"
                    value={price}
                    placeholder="Previous Price"
                    onChange={(e) => setPrice(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={description}
                    placeholder="Previous Description"
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={4}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Update Product'}
                </Button>
            </Box>
            <Box sx={{ mt: 4 }}>
                <AdminNavBar />
            </Box>
            <ToastContainer />
        </Container>
    );
}

export default UpdateProduct;
