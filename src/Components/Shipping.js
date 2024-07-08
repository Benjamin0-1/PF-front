import React, { useState } from "react";
import { TextField, Button, Container, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchWithAuth from "./Auth/FetchWithAuth";

const API_URL = process.env.REACT_APP_URL;
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
            toast.error('Nickname must be at least 3 characters long.');
            return;
        }

        if (formData.country.length < 3) {
            setInvalidCountry('Please enter a valid country.');
            toast.error('Please enter a valid country.');
            return;
        }

        if (formData.city.length < 3) {
            setInvalidCity('Please enter a valid city.');
            toast.error('Please enter a valid city.');
            return;
        }

        if (!zipCodeRegex.test(formData.zip_code)) {
            setInvalidZipCode('Invalid zip code, must be numeric.');
            toast.error('Invalid zip code, must be numeric.');
            return;
        }

        try {
            const response = await FetchWithAuth(`${API_URL}/user/shipping`, {
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
                toast.error(`You already have a shipping address with the nickname: ${formData.nickname}`);
                return;
            }

            if (data.maxShipping) {
                setMaxShippingError('You have reached the limit of 10 shipping addresses.');
                toast.error('You have reached the limit of 10 shipping addresses.');
                return;
            }

            setSuccessMessage('Shipping address created successfully.');
            toast.success('Shipping address created successfully.');
            setFormData({
                nickname: '',
                country: '',
                city: '',
                zip_code: ''
            });

        } catch (error) {
            setGeneralError('An error occurred: ' + error.message);
            toast.error('An error occurred: ' + error.message);
        }
    };

    return (
        <Container className="Shipping">
            <Typography variant="h4" gutterBottom>Create Shipping Address</Typography>
            <form onSubmit={handleCreation}>
                <TextField
                    label="Nickname"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!invalidNickname}
                    helperText={invalidNickname}
                />
                <TextField
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!invalidCountry}
                    helperText={invalidCountry}
                />
                <TextField
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!invalidCity}
                    helperText={invalidCity}
                />
                <TextField
                    label="Zip Code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!invalidZipCode}
                    helperText={invalidZipCode}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Create Shipping Address
                </Button>
            </form>
            <ToastContainer />
        </Container>
    );
}

export default Shipping;
