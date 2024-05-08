import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FetchWithAuth from "./Auth/FetchWithAuth";
import homeStyles from './module.Home.css';
import Newsletter from "./Newsletter";  // <-- newsletter.
import Filter from "./Filter";

const accessToken = localStorage.getItem('accessToken');


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
    const [quantities, setQuantities] = useState({}); // quantity of the specific product.


    const [successMessages, setSuccessMessages] = useState({});

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
            [productId]: Math.max(0, (prev[productId] || 1) - 1)  // Ensure quantity doesn't go below 0
        }));
    };

    const handleAddToServerCart = async (productId, quantity) => {
   //     e.preventDefault();   // Prevent form submission or link navigation
   //     e.stopPropagation();  // Stop the event from bubbling up to parent elements
    
        try {
            const response = await FetchWithAuth(`http://localhost:3001/user/add-to-cart`, {
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
            const response = await fetch(`http://localhost:3001${filterUrl}`);
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
            
            const response = await fetch(`http://localhost:3001/search/product/${productToSearch}`);


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
                let apiUrl = 'http://localhost:3001/allproducts';
                if (alphabeticalOrder) {
                    apiUrl = 'http://localhost:3001/products/alphorder';
                } else if (sortByPriceAsc) {
                    apiUrl = 'http://localhost:3001/searchbyprice/asc';
                } else if (sortByPriceDesc) {
                    apiUrl = 'http://localhost:3001/searchbyprice/desc';
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
    
    
    
    
    
    // Pagination function remains unchanged
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

    
    


    return (
        <div className="Home">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search product"
                    value={productToSearch}
                    onChange={(e) => setProductToSearch(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                {noProductSearchError && <p style={{ color: 'red' }}>{noProductSearchError}</p>}
                {foundProduct.length > 0 && (
                    <div className="found-product">
                        <h2>{foundProduct[0].product}</h2>
                        <p>{foundProduct[0].description}</p>
                    </div>
                )}
            </div>

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


            {/* Render the Filter component */}
            <Filter handleFilter={handleFilter} />

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
                e.preventDefault();  // Prevent the Link navigation
                e.stopPropagation(); // Stop propagation to prevent link navigation
                handleAddToServerCart(product.id, quantities[product.id] || 1, e);
            }}>
                Add to Server Cart
            </button>
        </div>
    ))}
</div>


            <div className="pagination">
                <button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
            </div>

            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {noProductsFoundError && <p style={{ color: 'blue' }}>{noProductsFoundError}</p>}
            <br />
            {newsletterVisible && <Newsletter />}
        </div>
    );    

    
};


export default Home;
