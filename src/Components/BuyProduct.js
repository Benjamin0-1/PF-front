import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";

const accessToken = localStorage.getItem('accessToken');

const URL = 'http://localhost:3001/create-checkout-session';

const PUBLISHABLE_KEY = 'pk_test_51P7RX608Xe3eKAmZNBa0XOqO2r1gfHIWZfrOxantEvF9QZ8HJgooaHnw86z2mbu2lDpSO1kOzbQ3Rl2IzivzoFVb00n6EW77lL';

const BuyProduct = () => {
    const [products, setProducts] = useState([{ id: '', quantity: 1 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadStripe = async () => {
            if (!window.Stripe) {
                const stripeScript = document.createElement('script');
                stripeScript.src = 'https://js.stripe.com/v3/';
                stripeScript.async = true;
                stripeScript.onload = () => {
                    console.log('Stripe.js has loaded.');
                };
                document.body.appendChild(stripeScript);
            }
        };

        loadStripe();

        return () => {
            // Cleanup function
        };
    }, []);

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
                body: JSON.stringify({ products })
            });

            const data = await response.json();
            const { id } = data;
            redirectToCheckout(id);
        } catch (error) {
            setError('Failed to initiate checkout');
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

    return (
        <div>
            <h2>Buy Products</h2>
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {success && <p>Redirecting to checkout...</p>}
            {products.map((product, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Enter Product ID"
                        value={product.id}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                    />
                    <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    />
                    <button onClick={() => removeProduct(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addProduct}>Add Product</button>
            <button onClick={handleBuy} disabled={loading}>Buy</button>
        </div>
    );
};

export default BuyProduct;
