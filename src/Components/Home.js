import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FetchWithAuth from "./Auth/FetchWithAuth";
import './Home.css';

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
                const response = await fetch('http://localhost:3001/allproducts');
    
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
                const paginatedProducts = paginate(data, 8); // Assuming 5 products per page
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
    }, [currentPage]); // Add currentPage as a dependency
    
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
                        {/* Render the found product details here */}
                        {/* For example: */}
                        <h2>{foundProduct[0].product}</h2>
                        <p>{foundProduct[0].description}</p>
                        {/* Continue rendering other details */}
                    </div>
                )}
            </div>


            <div className="products-container">
                {products.map(product => (
                    <Link to={`/detail/${product.id}`} key={product.id} className="product-link">
                        <div className="product">
                            <h3>{product.product}</h3>
                            <p>{product.description}</p>
                            <img src={product.image} alt={product.product} />
                            <p>price: {product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
            </div>
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {noProductsFoundError && <p style={{ color: 'blue' }}>{noProductsFoundError}</p>}
        </div>
    );

    
};


export default Home;
