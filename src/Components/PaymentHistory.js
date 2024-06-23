import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import seePaymentHistory from  './module.PaymentHistory.css';
import ProfileIcon from "./ProfileIcon";
import ViewCartIcon from "./ViewCartIcon";
import AdminButtonIcon from "./AdminButtonIcon";
const API_URL = process.env.REACT_APP_URL

const accessToken = localStorage.getItem('accessToken');

function PaymentHistory() {
    const [generalError, setGeneralError] = useState('');
    const [noPaymentsError, setNoPaymentsError] = useState('');
    const [userPaymentHistory, setUserPaymentHistory] = useState([]);
    const [productNames, setProductNames] = useState({});

    if (!accessToken) {
        window.location.href = '/login';
    }

    const getProductName = async (productId) => {
        try {
            const response = await fetch(`${API_URL}/product-detail/${productId}`);

            if (response.status === 404) {
                console.log('Error: producto no existe');
                return 'Product Name Not Found';
            }

            if (!response.ok) {
                console.log('Error');
                return 'Product Name Not Found';
            }

            const data = await response.json();
            return data.product;

        } catch (error) {
            console.log(`ERROR: ${error}`);
            return 'Product Name Not Found';
        }
    };

    const fetchDetails = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/payment-history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                setNoPaymentsError('Aún no has comprado nada.');
                setGeneralError('');
                return;
            }

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                return;
            }

            const data = await response.json();
            setUserPaymentHistory(data);

            const productNamesMap = {};
            for (const payment of data) {
                const productName = await getProductName(payment.productId);
                productNamesMap[payment.id] = productName;
            }
            setProductNames(productNamesMap);

        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <div className="PaymentHistory">
            < ProfileIcon/>
            < ViewCartIcon/>
            < AdminButtonIcon/>
            <h1>Total: {userPaymentHistory.length}</h1>
            {generalError && <p>{generalError}</p>}
            {noPaymentsError && <p>{noPaymentsError}</p>}
            {userPaymentHistory.length > 0 && (
                <ul>
                    {userPaymentHistory.map((payment) => (
                        <li key={payment.id}>
                            <p>Product ID: {payment.productId}</p>
                            <p>Product Name: {productNames[payment.id]}</p>
                            <p>Quantity: {payment.quantity}</p>
                            <p>Total amount: {payment.total_transaction_amount || 'Error mostrando detalles.'}</p>
                            <p>Purchase Date: {new Date(payment.purchaseDate).toLocaleString()}</p>
                            <div>
                                <h3>Shipping Information</h3>
                                <p>Country: {payment.Shipping ? payment.Shipping.country : 'No disponible'}</p>
                                <p>City: {payment.Shipping ? payment.Shipping.city : 'No disponible'}</p>
                                <p>Zip Code: {payment.Shipping ? payment.Shipping.zip_code : 'No disponible'}</p>
                                <p>Order ID: {payment.orderId}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PaymentHistory;
