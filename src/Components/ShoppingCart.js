import React, { useState, useEffect } from 'react';
import FetchWithAuth from './Auth/FetchWithAuth';

const accessToken = localStorage.getItem('accessToken'); // if no token then it means the user is not logged in
                                                        // then we display a message telling them they can't add to cart
                                                        // until they log in. Or we can redirect them to /login

let ALL_PRODUCTS_IN_CART_URL = 'http://localhost:3001/user/viewcart';
let ADD_CART_TO_CART_URL = 'http://localhost:3001/user/add-to-cart';
let DELETE_A_PRODUCT_FROM_CART = 'http://localhost:3001/user/delete-from-cart'; // this will delete the product from the cart no matter the quantity
let DELETE_ALL_PRODUCTS_FROM_CART = 'http://localhost:3001/user/clear-cart';
let UPDATE_CART_URL = 'http://localhost:3001/user/update-cart';
                    
function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState(false); // actualizar shopping cart en tiempo real.
    const [showCart, setShowCart] = useState(false);  // To toggle cart display



    useEffect(() => {
        if (accessToken) {
            fetchProductsInCart();
        }
    }, [update]); // Update on changes to cart

    useEffect(() => {
        if (accessToken) {
            fetchProductsInCart();
        }
    }, [showCart]); // Update cart whenever it's opened


    
    const fetchProductsInCart = async () => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth('http://localhost:3001/user/viewcart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setCartItems(data.Products || []);
            setIsLoading(false);
        } catch (error) {
            console.error(`Error fetching cart items: ${error}`);
        }
    };



    const addToCart = async (productId, quantity) => {
        try {
            await FetchWithAuth('http://localhost:3001/user/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            setUpdate(!update); // Toggle to re-fetch cart items
        } catch (error) {
            console.error(`Error adding to cart: ${error}`);
        }
    };
   

 const updateQuantity = async (productId, quantity) => {
        try {
            await FetchWithAuth('http://localhost:3001/user/update-cart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            setUpdate(!update); // Toggle to re-fetch cart items
        } catch (error) {
            console.error(`Error updating cart: ${error}`);
        }
    };


    // this is also a button that will be displayed to delete a specific product from the cart.
    const deleteFromCart = async (productId) => {
        try {
            await FetchWithAuth('http://localhost:3001/user/delete-from-cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId })
            });
            setUpdate(!update); // Toggle to re-fetch cart items
        } catch (error) {
            console.error(`Error deleting a product from cart: ${error}`);
        }
    };



    // this will also be a button which will show up once the user clicks on the cart and it opens up to the side.
    // this will delete all products from the cart, leaving it empty.
    const deleteAllProductsFromCart = async () => {
        try {
            await FetchWithAuth('http://localhost:3001/user/clear-cart', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setUpdate(!update); // Toggle to re-fetch cart items
        } catch (error) {
            console.error(`Error deleting all products from cart: ${error}`);
        }
    };

    const proceedToCheckout = () => {
        // Navigate to checkout page or handle checkout process
        // this button will redirect users to the ViewCart component.
        window.location.href = '/viewcart'
    };

    const toggleCart = () => {
        setShowCart(!showCart); // Toggle visibility of the cart
    };



    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="shopping-cart-icon">
            <button  style={{marginLeft: '1240px'}} onClick={toggleCart}>🛒 </button> {/* Cart icon */}
            {showCart && (
                <div className='Users-Shopping-Cart-Ultimate'>
                    <h2>Shopping Cart</h2>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id}>
                                <h3>{item.product}</h3>
                                <p>Price: ${item.price}</p>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                />
                                <button onClick={() => deleteFromCart(item.id)}>Remove</button>
                            </div>
                        ))
                    )}
                    <button onClick={() => {/* proceedToCheckout function here */}}>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );

}

export default ShoppingCart;


// this component will work inside the HOME component.
// below every product in the HOME component there will be a button saying 'add to cart' and when clicked, it 
// will add the specific product to this component (ShoppingCart). 
// because the products are being rendered we already have easy access to the id of each one.
/**
 * // new quantity to also adjust its amount in the cart itself
  const updateQuantity = async (productId, newQuantity) => {
        const response = await fetch('http://localhost:3001/user/update-cart', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ productId, quantity: newQuantity })
        });
        if (response.ok) {
            setCartItems(prevItems =>
                prevItems.map(item => item.id === productId ? { ...item, ProductCart: { ...item.ProductCart, quantity: newQuantity } } : item)
            );
        } else {
            console.error('Failed to update quantity');
        }
    };



     const deleteFromCart = async (productId) => {
        const response = await fetch(`http://localhost:3001/user/delete-from-cart/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        if (response.ok) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        } else {
            console.error('Failed to delete item from cart');
        }
    };

 */