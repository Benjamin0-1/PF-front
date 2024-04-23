import React, { useState } from "react";
import './CreateProduct.css';
import FetchWithAuth from "../Auth/FetchWithAuth";

const accessToken = localStorage.getItem('accessToken');
console.log(`Access token: ${accessToken}`);

function CreateProduct() {
    const [formData, setFormData] = useState({
        brandId: '',
        product: '',
        stock: '',
        price: '',
        description: '',
        attributes: '',
        categoryNames: []
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await FetchWithAuth('http://localhost:3001/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 201) {
                setSuccessMessage('Product added successfully');
                // Reset form fields after successful submission
                setFormData({
                    brandId: '',
                    product: '',
                    stock: '',
                    price: '',
                    description: '',
                    categoryNames: []
                });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Internal Server Error');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="CreateProduct">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="brandId">Brand ID:</label>
                <input type="text" id="brandId" name="brandId" value={formData.brandId} onChange={handleChange} />
                
                <label htmlFor="product">Product:</label>
                <input type="text" id="product" name="product" value={formData.product} onChange={handleChange} />
                
                <label htmlFor="stock">Stock:</label>
                <input type="text" id="stock" name="stock" value={formData.stock} onChange={handleChange} />
                
                <label htmlFor="price">Price:</label>
                <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} />
                
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                
                <label htmlFor="attributes">Attributes:</label>
                <input type="text" id="attributes" name="attributes" value={formData.attributes} onChange={handleChange} />
                
                {/* Add more input fields for other form data */}
                
                <button type="submit">Add Product</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default CreateProduct;
