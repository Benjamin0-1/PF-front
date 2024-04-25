import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './PaymentHistory.css';

const accessToken = localStorage.getItem('accessToken');

const PORT = process.env.PORT || 3001;
const URL = `http://localhost:${PORT}/payment-history`;
const DETAIL_URL = `http://localhost:${PORT}/product-detail`

function PaymentHistory() {
    const [generalError, setGeneralError] = useState('');
    const [noPaymentsError, setNoPaymentsError] = useState('');
    const [userPaymentHistory, setUserPaymentHistory] = useState([]);
    const [productNames, setProductNames] = useState({});

    if (!accessToken) {
        window.location.href = '/login'
    }

    const getProductName = async (productId) => {
        try {
            const response = await fetch(`${DETAIL_URL}/${productId}`);

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

    const calculateTotalAmount = (products) => {
        let totalAmount = 0;
        for (const product of products) {
            totalAmount += product.price * product.quantity;
        }
        return totalAmount;
    };


    const fetchDetails = async () => {
        try {
            const response = await FetchWithAuth(URL, {
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
    }

    useEffect(() => {
        fetchDetails();
    }, []);

    // FALTA INCLUIR EL TOTAL DE CADA TRANSACTION. (editar PaymentHistory ? ).
    return (
        <div className="PaymentHistory">
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

export default PaymentHistory;
