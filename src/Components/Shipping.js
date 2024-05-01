import React, {useState, useEffect} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './Shipping.css';

const accessToken = localStorage.getItem('accessToken');

const zipCodeRegex = /^\d+$/;


function Shipping() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [nicknameInUse, setnicknameInUse] = useState('');
    const [invalidCountry, setInvalidCountry] = useState('');
    const [invalidNickname, setInvalidNickname] = useState('');
    const [invalidCity, setInvalidCity] = useState('');
    const [invalidZipCode, setInvalidZipCode] = useState('');
    const [maxShippingError, setMaxShippingError] = useState('');

    const [formData, setFormData] = useState({
        nickname: '',
        country: '',
        city: '',
        zip_code: ''
    });

    if (!accessToken) {
        window.location.href = '/login'
    };


    const handleCreation = async (e) => {

        e.preventDefault();

        try {

            if (formData.nickname.length < 3) {
                setInvalidNickname('Apodo debe contener al menos 3 caracteres');
                setGeneralError('');
                return
            };

            if (formData.country.length < 3) {
                setInvalidCountry('Ingrese un pais valido');
                setInvalidNickname('');
                setGeneralError('');
            };

            if (formData.city.length < 3) {
                setInvalidCity('Ingrese una ciudad valida');
                setInvalidCity('');
                setGeneralError('');
                return
            };

            if (formData.zip_code.length === 0 || !zipCodeRegex.test(formData.zip_code)) {
                setInvalidZipCode('codigo postal invalido, debe ser numero');
                setInvalidCountry('');
                setInvalidNickname('');
                setGeneralError('');
                return
            };
            
            const response = await FetchWithAuth('http://localhost:3001/user/shipping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.nicknameAlreadyInUse) {
                setnicknameInUse(`Ya tienes una direccion con el apodo: ${formData.nickname}`);
                setGeneralError('');
                return
            };

            if (data.maxShipping) {
                setMaxShippingError('Ya has alcanzado el limite de 10 direcciones de envio');
                setnicknameInUse('');
                setGeneralError('');
                return;
            };

            setSuccessMessage('Direccion de envio creada con exito');
            setGeneralError('');
            setInvalidCountry('');
            

        } catch (error) {
            console.log();
            setGeneralError('Ha ocurrido un error');
            setSuccessMessage('');
            setInvalidCountry('');
            setInvalidNickname('');
            setnicknameInUse('');
            setInvalidZipCode('');
        };
    };


    return (
        <div className="Shipping">
            <h2>Crear dirección de envío</h2>
            <form onSubmit={handleCreation}>
                <div>
                    <label>Apodo:</label>
                    <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    />
                    {invalidNickname && <p style={{ color: 'red' }}>{invalidNickname}</p>}
                    {nicknameInUse && <p style={{ color: 'red' }}>{nicknameInUse}</p>}
                </div>
                <div>
                    <label>País:</label>
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                    {invalidCountry && <p style={{ color: 'red' }}>{invalidCountry}</p>}
                </div>
                <div>
                    <label>Ciudad:</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>
                <div>
                    <label>Código Postal:</label>
                    <input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    />
                    {invalidZipCode && <p style={{ color: 'red' }}>{invalidZipCode}</p>}
                </div>
                <button type="submit">Crear Dirección de Envío</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {maxShippingError && <p style={{ color: 'red' }}>{maxShippingError}</p>}
        </div>
    );
};




export default Shipping;
