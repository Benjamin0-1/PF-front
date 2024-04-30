import React, { useState } from "react";
import axios from "axios";
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/login', {
                username: username,
                password: password
            });

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setSuccessMessage('Login successful');
                setError('');
                window.location.href = '/home' // <-- DEBE IR A HOME.
            } else {
                setError('Login failed. Please check your credentials.');
                setSuccessMessage('');
            }
        } catch (error) {
            setError('Login failed. Please try again later.');
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
