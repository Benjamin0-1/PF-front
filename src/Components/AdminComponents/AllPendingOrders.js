import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './AllPendingOrders.css';

const accessToken = localStorage.getItem('accessToken');
let ALL_PENDING_ORDERS_URL = 'http://localhost:3001/all-orders/pending';

function AllPendingOrders() {
    const [generalError, setGeneralError] = useState('');
    const [allPendingOrders, setAllPendingOrders] = useState([]);
    const [noOrdersFound, setNoOrdersFound] = useState('');
    const [page, setPage] = useState(1);
    const ordersPerPage = 2;
    const [totalCount, setTotalCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalCount / ordersPerPage); 
    const [sortByAsc, setSortByAsc] = useState(true);
    const [orderAlreadyFulfilledError, setOrderAlreadyFulfilledError] = useState('');

    const [orderFulfilledMessage, setOderFulfilledMessage] = useState('');
    const [errorFulfillingOrder, setErrorFulfillingOrder] = useState('');

    // prevent access.
    if (!accessToken) {
        window.location.href = '/login'
    };

    useEffect(() => {
        const checkIsAdmin = async () => {
            try {
                const response = await FetchWithAuth('http://localhost:3001/profile-info', {
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
                console.log(`error: ${error}`);
            }
        };

        checkIsAdmin();
    }, []);

    // search order by id.
    const handleSearch = async () => {};


    // fulfill
    const handleFulfill = async (orderId) => {
        try {
            const response = await FetchWithAuth('http://localhost:3001/orders/fulfill', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ orderId }) 
            });
    
            const data = await response.json();
    
            if (data.orderAlreadyFulfilled) {
                setOrderAlreadyFulfilledError(`Esta orden numero ${orderId} ya ha sido completada`);
                setOderFulfilledMessage('');
                return;
            };

            
    
            setOderFulfilledMessage(`Orden numero ${orderId} completada exitosamente`);
            setOrderAlreadyFulfilledError('');
            setErrorFulfillingOrder('');
    
            fetchPendingOrders();
        } catch (error) {
            console.error(`Error fulfilling order: ${error}`);
            setErrorFulfillingOrder('Error completando orden.');
            setOrderAlreadyFulfilledError('');
            setOderFulfilledMessage('');
        }
    };
    
    
    
    

    const fetchPendingOrders = async () => {
        try {
            const response = await FetchWithAuth(`${ALL_PENDING_ORDERS_URL}${sortByAsc ? '/asc' : '/desc'}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (!response.ok) {
                setNoOrdersFound('No se han encontrado ordenes pendientes');
                setGeneralError('');
                return;
            }
    
            const data = await response.json();
            if (data.allPendingOrders.length === 0) {
                setNoOrdersFound('No se han encontrado ordenes pendientes');
                setAllPendingOrders([]);
                setGeneralError('');
                return;
            }
    
            setAllPendingOrders(data.allPendingOrders);
            setTotalCount(data.totalCount);
            const paginatedOrders = paginate(data.allPendingOrders, ordersPerPage);
            setGeneralError('');
            setNoOrdersFound('');
        } catch (error) {
            console.error(`Error fetching pending orders: ${error}`);
            setGeneralError('Error mostrando ordenes');
            setNoOrdersFound('');
        }
    };
    
    useEffect(() => {
        fetchPendingOrders();
    }, [accessToken, currentPage, sortByAsc]);// <-- agregar acessToken soluciona bug en donde no se ve nada.

  

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

    const handleSortToggle = () => {
        setSortByAsc(prevState => !prevState); // Toggle sorting order
    };


    return (
        <div className="AllPendingOrders">
            <h1>Total: {totalCount}</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Order ID"
         
                />
                <button onClick={handleSearch}>Search</button>
            </div>



            <div className="toggle-button">
                
                <button onClick={handleSortToggle}>
                    {sortByAsc ? 'Sort by Price Ascending' : 'Sort by Price Descending'}
                </button>
            </div>

            

            {generalError && <p className="error">{generalError}</p>}
            {allPendingOrders.map(order => (
                <div key={order.id} className="orderContainer">
                    <h2>Order Details</h2>
                    <p>Order ID: {order.id}</p>
                    <p>Order Date: {order.order_date}</p>
                    <p>User ID: {order.userId}</p>
                    <p>Total Amount: {order.totalAmount}</p>
                    <p>Payment Status: {order.paymentStatus}</p>
                    <p>Shipping ID: {order.shippingId}</p>
                    <p>Created At: {order.createdAt}</p>
                    <p>Updated At: {order.updatedAt}</p>

                    <h2>User Details</h2>
                    <p>User ID: {order.User.id}</p>
                    <p>First Name: {order.User.first_name}</p>
                    <p>Last Name: {order.User.last_name}</p>
                    <p>Username: {order.User.username}</p>
                    <p>Email: {order.User.email}</p>

                    <p>Is Admin: {order.User.is_admin ? 'Yes' : 'No'}</p>
                    <p>Two Factor Authentication: {order.User.two_factor_authentication ? 'Enabled' : 'Disabled'}</p>
                    <p>Created At: {order.User.createdAt}</p>
                    <p>Updated At: {order.User.updatedAt}</p>

                    <h2>Products</h2>
                    <ul>
                        {order.Products.map(product => (
                            <li key={product.id}>
                                <p>Product ID: {product.id}</p>
                                <p>Brand ID: {product.brandId}</p>
                                <p>Price: {product.price}</p>
                                <p>Product: {product.product}</p>
                                <p>Description: {product.description}</p>
                                <p>Stock: {product.stock}</p>
                                <p>Attributes: {product.attributes}</p>

                                <p>Featured: {product.featured ? 'Yes' : 'No'}</p>
                                <p>User ID: {product.userId}</p>
                                <p>Image: <img src={product.image} alt={product.product} /></p>
                                <p>Created At: {product.createdAt}</p>
                                <p>Updated At: {product.updatedAt}</p>
                                <button onClick={() => handleFulfill(order.id)} className="FulfillButton">Fulfill Order</button>
                                {orderAlreadyFulfilledError && <p style={{color: 'red'}}>{orderAlreadyFulfilledError}</p>}
                                {errorFulfillingOrder && <p style={{color: 'red'}}>{errorFulfillingOrder}</p>}
                                {orderFulfilledMessage && <p style={{color: 'green'}}>{orderFulfilledMessage}</p>}

                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <div className="pagination">
                <button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default AllPendingOrders;
