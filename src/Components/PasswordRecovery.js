import React, { useEffect, useState } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import forgotPasswordStyles from  './module.PasswordRecovery.css';
const API_URL = process.env.REACT_APP_URL


function PasswordRecovery() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // verificar correos invalidos

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!emailRegex.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/reset-password-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred while requesting password reset.');
            }

            setMessage({ type: 'success', text: `A password reset link has been sent to ${email}.` });
            window.location.href = '/resetpassword'
            setEmail(''); // Clear the input after successful submission
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="PasswordRecovery-classname-unique">
            <h1>Password Recovery</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Send Recovery Email'}
                </button>
                {message && <p className={message.type === 'error' ? 'error-message' : 'success-message'}>{message.text}</p>}
            </form>
        </div>
    );
}

export default PasswordRecovery;
