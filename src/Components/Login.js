import React, { useState } from "react";
import './Login.css';

const accessToken = localStorage.getItem('accessToken');

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [accountDeleted, setAccountDeleted] = useState('');
    const [notFound, setNotFound] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState('');

    if (accessToken) {
        window.location.href = '/viewprofile';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.userHasBeenDeleted) {
                setAccountDeleted('Tu cuenta ya ha sido eliminada');
                setGeneralError('');
                return;
            };

            if (data.invalidCredentials) {
                setInvalidCredentials('Credenciales invalidos')
            }

            if (response.status === 404) {
                setNotFound('Usuario no encontrado');
                setAccountDeleted('');
                setGeneralError('');
                return;
            };

            if (response.status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setSuccessMessage('Login successful');
                setGeneralError('');
                window.location.href = '/home'; // DEBE IR A HOME.
            }

        } catch (error) {
            setGeneralError('Login failed. Please try again later.');
            console.error('Error:', error);
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="LoginForm"> 
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {accountDeleted && <p style={{ color: 'red' }}>{accountDeleted}</p>}
                {notFound && <p style={{ color: 'red' }}>{notFound}</p>}
                <button type="submit">Login</button>
                <p style={{ marginTop: '10px', fontSize: '14px' }}>Forgot password: <a style={{ textDecoration: 'none', color: 'blue' }} href='/passwordrecovery'>Reset password</a></p>
                <p style={{ marginTop: '10px', fontSize: '14px' }}>or create an account: <a style={{ textDecoration: 'none', color: 'blue' }} href='/signup'>Signup</a></p>
            </form>

        </div>
    );
    
}

export default Login;
