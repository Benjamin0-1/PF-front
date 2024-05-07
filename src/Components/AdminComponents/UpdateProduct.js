import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './UpdateProduct.css';
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

const URL = 'http://localhost:3001/update-product';

//MEJORAS QUE FALTA: <-- PODER EDITAR CATEGORIA Y TAMBIEN BRAND (POR ID).

const DETAIL_URL = 'http://localhost:3001/product-detail'

function UpdateProduct() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [productNotFoundError, setProductNotFoundError] = useState('');
    const [productId, setProductId] = useState('');

    // input fields
    const [brandId, setBrandId] = useState('');
    const [productName, setProductName] = useState(''); // <-- BUG: nombre de producto no se actualiza. (el bug es de front-end, no del back).
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    // if (!accessToken) {
    //     window.location.href = '/login'
    // };

    useEffect(() => {
        const checkIsAdmin = async () => {
          try {
            const response = await FetchWithAuth('http://localhost:3001/profile-info', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            const data = await response.json();
            if (!data.is_admin) {
              window.location.href = '/notadmin';
            }
          } catch (error) {
            console.log(`error: ${error}`);
          }
        };
    
        checkIsAdmin();
      }, []);


    useEffect(() => {
        if (!productId) {
            return;
        }

        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`${DETAIL_URL}/${productId}`);
    
                if (response.status === 404) {
                    setGeneralError('Product not found');
                    return;
                }
    
                if (!response.ok) {
                    setGeneralError('Failed to fetch product details');
                    return;
                }

                setProductNotFoundError('');
                setGeneralError('');

                const productData = await response.json();
                setBrandId(productData.brandId);
                setProductName(productData.product);
                setStock(productData.stock);
                setPrice(productData.price);
                setDescription(productData.description);
    
            } catch (error) {
                console.log(`ERROR: ${error}`);
            }
        };
    
        fetchProductDetail(); 
    
    }, [productId]);
    

    const handleUpdate = async () => {

        const numberRegex = /^[0-9]+$/;
    const descriptionLengthRegex = /^.{10,}$/;

    // Check validations
    if (!numberRegex.test(brandId)) {
        setGeneralError('Brand ID must be a number.');
        return;
    }
    if (productName.length < 3) {
        setGeneralError('Product name must be at least 3 characters long.');
        return;
    }
    if (!numberRegex.test(stock)) {
        setGeneralError('Stock must be a number.');
        return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        setGeneralError('Price must be a number.');
        return;
    }
    if (!descriptionLengthRegex.test(description)) {
        setGeneralError('Description must be at least 10 characters long.');
        return;
    }
        try {
            const response = await FetchWithAuth(`${URL}/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    brandId,
                    product: productName, // <-- bug arreglado.
                    stock,
                    price,
                    description
                })
            });


            if (response.status === 404) {
                setProductNotFoundError(`El product con id: ${productId} no existe`);
                setGeneralError('');
                setSuccessMessage('');
                return;
            };

            if (!response.ok) {
                const data = await response.json();
                setGeneralError('Ha ocurrido un error')
            };

            setSuccessMessage('Product updated successfully');
            setProductNotFoundError('')
            setGeneralError('');
        } catch (error) {
            setGeneralError(error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="UpdateProduct">
     
            <br/>
            <h2>Update Product</h2>
            <div>
                <label htmlFor="productId">Product ID to update:</label>
                <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="brandId">Brand ID:</label>
                <input
                    type="text"
                    id="brandId"
                    value={brandId}
                    placeholder={brandId !== null && brandId !== '' ? brandId : 'Previous Brand ID'}
                    onChange={(e) => setBrandId(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="productName">Product Name:</label>
                <input
                    type="text"
                    id="productName"
                    value={productName}
                    placeholder={productName !== null && productName !== '' ? productName : 'Previous Product Name'}
                    onChange={(e) => setProductName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="stock">Stock:</label>
                <input
                    type="text"
                    id="stock"
                    value={stock}
                    placeholder={stock !== null && stock !== '' ? stock : 'Previous Stock'}
                    onChange={(e) => setStock(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="price">Price:</label>
                <input
                    type="text"
                    id="price"
                    value={price}
                    placeholder={price !== null && price !== '' ? price : 'Previous Price'}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    placeholder={description !== null && description !== '' ? description : 'Previous Description'}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleUpdate}>Update Product</button>
            </div>
            {generalError && <p className="error">{generalError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <br />
            <br/>
            <AdminNavBar/>
            < br/>
        </div>
    );

    
    
}

export default UpdateProduct;
