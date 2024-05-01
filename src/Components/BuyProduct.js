import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './BuyProduct.css';

const accessToken = localStorage.getItem('accessToken');

let URL = 'http://localhost:3001/create-checkout-session';
//                                          https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/create-checkout-session
//URL = 'https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/create-checkout-session';

const PUBLISHABLE_KEY = 'pk_test_51P7RX608Xe3eKAmZNBa0XOqO2r1gfHIWZfrOxantEvF9QZ8HJgooaHnw86z2mbu2lDpSO1kOzbQ3Rl2IzivzoFVb00n6EW77lL';

const BuyProduct = () => {
    const [products, setProducts] = useState([{ id: '', quantity: 1 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [reqShippingId, setReqShippingId] = useState(null);
    const [productNotFoundError, setProductNotFoundError] = useState('');
    const [outOfStockError, setOutOfStockError] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    }

    useEffect(() => {
        fetchShippingAddresses();
    }, []);

    useEffect(() => {
        const loadStripe = async () => {
            if (!window.Stripe) {
                const stripeScript = document.createElement('script');
                stripeScript.src = 'https://js.stripe.com/v3/';
                stripeScript.async = true;
                stripeScript.onload = () => {
                    console.log('Stripe.js has loaded.');
                    // Now you can safely use Stripe here
                };
                document.body.appendChild(stripeScript);
            } else {
                console.log('Stripe.js is already loaded.');
                // Now you can safely use Stripe here
            }
        };
    
        loadStripe();
    
        return () => {
            // Cleanup function
        };
    }, []);
    
    

    const fetchShippingAddresses = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await FetchWithAuth('http://localhost:3001/shipping-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            if (data.length === 0) {
                setError('You have zero shipping addresses');
            } else {
                setShippingAddresses(data);
            }
        } catch (error) {
            console.log(`ERROR: ${error}`);
            setError('Failed to fetch shipping addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAddress = (shippingId) => {
        setReqShippingId(shippingId);
    };

    const handleBuy = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ products, reqShippingId })
            });
            
            const data = await response.json();

            if (data.outOfStock) {
                setOutOfStockError('Uno de los productos seleccionados esta fuera de stock.');
                setError('');
                return;
            }

            if (response.status === 404) {
                setProductNotFoundError('No existe un producto seleccionado.');
                setError('');
                return;
            }

            const { id } = data;
            redirectToCheckout(id);
        } catch (error) {
            setError('Failed to initiate checkout');
            setProductNotFoundError('');

        } finally {
            setLoading(false);
        }
    };

    const redirectToCheckout = async (sessionId) => {
        if (window.Stripe) {
            const stripe = window.Stripe(PUBLISHABLE_KEY);
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId
            });
            if (error) {
                setError('Failed to redirect to checkout');
            }
        } else {
            setError('Stripe.js is not loaded yet');
        }
    };

    const handleProductChange = (index, value) => {
        const updatedProducts = [...products];
        updatedProducts[index].id = value;
        setProducts(updatedProducts);
    };

    const handleQuantityChange = (index, value) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity = value;
        setProducts(updatedProducts);
    };

    const addProduct = () => {
        setProducts([...products, { id: '', quantity: 1 }]);
    };

    const removeProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    // add more erros: noAddrSelectedError, noStockError, productIdNotFoundError. 

    return (
        <div className="container">
            <h2>Buy Products</h2>
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {success && <p>Redirecting to checkout...</p>}
            <div className="shipping-addresses">
                <h3>Shipping Addresses: {shippingAddresses.length}</h3>
                {shippingAddresses.map((address) => (
                    <div className="shipping-address" key={address.shippingId} onClick={() => handleSelectAddress(address.shippingId)}>
                        <p>Nickname: {address.nickname}</p>
                        <p>Country: {address.country}</p>
                        <p>City: {address.city}</p>
                        <p>Zip Code: {address.zip_code}</p>
                        <button className="select-btn">Select Address</button>
                    </div>
                ))}
            </div>
            {products.map((product, index) => (
                <div className="container" key={index}>
                    <input
                        type="text"
                        className="product-input"
                        placeholder="Enter Product ID"
                        value={product.id}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                    />
                    <input
                        type="number"
                        className="quantity-input"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    />

                    <button className="remove-button" onClick={() => removeProduct(index)}>Remove</button>
                </div>
            ))}
            <button className="add-product-button" onClick={addProduct}>Add Product</button>
            <button className="buy-button" onClick={handleBuy} disabled={loading}>Buy</button>
        </div>
    );
};

export default BuyProduct;
