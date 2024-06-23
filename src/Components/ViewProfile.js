import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import userProfileStyles from './module.ViewProfile.css';
import AdminButtonIcon from "./AdminButtonIcon";
import ViewCartIcon from "./ViewCartIcon";
import { Button, Card, CardContent, Typography, Box } from '@mui/material'; // ESTILOS
const API_URL = process.env.REACT_APP_URL


const accessToken = localStorage.getItem('accessToken');


function ViewProfile() {
    const [profileInfo, setProfileInfo] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState('');

   if (!accessToken) {
    window.location.href = '/login'
   }

    const fetchProfile = async () => {
        try {
            const response = await FetchWithAuth(`${API_URL}/profile-info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            //    credentials: 'include' // <===
            });

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error.');
                return;
            };

            const data = await response.json();

            // enable button for admins.
            if (data.is_admin && !data.two_factor_authentication) {
                setIsButtonVisible(true)
            };

            setProfileInfo(data);

        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []); 

    return (
        <Box className="ViewProfile" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                        Profile
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            First name: {profileInfo.first_name || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            Last name: {profileInfo.last_name || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            Username: {profileInfo.username || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            Email: {profileInfo.email || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            Admin: {profileInfo.is_admin ? 'Yes' : 'No'}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            Two Factor Authentication: {profileInfo.two_factor_authentication ? 'Enabled' : 'Disabled'}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body1">
                            Joined on: {profileInfo.createdAt || 'N/A'}
                        </Typography>
                    </Box>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
                    {isButtonVisible && (
                        <Button variant="contained" onClick={() => window.location.href='/activate2fa'}>
                            Enable Two-Factor Authentication
                        </Button>
                    )}
                    <Button variant="outlined" onClick={() => {window.location.href='/updateprofileinfo'}}>
                        Update Profile Info
                    </Button>
                    <Button variant="outlined" onClick={() => {window.location.href='/updateprofilepassword'}} sx={{ ml: 2 }}>
                        Update Password
                    </Button>
                </Box>
                {generalError && <Typography color="error">{generalError}</Typography>}
            </Card>
            <ViewCartIcon />
            <AdminButtonIcon />
        </Box>
    );
}

    


export default ViewProfile;
