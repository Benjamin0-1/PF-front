import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import ProfileIcon from "./ProfileIcon";
import AdminButtonIcon from "./AdminButtonIcon";

import cartsbeforepurchasecomponent from './module.ViewCart.css';

const PUBLISHABLE_KEY = 'pk_test_51P7RX608Xe3eKAmZNBa0XOqO2r1gfHIWZfrOxantEvF9QZ8HJgooaHnw86z2mbu2lDpSO1kOzbQ3Rl2IzivzoFVb00n6EW77lL';

const accessToken = localStorage.getItem('accessToken');
const VIEW_CART_URL = 'http://localhost:3001/user/viewcart';
const UPDATE_CART_URL = 'http://localhost:3001/user/update-cart';
const DELETE_CART_ITEM_URL = 'http://localhost:3001/user/delete-from-cart';
const CHECKOUT_URL = 'http://localhost:3001/create-checkout-session';
const SHIPPING_INFO_URL = 'http://localhost:3001/shipping-info';

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
            const response = await FetchWithAuth(CHECKOUT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ products: productsPayload, reqShippingId: reqShippingId }) //< FIX FIXED value because otherwise it doesnt work.
            });
            const checkoutSession = await response.json();
            if (response.ok) {
                redirectToCheckout(checkoutSession.id); // Make sure this is the correct property
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
    
    


    // fetch all data required for purchase
    useEffect(() => {
        fetchCartItems();
        fetchShippingAddresses();
    }, []);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await FetchWithAuth(VIEW_CART_URL, {
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
            const response = await FetchWithAuth(SHIPPING_INFO_URL, {
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
            await FetchWithAuth(UPDATE_CART_URL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId, quantity: newQuantity }) // <-- it's through body not params
            });
            fetchCartItems(); // <-- same goes for this, there's no need to reload the page
        } catch (error) {
            setError(`Update error: ${error.message}`);
        }
    };

    const deleteItem = async (productId) => {
        try {
            
            const response = await FetchWithAuth('http://localhost:3001/user/delete-from-cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({productId}) // it's throight body not params
            });
           // instead of fetching agan, just use the .map method to make them dissapear from the screen
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

// this component is one of the most important ones.
// it will display everything on the user's cart by getting the products from the server.
// it will then display them in a friendly manner.
// it will have buttons to quickly delete and change a product quantity, much like in the ShoppingCart component.
// it will also render all shipping info related to the user, so it can quickly
// click on the one that wishes to be used for the purchase. like in the BuyProduct component.
// it will load stripe and everything required for it. 
// the 'Finish Checkout' button will take everything that's rendered in this component
// and then go to stripe to finish the purchase.
