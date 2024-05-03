import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './Order.css';

const accessToken = localStorage.getItem('accessToken');

// <-- ADD FILTERS !!! TOTALAMOUNT ASC DESC

function Order() {
    const [orders, setOrders] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [noOrders, setNoOrders] = useState('');
    const [filterAsc, setFilterAsc] = useState(false); 
    const [filterDesc, setFilterDesc] = useState(false); 
    const [filterType, setFilterType] = useState('pending');  // <-- default.

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let url = 'http://localhost:3001/my-orders';
                if (filterAsc) {
                    url += '/asc';
                } else {
                    url += '/desc'; // Default to descending order if not filtered by ascending
                }

                const response = await FetchWithAuth(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    if (data.length === 0) {
                        setNoOrders('Aun no has comprado nada.');
                    } else {
                        setOrders(data);
                    }
                } else {
                    setGeneralError('Error fetching orders.');
                }
            } catch (error) {
                console.log(`error: ${error}`);
                setGeneralError('Error fetching orders. Please try again later.');
            }
        };

        fetchOrders();
    }, [filterAsc]);

    // filtrar por pending y filfulled.
    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                let url = `http://localhost:3001/my-orders/${filterType}`;

                const response = await FetchWithAuth(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    if (data.length === 0) {
                        setNoOrders(`You have no ${filterType === 'pending' ? 'pending' : 'fulfilled'} orders.`);
                    } else {
                        setOrders(data);
                    }
                } else {
                    setGeneralError('Error fetching orders.');
                }
            } catch (error) {
                console.log(`error: ${error}`);
                setGeneralError('Error fetching orders. Please try again later.');
            }
        };

        fetchOrdersData();
    }, [filterType]);

    const toggleFilterType = () => {
        // Toggle between 'pending' and 'fulfilled'
        setFilterType(prevFilterType => (prevFilterType === 'pending' ? 'fulfilled' : 'pending'));
    };
    

    const handleFilterToggle = () => {
        setFilterAsc(prevFilterAsc => !prevFilterAsc); // Toggle between true and false
    };


    return (
        <div className="Order">
            <h2>Total: {orders.length}</h2>
            

            <div className="filter-buttons">
                <button className={filterAsc ? 'active' : ''} onClick={handleFilterToggle}>
                    {filterAsc ? 'Desc' : 'Asc'}
                </button>
            </div>

            <div className="filter-buttons">
                <button className={filterType === 'pending' ? 'active' : ''} onClick={toggleFilterType}>
                    Pending Orders
                </button>
                <button className={filterType === 'fulfilled' ? 'active' : ''} onClick={toggleFilterType}>
                    Fulfilled Orders
                </button>
            </div>


            {generalError && <p>{generalError}</p>}
            {noOrders && <p>{noOrders}</p>}
            {orders.map(order => (
                <div key={order.id}>
                    <p><strong>Order ID: {order.id}</strong></p>
                    <p>Order Date: {order.order_date}</p>
                    <p><strong>Total amount: {order.totalAmount}</strong></p>
           
                    <p> <strong>  Payment Status: {order.paymentStatus} </strong> </p>
                    <p>Shipping Details:</p>
                    <p>Nickname: {order.Shipping.nickname}</p>
                    <p>Country: {order.Shipping.country}</p>
                    <p>City: {order.Shipping.city}</p>
                    <p>Zip Code: {order.Shipping.zip_code}</p>
                    <hr />
                    <p>Products:</p>
                    <ul>
                        {order.Products.map(product => (
                            <li key={product.id}>
                                <p>Product ID: {product.id}</p>
                                <p>Product Name: {product.product}</p>
                                <p>Price: ${product.price}</p>
                                <p>Description: {product.description}</p>
                                <img src={product.image} alt={product.product} style={{ maxWidth: '100px' }} />
                            </li>
                        ))}
                    </ul>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Order;
