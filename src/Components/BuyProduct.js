import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import  buyAProductStyles  from './module.BuyProduct.css';
import ProfileIcon from "./ProfileIcon";
import AdminButtonIcon from "./AdminButtonIcon";

// Este componente lo hice para testear el checkout.

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
    const [allProducts, setAllProducts] = useState([]);
    const [missingShippingInfo, setMissingShippingInfo] = useState('');
    const [productInCartNotFound, setProductInCartNotFound] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    }

    useEffect(() => {
        fetchProducts(); // <-- 
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

    const fetchProducts = async () => {
        try {
            
            const response = await fetch('http://localhost:3001/allproducts');
            const data = await response.json();

            if (data.length === 0) {
                setError('No hay productos disponibles');
                return;
            };
            setAllProducts(data);
            

        } catch (error) {
            console.log(`error: ${error}`);
        }
    };
    
    

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

            if (response.status === 404) {
                setProductInCartNotFound('Uno de los productos seleccionados no existe');
                setError('');
                return
            }
            
            const data = await response.json();

            if (data.missingShippingInfo) {
                setMissingShippingInfo('Falta agregar direccion de envio');
                setError('');
                return
            };

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

    //BOTON PARA COMPRAR DE INMEDIATO, SIMPLE.
    const handleBuyNow = async (product) => {
        try {
            setLoading(true);
            setError(null);
    
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ products: [{ id: product.id, quantity: 1 }], reqShippingId })
            });

            if (response.status === 404) {
                setProductInCartNotFound('Uno de los productos seleccionados no existe');
                setError('');
                return
            }
    
            const data = await response.json();

            if (data.missingShippingInfo) {
                setMissingShippingInfo('falta agregar direccion de envio');
                setError('');
                return
            }
    
            if (data.outOfStock) {
                setOutOfStockError('The selected product is out of stock.');
                setError('');
                return;
            }
    
            if (response.status === 404) {
                setProductNotFoundError('The selected product was not found.');
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

    
    const handleAddProduct = (product) => {
        
        const productExists = products.some((p) => p.id === product.id);
    
        if (!productExists) {
            // If the product is not already in the list, add it
            setProducts([...products, { id: product.id, quantity: product.quantity }]);
        } else {
            
            const updatedProducts = products.map((p) => {
                if (p.id === product.id) {
                    return { ...p, quantity: p.quantity + product.quantity };
                }
                return p;
            });
            setProducts(updatedProducts);
        }
    };
    
    

    return (
        <div className="container">
            < ProfileIcon/>
            <AdminButtonIcon />
            <h2>Buy Products</h2>
            {missingShippingInfo && <p style={{color: 'red'}}> {missingShippingInfo} </p>}
            {productInCartNotFound && <p style={{color: 'red'}}>{productInCartNotFound}</p>}
            {outOfStockError && <p style={{color: 'red'}}>{outOfStockError}</p>}
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {success && <p>Redirecting to checkout...</p>}

            <div className="shipping-addresses">
             <h3>Shipping Addresses: {shippingAddresses.length}</h3>
            {shippingAddresses.map((address) => (
                <div className={`shipping-address ${reqShippingId === address.shippingId ? 'selected' : ''}`} key={address.shippingId}>
                    <p>Nickname: {address.nickname}</p>
                    <p>Country: {address.country}</p>
                    <p>City: {address.city}</p>
                    <p>Zip Code: {address.zip_code}</p>
                    <button className="select-btn" onClick={() => handleSelectAddress(address.shippingId)}>Select Address</button>
                </div>
            ))}
        </div>

            {/** show products. */}
        <div className="products">
            <h3>Available Products:</h3>

           {allProducts.map((product) => (
            <div className="product" key={product.id}>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-details">
                    <p>Product ID: {product.id}</p>
                    <p>Name: {product.product}</p>
                    <p>Price: ${product.price}</p>
                    <p>Stock: {product.stock === 0 ? 'Out of stock' : product.stock}</p>
                    <p>Description: {product.description}</p>
                    <button className="add-product-button" onClick={() => handleBuyNow(product)}>Buy Now</button>

                </div>
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
