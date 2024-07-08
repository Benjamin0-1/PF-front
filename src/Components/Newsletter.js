import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_URL = process.env.REACT_APP_URL;

function Newsletter() {
    const [email, setEmail] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailAlreadyAddedError, setEmailAlreadyAddedError] = useState('');
    const [emailAlreadyInUsers, setEmailAlreadyInUsers] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/newsletter/${email}`, {
                method: 'POST',
            });

            const data = await response.json();
            if (data.emailAlreadyAdded) {
                setEmailAlreadyAddedError('Este email ya se encuentra agregado.');
                setGeneralError('');
                setSuccessMessage('');
                toast.error('Este email ya se encuentra agregado.');
                return;
            }

            if (data.emailInUserModel) {
                setEmailAlreadyInUsers('Este email ya pertenece a un usuario registrado');
                setEmailAlreadyAddedError('');
                setSuccessMessage('');
                setGeneralError('');
                toast.error('Este email ya pertenece a un usuario registrado');
                return;
            }

            setIsLoading(true); 

            setSuccessMessage('Email agregado con exito.');
            setGeneralError('');
            setEmailAlreadyAddedError('');
            setEmailAlreadyInUsers('');
            toast.success('Email agregado con exito.');
        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Ha ocurrido un error');
            setSuccessMessage('');
            setEmailAlreadyAddedError('');
            setEmailAlreadyInUsers('');
            toast.error('Ha ocurrido un error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container className="newsletter-container">
            <Typography variant="h4" component="h2" gutterBottom>
                Subscribe to Our Newsletter
            </Typography>

            <form onSubmit={handleSubmit} className="newsletter-form">
                <TextField
                    fullWidth
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                    sx={{ mb: 2 }}
                />
                
                <Button type="submit" variant="contained" color="primary" className="newsletter-button">
                    Subscribe
                </Button>
            </form>

            <ToastContainer />
        </Container>
    );
}

export default Newsletter;
