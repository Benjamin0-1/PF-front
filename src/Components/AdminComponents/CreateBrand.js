import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth"; // <-- verifica el importe, aqui funciona.
import './CreateBrand.css'; // estilos.
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken'); // <-- verifica el importe, aqui funciona.

const PORT = process.env.PORT || 3001; // <-- esto funciona en localhost y heroku.
let URL  = `https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/brand`;
URL = 'http://localhost:3001/brand';

function CreateBrand() {
    const [brandName, setBrandName] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // if (!accessToken) {
    //     window.location.href = '/login'
    // };

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
                window.location.href = '/notadmin'
            };

        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    useEffect(() => { checkIsAdmin() }, []);

    const handleCreation = async () => {
        try {
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({brandName})
            });

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                setSuccessMessage('')
                return;
            }

            setSuccessMessage(`Marca ${brandName} creada con exito`);
            
            setGeneralError('');

        } catch (error) {
            console.log(`ERROR: ${error}`);
            setGeneralError('Ha ocurrido un error');
            setSuccessMessage('');
        }
    }

    const handleChange = (e) => {
        setBrandName(e.target.value)
    };

    return (
        <div className="create-brand-container">
            < AdminNavBar/>
            <br/>
            <br/>
            <input type="text" value={brandName} onChange={handleChange} placeholder="Nombre de la marca" className="brand-input" />
            <button onClick={handleCreation} className="create-button">Crear Marca</button>
            {generalError && <p className="error-message">{generalError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );

};

export default CreateBrand;
