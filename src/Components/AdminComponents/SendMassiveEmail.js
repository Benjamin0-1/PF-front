import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import { TextField, Button, Container, Typography, CircularProgress, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function SendMassiveEmail() {
    const [generalError, setGeneralError] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!accessToken) {
            window.location.href = '/login';
        }
        
        const checkIsAdmin = async () => {
            try {
                const response = await FetchWithAuth(`${API_URL}/profile-info`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                if (!data.is_admin) {
                    window.location.href = '/notadmin';
                }
            } catch (error) {
                toast.error(`Error: ${error.message}`);
            }
        };

        checkIsAdmin();
    }, [accessToken]);

    const sendEmails = async () => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/send-email-to-all-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ subject, message })
            });
            if (response.ok) {
                toast.success('Emails sent successfully');
                setSubject('');
                setMessage('');
            } else {
                toast.error('Failed to send emails');
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="SendMassiveEmail">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Send email to all users
                </Typography>
                <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Body"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendEmails}
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Send Emails'}
                </Button>
            </Box>
            <ToastContainer />
            <Box sx={{ mt: 4 }}>
                <AdminNavBar />
            </Box>
        </Container>
    );
}

export default SendMassiveEmail;
