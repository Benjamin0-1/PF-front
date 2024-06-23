import React, { useState, useEffect } from "react";
import createAproductforEveryone from  './module.CreateProduct.css';
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');
console.log(`Access token: ${accessToken}`);

const API_URL = process.env.REACT_APP_URL

function CreateProduct() {
    const [formData, setFormData] = useState({
        brandId: '',
        product: '',
        stock: '',
        price: '',
        description: '',
        image: '',
        attributes: '',
        categoryNames: []
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [brandsDetails, setBrandsDetails] = useState([]);
    const [noBrandFoundError, setNoBrandFoundError] = useState('');
    const [invalidDescriptionError, setInvalidDescriptionError] = useState('');
    const [invalidPriceError, setInvalidPriceError] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const [invalidStockFormatError, setInvalidStockFormatError] = useState('');
    const [invalidBrandIdFormatError, setInvalidBrandIdFormatError] = useState('');
    const [invalidProductLengthError, setInvalidProductLengthError] = useState('');
    const [invalidAttributeError, setInvalidAttributeError] = useState('');
    const [productAlreadyExists, setProductAlreadyExists] = useState('');

    // funcion para asegurarse de que el usuario es admin.
    // si es que no son admins, seran redirigidos a una pagina que simplemente les mostrara que no son admins.
    const checkIsAdmin = async () => {
        try {
            
            const response = await FetchWithAuth(`${API_URL}/profile-info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            if (!data.is_admin) {
                window.location.href = '/notadmin'
            };

        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    // revisar si es admin inmediatamente. <-- debes redigirlo a una pagina existente en tu proyecto.
    useEffect(() => {
        checkIsAdmin();
    }, []);

    useEffect(() => {
        const fetchBrandsDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/allbrands`);
                const data = await response.json();

                if (response.ok) {
                    setBrandsDetails(data);
                } else {
                    console.log(`Error fetching brands: ${response.status}`);
                }
            } catch (error) {
                console.log(`Error fetching brands: ${error}`);
            }
        };

        fetchBrandsDetails();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        
        try {
            
            //validaciones de input para todos los campos.

            const brandIdRegex = /^\d+$/;
            if (!brandIdRegex.test(formData.brandId)) {
                setInvalidBrandIdFormatError('El de marca debe ser un numero entero.');
                setSuccessMessage('');
                return;
            };

            if (formData.product.length < 3) {
                setInvalidProductLengthError('El producto debe tener al menos 3 caracteres');
                setSuccessMessage('');
                setInvalidBrandIdFormatError('');
                return;
            };

            const stockRegex = /^\d+$/;
             if (!stockRegex.test(formData.stock)) {
            setInvalidStockFormatError('Stock debe ser un numero entero.');
            setSuccessMessage('');
            setInvalidProductLengthError('');
            return;  
        };

            const priceRegex = /^\d+(\.\d+)?$/;
            if (!priceRegex.test(formData.price)) {
                setInvalidPriceError('El precio es invalido');
                setInvalidStockFormatError('');
                setErrorMessage('');
                setInvalidDescriptionError('');
                setSuccessMessage('');
                return;
            };


            if (formData.description.length < 10) {
                setInvalidDescriptionError('La descripcion debe ser de al menos 10 caracteres');
                setInvalidPriceError('');
                setErrorMessage('');
                setNoBrandFoundError('');
                setSuccessMessage('');
                return;
            };

            if (formData.attributes.length === 0) {
                setInvalidAttributeError('Debe incluir al menos 1 atributo');
                setInvalidDescriptionError('');
                setSuccessMessage('');
                return
            };

            
            const response = await FetchWithAuth(`${API_URL}/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.productAlreadyExists) {
                setProductAlreadyExists(`Product: ${formData.product} already exists !`)
                alert('product already exists')
                return
            }

            if (!response.ok) {
                setErrorMessage('Ha ocurrido un error.')
                return;
            };
            if (response.status === 400) {
                setErrorMessage('Ha ocurrido un error')
                return;
            }

            if (response.status === 201) {
                setSuccessMessage('Product added successfully');
                setFormData({
                    brandId: '',
                    product: '',
                    stock: '',
                    price: '',
                    description: '',
                    image: '',
                    attributes: '',
                    categoryNames: [] 
                });
    
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Ha ocurrido un error');
            }
        } finally{
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "categoryNames") {
            
            const categoryStrings = value.split(',').map(category => category.trim());
           
            const categories = categoryStrings.map(categoryString => {
              
                const [name, description] = categoryString.split(':');
                return { name, description };
            });
            
            setFormData(prevState => ({
                ...prevState,
                [name]: categories
            }));
        } else {
            
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    
    
    

    return (
        <div className="CreateProduct">
           
            <br/>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                {productAlreadyExists && <p style={{color: 'red'}}>{productAlreadyExists}</p>}
                {isLoading && <p>Sending emails and creating product....</p>}
                <label htmlFor="brandId">Brand ID:</label>
                <input type="text" id="brandId" name="brandId" value={formData.brandId} onChange={handleChange} />
                {invalidBrandIdFormatError && <p style={{color: 'red'}}>{invalidBrandIdFormatError}</p>}
                
                <label htmlFor="product">Product:</label>
                <input type="text" id="product" name="product" value={formData.product} onChange={handleChange} />
                {invalidProductLengthError && <p style={{color: 'red'}}>{invalidProductLengthError}</p>}
                
                <label htmlFor="stock">Stock:</label>
                <input type="text" id="stock" name="stock" value={formData.stock} onChange={handleChange} />
                {invalidStockFormatError && <p style={{color: 'red'}}>{invalidStockFormatError}</p>}
                
                <label htmlFor="price">Price:</label>
                <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} />
                {invalidPriceError && <p style={{color: 'red'}}>{invalidPriceError}</p>}
                
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                {invalidDescriptionError && <p style={{color: 'red'}}>{invalidDescriptionError}</p>}

                <label htmlFor="image">Image URL:</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
                
                <label htmlFor="attributes">Attributes:</label>
                <input type="text" id="attributes" name="attributes" value={formData.attributes} onChange={handleChange} />
                {invalidAttributeError && <p style={{color: 'red'}}>{invalidAttributeError}</p>}

                <label htmlFor="Category">Category</label>
                                <input 
                    type="text" 
                    id="categoryNames" 
                    name="categoryNames" 
                    value={formData.categoryNames.map(category => category.description ? `${category.name}:${category.description}` : category.name).join(', ')} 
                    onChange={handleChange} 
                />


    
                
                {/* Add more input fields for other form data */}

                {productAlreadyExists && <p style={{color: 'red'}}>{productAlreadyExists}</p>}
                
                <button type="submit">Add Product</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <p style={{color: 'red'}}>{noBrandFoundError}</p>
            {isLoading && <p> <strong> Sending emails and creating product.... </strong></p>}
    
            <div className="BrandList">
                <h2>Brands</h2>
                            {brandsDetails.map(brand => (
                <div key={brand.id} className="BrandItem">
                    <span className="BrandName">Brand Name: {brand.brand}</span>
                    <span className="BrandId">  ID: {brand.id}</span>
                </div>
            ))}

            </div>
            < AdminNavBar/>
        </div>
    );
    
}

export default CreateProduct;