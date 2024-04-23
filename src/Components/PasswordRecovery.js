import React, { useState } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './PasswordRecovery.css';

const accessToken = localStorage.getItem('accessToken');
const URL = 'http://localhost:3001/reset-password-request';

function PasswordRecovery() {
    const [email, setEmail] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [invalidEmailFormatError, setInvalidEmailFormatError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userNotFoundError, setUserNotFoundError] = useState('');

    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

    const handleSubmit = async () => {
        if (!emailRegex.test(email)) {
            setInvalidEmailFormatError('Email invalido.');
            setGeneralError('');
            return;
        };

        try {
            setIsLoading(true);
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ email })
            });

            if (response.status === 404) {
                setUserNotFoundError(`No existe usuario con email: ${email}`);
                setGeneralError('');
                setSuccessMessage('');
                return
            };

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                setInvalidEmailFormatError('');
                setUserNotFoundError('');
                return;
            };

            setSuccessMessage(`Codigo de restauracion de contrasena enviado a ${email}`);

            // Navigate to the password reset form page
            handleNextPage();

        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    // Function to navigate to the password reset form page
    const handleNextPage = () => {
        window.location.href = '/resetpassword'; // Change the URL to the correct route
    }

    return (
        <div className="PasswordRecovery">
            <h1>Password Recovery</h1>
            <h5>introduce tu email para luego cambiar tu contrasena</h5>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {invalidEmailFormatError && <p>{invalidEmailFormatError}</p>}
            </div>
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Send Recovery Email'}
            </button>
            {successMessage && <p>{successMessage}</p>}
            {generalError && <p>{generalError}</p>}
            {userNotFoundError && <p>{userNotFoundError}</p>}
        </div>
    );
}

export default PasswordRecovery;
