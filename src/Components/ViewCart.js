import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import ProfileIcon from "./ProfileIcon";
import AdminButtonIcon from "./AdminButtonIcon";

import cartsbeforepurchasecomponent from './module.ViewCart.css';
const API_URL = process.env.REACT_APP_URL

const PUBLISHABLE_KEY = 'pk_test_51P7RX608Xe3eKAmZNBa0XOqO2r1gfHIWZfrOxantEvF9QZ8HJgooaHnw86z2mbu2lDpSO1kOzbQ3Rl2IzivzoFVb00n6EW77lL';

const accessToken = localStorage.getItem('accessToken');

function ViewCart() {
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [selectedShippingId, setSelectedShippingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [reqShippingId, setReqShippingId] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    };

    // LOAD STRIPE.
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
            } else {
                console.log('Stripe.js is already loaded.');
               
            }
        };
    
        loadStripe();
    
        return () => {
            
        };
    }, []);

    const proceedToCheckout = async () => {
      
    
        if (!cartItems.length) {
            setError('Your cart is empty.');
            return;
        }
    
        const productsPayload = cartItems.map(item => ({
            id: item.id,
            quantity: item.ProductCart.quantity
        }));
    
        try {
            const response = await FetchWithAuth(`${API_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ products: productsPayload, reqShippingId: reqShippingId }) 
            });
            const checkoutSession = await response.json();
            if (response.ok) {
                redirectToCheckout(checkoutSession.id); 
            } else {
                throw new Error(checkoutSession.message || 'Failed to initiate checkout');
            }
        } catch (error) {
            setError(`Checkout error: ${error.message}`);
        }
    };
    
    const redirectToCheckout = async (sessionId) => {
        if (window.Stripe) {
            const stripe = window.Stripe(PUBLISHABLE_KEY);
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId
            });
            if (error) {
                setError(`Failed to redirect to checkout: ${error.message}`);
            }
        } else {
            setError('Stripe.js is not loaded yet');
        }
    };
    
    


    
    useEffect(() => {
        fetchCartItems();
        fetchShippingAddresses();
    }, []);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/user/viewcart`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCartItems(data.Products || []);
            } else {
                throw new Error(data.message || 'Error fetching cart items');
            }
        } catch (error) {
            setError(`Fetch error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchShippingAddresses = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/shipping-info`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const data = await response.json();
            if (response.ok) {
                setShippingAddresses(data);
            } else {
                throw new Error('Failed to fetch shipping addresses');
            }
        } catch (error) {
            setError(`Shipping fetch error: ${error.message}`);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            await FetchWithAuth(`${API_URL}/user/update-cart`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId, quantity: newQuantity }) 
            });
            fetchCartItems(); 
        } catch (error) {
            setError(`Update error: ${error.message}`);
        }
    };

    const deleteItem = async (productId) => {
        try {
            
            const response = await FetchWithAuth(`${API_URL}/user/delete-from-cart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({productId}) 
            });
           
           setCartItems(cartItems.filter(item => item.id !== productId));

        } catch (error) {
            console.log(`error deleting item: ${error}`);
        }

    };


    

    const handleSelectShippingAddress = (id) => {
        setSelectedShippingId(id);
        setReqShippingId(id);
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    // each shipping addr should be displayed as a card, and when clicked (selected) a blue background should show up all over it.
    // so that users know exactly which  addr they selected before purchasing . 
    return (
        <div className="container">
            < ProfileIcon/>
            < AdminButtonIcon/>
            <h2 className="shopping-cart-heading">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id} className="cart-item">
                            <img src={item.image} alt={item.product} />
                            <p>{item.product} - ${item.price}</p>
                            <p>Quantity: {item.ProductCart.quantity}</p>
                            <button onClick={() => updateQuantity(item.id, item.ProductCart.quantity + 1)}>+</button>
                            <button onClick={() => updateQuantity(item.id, item.ProductCart.quantity - 1)}>-</button>
                            <button onClick={() => deleteItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            

            <h3>Select a Shipping Address:</h3>
            {shippingAddresses.map((address) => (
            <div key={address.shippingId} className={`shipping-address ${selectedShippingId === address.shippingId ? 'selected' : ''}`} onClick={() => handleSelectShippingAddress(address.shippingId)}>
                <p> Nickname: {address.nickname}.  Country: {address.country}. City {address.city} Zip code: {address.zip_code}</p>
            </div>
        ))}
        <button onClick={proceedToCheckout}>Proceed to Checkout</button>
    </div>



    );
    
}

export default ViewCart;