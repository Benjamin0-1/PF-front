import React, { useState, useEffect } from "react";
import './CreateProduct.css';
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');
console.log(`Access token: ${accessToken}`);

// mejoras: <-- error brandId no existe. Poder ver brands y sus ids para mejorar la experiencia

let BRAND_DETAIL = `https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/allbrands`;
let PROFILE_INFO_URL = 'https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/profile-info';

BRAND_DETAIL = 'http://localhost:3001/allbrands';
PROFILE_INFO_URL = 'http://localhost:3001/profile-info';

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
    const [brandsDetails, setBrandsDetails] = useState([]);
    const [noBrandFoundError, setNoBrandFoundError] = useState('');
    const [invalidDescriptionError, setInvalidDescriptionError] = useState('');
    const [invalidPriceError, setInvalidPriceError] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const [invalidStockFormatError, setInvalidStockFormatError] = useState('');
    const [invalidBrandIdFormatError, setInvalidBrandIdFormatError] = useState('');
    const [invalidProductLengthError, setInvalidProductLengthError] = useState('');
    const [invalidAttributeError, setInvalidAttributeError] = useState('');

    // funcion para asegurarse de que el usuario es admin.
    // si es que no son admins, seran redirigidos a una pagina que simplemente les mostrara que no son admins.
    const checkIsAdmin = async () => {
        try {
            
            const response = await FetchWithAuth(PROFILE_INFO_URL, {
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
                const response = await fetch(BRAND_DETAIL);
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
                return;
            };

            if (formData.product.length < 3) {
                setInvalidProductLengthError('El producto debe tener al menos 3 caracteres');
                setInvalidBrandIdFormatError('');
                return;
            };

            const stockRegex = /^\d+$/;
             if (!stockRegex.test(formData.stock)) {
            setInvalidStockFormatError('Stock debe ser un numero entero.');
            setInvalidProductLengthError('');
            return;  
        };

            const priceRegex = /^\d+(\.\d+)?$/;
            if (!priceRegex.test(formData.price)) {
                setInvalidPriceError('El precio es invalido');
                setInvalidStockFormatError('');
                setErrorMessage('');
                setInvalidDescriptionError('');
                return;
            };


            if (formData.description.length < 10) {
                setInvalidDescriptionError('La descripcion debe ser de al menos 10 caracteres');
                setInvalidPriceError('');
                setErrorMessage('');
                setNoBrandFoundError('');
                return;
            };

            if (formData.attributes.length === 0) {
                setInvalidAttributeError('Debe incluir al menos 1 atributo');
                setInvalidDescriptionError('');
                return
            };

            
            const response = await FetchWithAuth('https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

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
            // If the input field is for categories, split the value by comma to get an array of category strings
            const categoryStrings = value.split(',').map(category => category.trim());
            // Map over each category string to construct an array of category objects with name and description properties
            const categories = categoryStrings.map(categoryString => {
                // Assuming each category string is in the format of "name:description"
                const [name, description] = categoryString.split(':');
                return { name, description };
            });
            // Update the state with the array of category objects
            setFormData(prevState => ({
                ...prevState,
                [name]: categories
            }));
        } else {
            // For other input fields, update the state normally
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
                
                <button type="submit">Add Product</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <p style={{color: 'red'}}>{noBrandFoundError}</p>
            {isLoading && <p>Sending emails and creating product....</p>}
    
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
