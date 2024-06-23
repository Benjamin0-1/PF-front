import React, { useState } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './ReportProduct.css';
const API_URL = process.env.REACT_APP_URL

// VERIFICAR TODOS LOS IMPORTES YA QUE PUEDEN TENER OTROS CAMINOS EN TU PC.

const accessToken = localStorage.getItem('accessToken');

function ReportProduct() {
    const [productId, setProductId] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [productNotFoundError, setProductNotFoundError] = useState('');

    const handleReport = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/products/report/id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId })
            });

            if (response.status === 404) {
                setProductNotFoundError(`El producto con id: ${productId} no existe`);
                setSuccessMessage('');
                setGeneralError('');
            } else if (response.status === 400) {
                setGeneralError(`Ya has reportado este producto con id: ${productId}`);
                setSuccessMessage('');
                setProductNotFoundError('');
            } else if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                setSuccessMessage('');
                setProductNotFoundError('');
            } else {
                setSuccessMessage(`Producto con id: ${productId} reportado con éxito`);
                setProductNotFoundError('');
                setGeneralError('');
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            setGeneralError('Ha ocurrido un error');
            setSuccessMessage('');
            setProductNotFoundError('');
        }
    };

    return (
        <div className="report-product-container">
            <h2>Reportar un producto</h2>
            <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="ID del producto"
                className="product-id-input"
            />
            <button onClick={handleReport} className="report-button">Reportar Producto</button>
            {generalError && <p className="error-message">{generalError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {productNotFoundError && <p className="error-message">{productNotFoundError}</p>}
        </div>
    );
}

export default ReportProduct;
