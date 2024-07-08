import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import { Container, Typography, CircularProgress, List, ListItem, Box, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_URL;
const accessToken = localStorage.getItem('accessToken');

function AllNewsLetterEmail() {
    const [generalError, setGeneralError] = useState('');
    const [allEmails, setAllEmails] = useState([]);
    const [noEmailsFound, setNoEmailsFound] = useState('');
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

    useEffect(() => {
        const fetchAllEmails = async () => {
            setIsLoading(true);
            try {
                const response = await FetchWithAuth(`${API_URL}/all-newsletter-emails`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();

                if (data.length === 0) {
                    setNoEmailsFound('Aun no hay ningun email en newsletter');
                    setGeneralError('');
                    setAllEmails([]);
                    return;
                }

                setAllEmails(data);
                setNoEmailsFound('');

            } catch (error) {
                toast.error(`Error: ${error.message}`);
                setGeneralError('Ha ocurrido un error.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllEmails();
    }, []);

    return (
        <Container maxWidth="sm" className="AllNewsletterEmail-an-e">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    All Newsletter Emails
                </Typography>
                <Typography variant="h6" component="h4" gutterBottom>
                    Total: {allEmails.length}
                </Typography>
                {isLoading && <CircularProgress />}
                {generalError && <Alert severity="error">{generalError}</Alert>}
                {noEmailsFound && <Alert severity="info">{noEmailsFound}</Alert>}
                {allEmails.length > 0 && (
                    <List>
                        {allEmails.map((email) => (
                            <ListItem key={email.id}>{email.email}</ListItem>
                        ))}
                    </List>
                )}
                <Box sx={{ mt: 4 }}>
                    <AdminNavBar />
                </Box>
            </Box>
            <ToastContainer />
        </Container>
    );
}

export default AllNewsLetterEmail;
