import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import FetchWithAuth from "./Auth/FetchWithAuth";
import Newsletter from "./Newsletter";
import ProfileIcon from "./ProfileIcon";
import ViewCartIcon from "./ViewCartIcon";
import LoginIconButton from "./LoginIcon";
import AdminButtonIcon from "./AdminButtonIcon";
import FiltersIcon from "./AdvancedFilterButton";
import { Snackbar, Alert, TextField, InputAdornment, IconButton, Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Slider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowBackIosNew as ArrowBackIcon, ArrowForwardIos as ArrowForwardIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const accessToken = localStorage.getItem('accessToken');
const API_URL = process.env.REACT_APP_URL;

const PRODUCTS_PER_PAGE = 8;

function Home() {
    const [products, setProducts] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [noProductsFoundError, setNoProductsFoundError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productToSearch, setProductToSearch] = useState('');
    const [noProductSearchError, setNoProductSearchError] = useState('');
    const [foundProduct, setFoundProduct] = useState([]);
    const [newsletterVisible, setNewsletterVisible] = useState(false);
    const [alphabeticalOrder, setAlphabeticalOrder] = useState(false);
    const [sortByPriceAsc, setSortByPriceAsc] = useState(false);
    const [sortByPriceDesc, setSortByPriceDesc] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const fetchProductsByPriceRange = async () => {
        try {
            const response = await fetch(`${API_URL}/searchbypricerange/${minPrice}/${maxPrice}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data.products);
                setTotalPages(Math.ceil(data.products.length / PRODUCTS_PER_PAGE));
            } else {
                console.log('error fetching products');
            }
        } catch (error) {
            setGeneralError(`Fetch error: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchProductsByPriceRange();
    }, [minPrice, maxPrice]);

    const handlePriceChange = (type, value) => {
        if (type === 'min') {
            setMinPrice(value);
        } else if (type === 'max') {
            setMaxPrice(value);
        }
    };

    const handleIncreaseQuantity = (productId) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const handleDecreaseQuantity = (productId) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 1) - 1)
        }));
    };

    const handleAddToServerCart = async (productId, quantity) => {
        if (!accessToken) {
            toast.error('You need to be logged in to add items to the cart');
            return;
        }

        try {
            const response = await FetchWithAuth(`${API_URL}/user/add-to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to add product to cart. ' + errorText);
            }

            setSnackbarMessage('Product added to cart successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            setNewsletterVisible(true);
        } else {
            setNewsletterVisible(false);
        }
    }, []);

    const handleSortByPriceAsc = () => {
        setSortByPriceAsc(!sortByPriceAsc);
        setSortByPriceDesc(false);
        setAlphabeticalOrder(false);
    };

    const handleSortByPriceDesc = () => {
        setSortByPriceDesc(!sortByPriceDesc);
        setSortByPriceAsc(false);
        setAlphabeticalOrder(false);
    };

    const handleFilter = async (filterUrl) => {
        try {
            const response = await fetch(`${API_URL}${filterUrl}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`${API_URL}/search/product/${productToSearch}`);
            if (response.status === 404) {
                setNoProductSearchError(`No existe producto con el nombre: ${productToSearch}`);
                setGeneralError('');
                setNoProductsFoundError('');
                return;
            }

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                setNoProductSearchError('');
                setNoProductsFoundError('');
                return;
            }

            const data = await response.json();
            setFoundProduct(data);

            const productId = data.products[0].id;
            window.location.href = `/detail/${productId}`;
        } catch (error) {
            setGeneralError('Ha ocurrido un error');
        }
    };

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                let apiUrl = `${API_URL}/allproducts`;
                if (alphabeticalOrder) {
                    apiUrl = `${API_URL}/products/alphorder`;
                } else if (sortByPriceAsc) {
                    apiUrl = `${API_URL}/searchbyprice/asc`;
                } else if (sortByPriceDesc) {
                    apiUrl = `${API_URL}/searchbyprice/desc`;
                }

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    setGeneralError('Ha ocurrido un error');
                    return;
                }

                const data = await response.json();
                if (data.length === 0) {
                    setNoProductsFoundError('No hay productos disponibles, te notificaremos cuando los haya !');
                    setGeneralError('');
                    return;
                }

                // Pagination logic
                const paginatedProducts = paginate(data, PRODUCTS_PER_PAGE);
                setProducts(paginatedProducts[currentPage - 1] || []);
                setTotalPages(paginatedProducts.length);
                setGeneralError('');
                setNoProductsFoundError('');
            } catch (error) {
                setGeneralError('Ha ocurrido un error.');
            }
        };

        fetchAllProducts();
    }, [currentPage, alphabeticalOrder, sortByPriceDesc, sortByPriceAsc]);

    const paginate = (array, pageSize) => {
        return array.reduce((acc, item, index) => {
            const pageIndex = Math.floor(index / pageSize);
            if (!acc[pageIndex]) {
                acc[pageIndex] = [];
            }
            acc[pageIndex].push(item);
            return acc;
        }, []);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <Container className="Home" maxWidth="lg">
            <ToastContainer />

            <TextField
                fullWidth
                type="text"
                placeholder="Search product"
                value={productToSearch}
                onChange={(e) => setProductToSearch(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                variant="outlined"
                margin="normal"
            />
            {noProductSearchError && <Typography color="error">{noProductSearchError}</Typography>}
            {foundProduct.length > 0 && (
                <Card className="found-product" variant="outlined">
                    <CardContent>
                        <Typography variant="h5">{foundProduct[0].product}</Typography>
                        <Typography>{foundProduct[0].description}</Typography>
                    </CardContent>
                </Card>
            )}

            <ProfileIcon />
            <ViewCartIcon />
            <LoginIconButton />
            <AdminButtonIcon />

            <Typography variant="h6" gutterBottom>
                Filter by Price
            </Typography>
            <Slider
                value={[minPrice, maxPrice]}
                onChange={(e, newValue) => {
                    handlePriceChange('min', newValue[0]);
                    handlePriceChange('max', newValue[1]);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
            />
            <Typography gutterBottom>
                Price Range: ${minPrice} - ${maxPrice}
            </Typography>

           

            <div className="toggle-button">
                <Button variant="contained" onClick={() => setAlphabeticalOrder(!alphabeticalOrder)}>
                    {alphabeticalOrder ? 'Normal Order' : 'Sort Alphabetically'}
                </Button>
                <Button variant="contained" onClick={handleSortByPriceAsc}>
                    {sortByPriceAsc ? 'Normal Order' : 'Sort by Price Ascending'}
                </Button>
                <Button variant="contained" onClick={handleSortByPriceDesc}>
                    {sortByPriceDesc ? 'Normal Order' : 'Sort by Price Descending'}
                </Button>
            </div>
            <br/>

            <Grid container spacing={3} className="products-container">
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card className="product-item">
                            <Link to={`/detail/${product.id}`} className="product-link">
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={product.image}
                                    alt={product.product}
                                />
                                <CardContent>
                                    <Typography variant="h6">{product.product}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        ${product.price}
                                    </Typography>
                                    <Typography variant="body2">
                                        Stock: {product.stock === 0 ? 'Out of Stock' : product.stock}
                                    </Typography>
                                </CardContent>
                            </Link>
                            <CardActions>
                                <div className="quantity-selector">
                                    <Button onClick={(e) => {
                                        e.stopPropagation(); // Stop click from propagating to any parent elements
                                        handleDecreaseQuantity(product.id);
                                    }}>-</Button>
                                    <Typography>{quantities[product.id] || 1}</Typography>
                                    <Button onClick={(e) => {
                                        e.stopPropagation(); // Stop click from propagating to any parent elements
                                        handleIncreaseQuantity(product.id);
                                    }}>+</Button>
                                </div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => {
                                        e.preventDefault();  // bug reparado
                                        e.stopPropagation(); // bug reparado
                                        handleAddToServerCart(product.id, quantities[product.id] || 1);
                                    }}
                                >
                                    Add to cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <div className="pagination">
                <IconButton 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    aria-label="previous page"
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography>{currentPage} / {totalPages}</Typography>
                <IconButton 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    aria-label="next page"
                >
                    <ArrowForwardIcon />
                </IconButton>
            </div>

            {generalError && <Typography color="error">{generalError}</Typography>}
            {noProductsFoundError && <Typography color="primary">{noProductsFoundError}</Typography>}
            <br />
            {newsletterVisible && <Newsletter />}
        </Container>
    );
}

export default Home;
