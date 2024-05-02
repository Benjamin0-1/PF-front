// this component must dinamically 
// render the product values via useEffect.
// that way, the user knows exactly what they are reporting
// it also needs a 'reason' field.
// this can then dinamically be shown inside a product detail page.

import React, {useState, useEffect} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './ReportProductByName.css';

let REPORT_URL = ''; // <-- falta agregar en el servidor.

const accessToken = localStorage.getItem('accessToken');

function ReportProductByName() {
    const [productName, setProductName] = useState('');
    const [reason, setReason] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    };

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

    const handleReport = async (e) => {
        e.preventDefault();

        try {
            
            const response = await FetchWithAuth(REPORT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(reason)
            });

            setSuccessMessage('Producto reportado con exito');
            setGeneralError('');
            setProductName('');
            setReason('');

        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Error reportando producto')
            setSuccessMessage('');
        };
    }
    
    return (
        <div className="ReportProductByName">
            <form onSubmit={handleReport}>
                <label htmlFor="productName">Nombre del producto:</label>
                <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <label htmlFor="reason">Motivo del reporte:</label>
                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
                <button type="submit">Reportar Producto</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
        </div>
    );


};

export default ReportProductByName;
