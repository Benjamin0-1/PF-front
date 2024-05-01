import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './Order.css';

const accessToken = localStorage.getItem('accessToken');

function Order() {
    const [orders, setOrders] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [noOrders, setNoOrders] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await FetchWithAuth('http://localhost:3001/my-orders', {
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
    }, []);

    return (
        <div className="Order">
            <h2>Total: {orders.length}</h2>
            {generalError && <p>{generalError}</p>}
            {noOrders && <p>{noOrders}</p>}
            {orders.map(order => (
                <div key={order.id}>
                    <p><strong>Order ID: {order.id}</strong></p>
                    <p>Order Date: {order.order_date}</p>
                    <p><strong>Total amount: {order.totalAmount}</strong></p>
           
                    <p>Payment Status: {order.paymentStatus}</p>
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
