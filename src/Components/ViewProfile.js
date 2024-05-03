import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './ViewProfile.css';

const accessToken = localStorage.getItem('accessToken');


let URL = 'https://proyecto-final-backend-0e01b3696ca9.herokuapp.com/profile-info';

let PROFILE_URL = 'http://localhost:3001/profile-info';




function ViewProfile() {
    const [profileInfo, setProfileInfo] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    }

    const fetchProfile = async () => {
        try {
            const response = await FetchWithAuth(PROFILE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
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
        <div className="ViewProfile">
            <h2>Profile</h2>
            <div>
                <p>First name: {profileInfo.first_name || 'Error mostrando nombre'}</p>
                <p>Last name: {profileInfo.last_name || 'Error mostrando apellido'}</p>
                <p>Username: {profileInfo.username}</p>
                <p>Email: {profileInfo.email}</p>
                <p>Admin: {profileInfo.is_admin ? 'Yes' : 'No'}</p>
                <p>Two Factor Authentication: {profileInfo.two_factor_authentication ? 'Enabled' : 'Disabled'}</p>
                <p>Te uniste en la fecha: {profileInfo.createdAt}</p>
                <br />

                {isButtonVisible && <button onClick={() => window.location.href='/activate2fa'}> Enable Two-Factor Authentication </button>}

               
            </div>
            {generalError && <p>{generalError}</p>}
        </div>
    );
    
}

export default ViewProfile;
