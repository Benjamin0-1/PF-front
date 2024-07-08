import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Logginstyles from './module.Login.css';
import fancyImageFrom from './Assets/login.webp';

const accessToken = localStorage.getItem('accessToken');
const API_URL = process.env.REACT_APP_URL;



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
        window.location.href = '/viewprofile';
    }

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
            const response = await fetch(`${API_URL}/login`, {
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
                toast.error('Tu cuenta ya ha sido eliminada');
                return;
            };

            if (data.invalidCredentials) {
                setInvalidCredentials('Invalid credentials');
                setGeneralError('');
                toast.error('Invalid credentials');
                return;
            }

            if (response.status === 404) {
                setNotFound('User not found');
                setAccountDeleted('');
                setGeneralError('');
                toast.error('User not found');
                return;
            };

            if (response.status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setSuccessMessage('Login successful');
                setGeneralError('');
                toast.success('Login successful');
                window.location.href = '/home';
            }

            if (response.status === 401 && data.invalidOtp) {
                setShowOTP(true);
                setGeneralError('Invalid OTP');
                toast.error('Invalid OTP');
            };

            if (data.accountBanned) {
                setGeneralError('Your account has been banned.');
                toast.error('Your account has been banned.');
                return;
            }

        } catch (error) {
            setGeneralError('Login failed. Please try again later.');
            console.error('Error:', error);
            setSuccessMessage('');
            toast.error('Login failed. Please try again later.');
        } 
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/verify`, {
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
                toast.success('OTP verification successful');
                window.location.href = '/home'; // Redirect to home page after successful OTP verification
            } else {
                setGeneralError('OTP verification failed');
                setSuccessMessage('');
                toast.error('OTP verification failed');
            }
        } catch (error) {
            setGeneralError('OTP verification failed. Please try again later.');
            console.error('Error:', error);
            setSuccessMessage('');
            toast.error('OTP verification failed. Please try again later.');
        } finally {
            setOtpSubmitted(true);
        }
    };

    return (
        <Container className="login-container" style={{ backgroundImage: `url(${fancyImageFrom})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} className="LoginForm">
                <Typography variant="h5" gutterBottom>Login</Typography>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {showOTP && (
                    <div>
                        <Typography color="primary">You have enabled OTP. Please enter the code:</Typography>
                        <TextField
                            label="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        {otpSubmitted && generalError && !successMessage && <Typography color="error">{generalError}</Typography>}
                        <Button type="submit" variant="contained" color="primary" fullWidth onClick={() => setOtpSubmitted(true)} sx={{ mt: 2 }}>Submit OTP</Button>
                    </div>
                )}

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
                <Typography variant="body2" sx={{ mt: 2 }}>Forgot password? <a href='/passwordrecovery' style={{ color: '#007bff', textDecoration: 'none' }}>Reset password</a></Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>or create an account: <a href='/signup' style={{ color: '#007bff', textDecoration: 'none' }}>Signup</a></Typography>

            </form>
            <ToastContainer />
        </Container>
    );
}

export default Login;
