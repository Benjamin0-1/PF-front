import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Logginstyles from './module.Login.css';

import fancyImageFrom from './Assets/login.webp'

const accessToken = localStorage.getItem('accessToken');

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [accountDeleted, setAccountDeleted] = useState('');
    const [notFound, setNotFound] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [otpSubmitted, setOtpSubmitted] = useState(false); 
    const navigate = useNavigate();

    if (accessToken) {
        window.location.href = '/viewprofile'
    }

    // Effect to handle OAuth2 redirect with tokens
    // esta parte es muy importante, sin esto entonces google auth NO FUNCIONA.
    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.slice(1)); // Remove the '#' part
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
    
        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
           navigate('/viewprofile'); // Navigate to the profile view
            window.location.hash = ''; // Clear the hash to clean the URL
        }
    }, [navigate]);
    
    
    
    


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, otp })
            });

            const data = await response.json();

            if (data.userHasBeenDeleted) {
                setAccountDeleted('Tu cuenta ya ha sido eliminada');
                setGeneralError('');
                return;
            };

            if (data.invalidCredentials) {
                setInvalidCredentials('Invalid credentials');
                setGeneralError('');
                return;
            }

            if (response.status === 404) {
                setNotFound('User not found');
                setAccountDeleted('');
                setGeneralError('');
                return;
            };

            if (response.status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setSuccessMessage('Login successful');
                setGeneralError('');
                window.location.href = '/home';
            }

            if (response.status === 401 && data.invalidOtp) {
                setShowOTP(true);
                setGeneralError('Invalid OTP');
            };

        } catch (error) {
            setGeneralError('Login failed. Please try again later.');
            console.error('Error:', error);
            setSuccessMessage('');
        } 
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp })
            });

            const data = await response.json();

            if (data.verified) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setSuccessMessage('OTP verification successful');
                setGeneralError('');
                window.location.href = '/home'; // Redirect to home page after successful OTP verification
            } else {
                setGeneralError('OTP verification failed');
                setSuccessMessage('');
            }
        } catch (error) {
            setGeneralError('OTP verification failed. Please try again later.');
            console.error('Error:', error);
            setSuccessMessage('');
        } finally {
            setOtpSubmitted(true);
        }
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${fancyImageFrom})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            
            <form onSubmit={handleSubmit} className="LoginForm">
                <label htmlFor="username" style={{ alignSelf: 'flex-start', marginLeft: '5%', fontWeight: 'bold' }}>Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '90%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px', display: 'block' }} />
                <label htmlFor="password" style={{ alignSelf: 'flex-start', marginLeft: '5%', fontWeight: 'bold' }}>Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '90%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px', display: 'block' }} />
                {showOTP && (
                    <div>
                        <p style={{ color: 'blue', marginLeft: '5%' }}>You have enabled OTP. Please enter the code:</p>
                        <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '90%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px', display: 'block' }} />
                        {otpSubmitted && generalError && !successMessage && <p className="error-message">{generalError}</p>}
                        <button type="submit" onClick={() => setOtpSubmitted(true)} style={{ width: '95%', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Submit OTP</button>
                    </div>
                )}
                {generalError && !showOTP && <p className="error-message">{generalError}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                {accountDeleted && <p className="error-message">{accountDeleted}</p>}
                {notFound && <p className="error-message">{notFound}</p>}
                {invalidCredentials && <p className="error-message">{invalidCredentials}</p>}
                <button type="submit" style={{ width: '95%', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px' }}>Login</button>
                <p style={{ marginTop: '10px', fontSize: '14px', marginLeft: '5%' }}>Forgot password: <a style={{ color: '#007bff', textDecoration: 'none' }} href='/passwordrecovery'>Reset password</a></p>
                <p style={{ marginTop: '10px', fontSize: '14px', marginLeft: '5%' }}>or create an account: <a style={{ color: '#007bff', textDecoration: 'none' }} href='/signup'>Signup</a></p>
                <h3 style={{ marginLeft: '130px', color: 'blue' }}>or</h3>
                <button type="button" onClick={() => { window.location.href = 'http://localhost:3001/auth/google' }} className="GoogleBtn">Continue with Google</button>
            </form>
            <br />
            <br />
        </div>
    );
    
}

export default Login;
