import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import AllNewsLetterEmail from "./AllNewsLetterEmail";
import ProfileIcon from "../ProfileIcon";
import { Container, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function EmailNewsletter() {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [allEmailsSent, setAllEmailsSent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    if (!accessToken) {
        window.location.href = '/login';
    }

    useEffect(() => {
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

    const handleEmailSending = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/email-all-newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ subject, body })
            });

            if (response.status === 200) {
                const data = await response.json();
                setAllEmailsSent(data.sentEmails);
                toast.success(data.successMessage);
            } else {
                toast.error('Failed to send emails. Please try again.');
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="EmailNewsletter">
            <ProfileIcon />
            <AdminNavBar />
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Email All Newsletter Subscribers
                </Typography>
                <form onSubmit={handleEmailSending}>
                    <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Body"
                        variant="outlined"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        margin="normal"
                        required
                        multiline
                        rows={4}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Send Emails'}
                    </Button>
                </form>
                {isLoading && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Sending emails...
                    </Typography>
                )}
                {allEmailsSent.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" component="h3">
                            Emails Sent:
                        </Typography>
                        <ul>
                            {allEmailsSent.map((email, index) => (
                                <li key={index}>{email}</li>
                            ))}
                        </ul>
                    </Box>
                )}
            </Box>
            <AllNewsLetterEmail />
            <ToastContainer />
        </Container>
    );
}

export default EmailNewsletter;
