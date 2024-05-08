import React, { useState } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './Shipping.css';

const accessToken = localStorage.getItem('accessToken');
const zipCodeRegex = /^\d+$/;

function Shipping() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [nicknameInUse, setNicknameInUse] = useState('');
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
        window.location.href = '/login';
    }

    const handleCreation = async (e) => {
        e.preventDefault();

        setInvalidNickname('');
        setInvalidCountry('');
        setInvalidCity('');
        setInvalidZipCode('');
        setNicknameInUse('');
        setMaxShippingError('');

        if (formData.nickname.length < 3) {
            setInvalidNickname('Nickname must be at least 3 characters long.');
            return;
        }

        if (formData.country.length < 3) {
            setInvalidCountry('Please enter a valid country.');
            return;
        }

        if (formData.city.length < 3) {
            setInvalidCity('Please enter a valid city.');
            return;
        }

        if (!zipCodeRegex.test(formData.zip_code)) {
            setInvalidZipCode('Invalid zip code, must be numeric.');
            return;
        }

        try {
            const response = await FetchWithAuth('http://localhost:3001/user/shipping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create shipping address.');
            }

            if (data.nicknameAlreadyInUse) {
                setNicknameInUse(`You already have a shipping address with the nickname: ${formData.nickname}`);
                return;
            }

            if (data.maxShipping) {
                setMaxShippingError('You have reached the limit of 10 shipping addresses.');
                return;
            }

            setSuccessMessage('Shipping address created successfully.');
            setFormData({
                nickname: '',
                country: '',
                city: '',
                zip_code: ''
            });

        } catch (error) {
            setGeneralError('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="Shipping">
            <h2>Create Shipping Address</h2>
            <form onSubmit={handleCreation}>
                <div>
                    <label>Nickname:</label>
                    <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    />
                    {invalidNickname && <p style={{ color: 'red' }}>{invalidNickname}</p>}
                    {nicknameInUse && <p style={{ color: 'red' }}>{nicknameInUse}</p>}
                </div>
                <div>
                    <label>Country:</label>
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                    {invalidCountry && <p style={{ color: 'red' }}>{invalidCountry}</p>}
                </div>
                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    {invalidCity && <p style={{ color: 'red' }}>{invalidCity}</p>}
                </div>
                <div>
                    <label>Zip Code:</label>
                    <input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    />
                    {invalidZipCode && <p style={{ color: 'red' }}>{invalidZipCode}</p>}
                </div>
                <button type="submit" onClick={handleCreation}>Create Shipping Address</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {maxShippingError && <p style={{ color: 'red' }}>{maxShippingError}</p>}
        </div>
    );
}

export default Shipping;
