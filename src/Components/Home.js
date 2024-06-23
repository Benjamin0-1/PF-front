import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FetchWithAuth from "./Auth/FetchWithAuth";
import homeStyles from './module.Home.css';
import Newsletter from "./Newsletter";  // <-- newsletter.
import ProfileIcon from "./ProfileIcon";
import ViewCartIcon from "./ViewCartIcon";
import LoginIconButton from "./LoginIcon";
import AdminButtonIcon from "./AdminButtonIcon";
import FiltersIcon from "./AdvancedFilterButton";

import { Snackbar, Alert } from '@mui/material';
import { IconButton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { ArrowBackIosNew as ArrowBackIcon, ArrowForwardIos as ArrowForwardIcon } from '@mui/icons-material'; // paginado

const accessToken = localStorage.getItem('accessToken');
const API_URL = process.env.REACT_APP_URL

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
    const [quantities, setQuantities] = useState({}); // 
    const [category, setCategory] = useState('');
    const [successMessages, setSuccessMessages] = useState({});
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000); 
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCategories, setShowCategories] = useState(false);
    const [productAddedToCart, setProductAddedToCart] = useState('');

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
            } else {
                //throw new Error(data.message || 'Error fetching products'); quitarlo de la PANTALLA
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


    

    // there should be a button to adjust the quantity to be added.
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
   //     e.preventDefault(); 
   //     e.stopPropagation();  
    
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

            setSnackbarMessage('Product added to cart successfully!'); // Set a success message
            setSnackbarOpen(true);  // Open the snackbar

            console.log('Product added to server cart with quantity:', quantity);
           
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


    // filters.
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
            };

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                setGeneralError('');
                setNoProductSearchError('');
                setNoProductsFoundError('');
                return
            };

            const data = await response.json();
            setFoundProduct(data);

            const productId = data.products[0].id;
            console.log(`Product id: ${productId}`);
            window.location.href = `/detail/${productId}`


        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('ha ocurrido un error');
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
                const paginatedProducts = paginate(data, 8); // productos por pagina
                setProducts(paginatedProducts[currentPage - 1] || []);
                setTotalPages(paginatedProducts.length);
                setGeneralError('');
                setNoProductsFoundError('');
        
            } catch (error) {
                console.log(`Error: ${error}`);
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
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    // get all categories that exist
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/all-category`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // select category by simply clicking on it.
    const handleCategorySelect = async (categoryName) => {
        setSelectedCategory(categoryName);
        const response = await fetch(`${API_URL}/category/${categoryName}`);
        const data = await response.json();
        if (response.ok) {
            setProducts(data);
        } else {
            console.error('Failed to fetch category products:', data.message);
            setGeneralError(data.message || 'Failed to load products for the selected category');
        }
    };
    
    const handleCategorySearch = async (e) => {
        e.preventDefault();
        try {
            const response = await FetchWithAuth(`${API_URL}/category/${category}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setGeneralError('Failed to fetch products');
        }
    };


    return (
        <div className="Home">

         
            <div className="Home">
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
                />
                {noProductSearchError && <p style={{ color: 'red' }}>{noProductSearchError}</p>}
                {foundProduct.length > 0 && (
                    <div className="found-product">
                        <h2>{foundProduct[0].product}</h2>
                        <p>{foundProduct[0].description}</p>
                    </div>
                )}
            </div>

            


            < ProfileIcon/>
            < ViewCartIcon/>
            < LoginIconButton/>
            < AdminButtonIcon/>





            <div className="price-filters">
                <input type="range" min="0" max="1000" value={minPrice} onChange={(e) => handlePriceChange('min', e.target.value)} />
                <input type="range" min="0" max="1000" value={maxPrice} onChange={(e) => handlePriceChange('max', e.target.value)} />
                <p>Price Range: ${minPrice} - ${maxPrice}</p>
            </div>

            < FiltersIcon/>

          

            <div className="toggle-button">
                    <button onClick={() => setAlphabeticalOrder(!alphabeticalOrder)}>
                        {alphabeticalOrder ? 'normal order' : 'Sort Alphabetically'}
                    </button>
                    <button onClick={handleSortByPriceAsc}>
                        {sortByPriceAsc ? 'normal order' : 'Sort by Price Ascending'}
                    </button>
                    <button onClick={handleSortByPriceDesc}>
                        {sortByPriceDesc ? 'normal order' : 'Sort by Price Descending'}
                    </button>
                </div>


           

            <div className="products-container">
    {products.map(product => (
        <div key={product.id} className="product-item">
            {/* Product Details */}
            <Link to={`/detail/${product.id}`} className="product-link">
                <div className="product">
                    <h3>{product.product}</h3>
                    <p>{product.description}</p>
                    <img src={product.image} alt={product.product} />
                    <p>Price: ${product.price}</p>
                    <p>Stock: {product.stock === 0 ? 'Out of Stock' : product.stock}</p>
                </div>
            </Link>



            {/* Quantity and Cart Buttons */}
            <div className="quantity-selector">
                <button onClick={(e) => {
                    e.stopPropagation(); // Stop click from propagating to any parent elements
                    handleDecreaseQuantity(product.id);
                }}>-</button>
                <span>{quantities[product.id] || 1}</span>
                <button onClick={(e) => {
                    e.stopPropagation(); // Stop click from propagating to any parent elements
                    handleIncreaseQuantity(product.id);
                }}>+</button>
            </div>


            <button onClick={(e) => {
                        e.preventDefault();  // bug reparado
                        e.stopPropagation(); // bug reparado
                        handleAddToServerCart(product.id, quantities[product.id] || 1);
                            }}>
                                Add to cart
                            </button>


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
</div>

    ))}
</div>


<div className="pagination">
                <IconButton 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    aria-label="previous page"
                >
                    <ArrowBackIcon />
                </IconButton>
                <span>{currentPage} / {totalPages}</span>
                <IconButton 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    aria-label="next page"
                >
                    <ArrowForwardIcon />
                </IconButton>
            </div>

            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {noProductsFoundError && <p style={{ color: 'blue' }}>{noProductsFoundError}</p>}
            <br />
            {newsletterVisible && <Newsletter />}
        </div>

    );    

    
};


export default Home;
