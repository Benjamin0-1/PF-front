import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FetchWithAuth from "./Auth/FetchWithAuth";
import './Home.css';
import Newsletter from "./Newsletter";  // <-- newsletter.
import Filter from "./Filter";
import Card from "./Card/Card";

const accessToken = localStorage.getItem('accessToken');


function Home() {
    const [ products, setProducts ] = useState([]);
    const [ generalError, setGeneralError ] = useState('');
    const [ noProductsFoundError, setNoProductsFoundError ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ productToSearch, setProductToSearch ] = useState('');
    const [ noProductSearchError, setNoProductSearchError ] = useState('');
    const [ foundProduct, setFoundProduct ] = useState([]);
    const [ newsletterVisible, setNewsletterVisible ] = useState(false);
    const [ alphabeticalOrder, setAlphabeticalOrder ] = useState(false);
    const [ sortByPriceAsc, setSortByPriceAsc ] = useState(false);
    const [ sortByPriceDesc, setSortByPriceDesc ] = useState(false);

    const [ filteredProducts, setFilteredProducts ] = useState([]);


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

            const productId = data.products[ 0 ].id;
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
                const paginatedProducts = paginate(data, 9); // Assuming 5 products per page
                setProducts(paginatedProducts[ currentPage - 1 ] || []);
                setTotalPages(paginatedProducts.length);
                setGeneralError('');
                setNoProductsFoundError('');

            } catch (error) {
                console.log(`Error: ${error}`);
                setGeneralError('Ha ocurrido un error.');
            }
        };


        fetchAllProducts();
    }, [ currentPage, alphabeticalOrder, sortByPriceDesc, sortByPriceAsc ]);


    // Pagination function remains unchanged
    const paginate = (array, pageSize) => {
        return array.reduce((acc, item, index) => {
            const pageIndex = Math.floor(index / pageSize);
            if (!acc[ pageIndex ]) {
                acc[ pageIndex ] = [];
            }
            acc[ pageIndex ].push(item);
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
            <div className="home-sideBar">
                <div className="toggle-button">
                    <button onClick={ () => setAlphabeticalOrder(!alphabeticalOrder) }>
                        { alphabeticalOrder ? 'normal order' : 'Sort Alphabetically' }
                    </button>
                    <button onClick={ handleSortByPriceAsc }>
                        { sortByPriceAsc ? 'normal order' : 'Sort by Price Ascending' }
                    </button>
                    <button onClick={ handleSortByPriceDesc }>
                        { sortByPriceDesc ? 'normal order' : 'Sort by Price Descending' }
                    </button>
                </div>


                {/* Render the Filter component */ }
                <Filter handleFilter={ handleFilter } />
            </div>
            <div className="home-main">
                <div className="products-container">
                    { filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Link to={ `/detail/${product.id}` } key={ product.id } className="product-link">
                                <div className="product">
                                    <h3>{ product.name }</h3>
                                    <p>Price: ${ product.price }</p>
                                </div>
                            </Link>
                        ))
                    ) : (

                        products.map((product, i) => (

                            <Card
                                key={ i }
                                product={ product.product }
                                image={ product.image }
                                price={ product.price }
                                description={ product.description }
                                id={ product.id } />


                        ))

                    ) }
                </div>

                <div className="pagination">
                    <button disabled={ currentPage === 1 } onClick={ handlePrevPage }>Previous</button>
                    <span>{ currentPage } / { totalPages }</span>
                    <button disabled={ currentPage === totalPages } onClick={ handleNextPage }>Next</button>
                </div>

            </div>
            { generalError && <p style={ { color: 'red' } }>{ generalError }</p> }
            { noProductsFoundError && <p style={ { color: 'blue' } }>{ noProductsFoundError }</p> }
            <br />
            { newsletterVisible && <Newsletter /> }
        </div>
    );


};


export default Home;
