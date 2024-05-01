import React, { useEffect, useState } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './PasswordRecovery.css';

const accessToken = localStorage.getItem('accessToken');
const URL = 'http://localhost:3001/reset-password-request';
const PROFILE_URL = 'http://localhost:3001/profile-info';

function PasswordRecovery() {
    const [email, setEmail] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [invalidEmailFormatError, setInvalidEmailFormatError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userNotFoundError, setUserNotFoundError] = useState('');
    const [emailPlaceholder, setEmailPlaceholder] = useState('');

    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

    const fetchUserEmail = async () => {    // <-- para que aparezca el valor del email del usuario especifico, dando una mejor experiencia.
        try {
            
            const response = await FetchWithAuth(PROFILE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                console.log(`error mostrando email: ${response.status}`);
            };

            const data = await response.json();
            setEmailPlaceholder(data.email)

        } catch (error) {
            console.log(`error mostrando email: ${error}`);
        }
    };

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
    };

    useEffect(() => {
        fetchUserEmail();
    }, []);

    // value={emailPlaceholder} <-- puede ser cambiado para que el usuario pueda manualmente introducir su email
    return (
        <div className="PasswordRecovery">
            <h1>Password Recovery</h1>
            <h5>introduce tu email para luego cambiar tu contrasena</h5>
            <div>
                <label htmlFor="email">Email:</label>
                <input
    type="email"
    placeholder={accessToken ? (emailPlaceholder || 'Enter your email') : 'Enter your email'}
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
