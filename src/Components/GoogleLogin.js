import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_URL

function GoogleLogin() {
    const [object, setObject] = useState([]);
    const [notFound, setNotFound] = useState('');
    const [badResponse, setBadResponse] = useState('');

    // Function to open Google authentication window
    const handleLogin = () => {
        window.open(`${API_URL}/auth/google`, '_self');
    };


    // NEED TO SAVE TOKENS ! localeStoraga.setItem('accessToken') & 'refreshToken';


    return (
        <div>
            <h2 style={{ marginLeft: '100px' }}>Google Login</h2>
            <button style={{ marginLeft: '200px', marginBottom: '200px' }} onClick={handleLogin}>Login with Google</button>
            {notFound && <p style={{marginLeft: '200px', color: 'red'}}>{notFound}</p>}
            {badResponse && <p style={{marginLeft: '200px', color: 'red'}}>{badResponse}</p>}
            {/* Render the object state */}
            <pre>{JSON.stringify(object, null, 2)}</pre>
        </div>
    );

}

export default GoogleLogin;

/*



import React, { useState } from "react";

function GoogleLogin() {
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);

    // Function to handle Google login
    const handleLogin = () => {
        // Redirect to Google authentication endpoint
        window.location.href = 'http://localhost:3001/auth/google';
    };

    // Function to handle creating user on the server
    const createUserOnServer = async () => {
        try {
            // Make a POST request to create-google-user endpoint on the server
            const response = await fetch('http://localhost:3001/create-google-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken }) // Send the Google access token to the server
            });

            if (!response.ok) {
                throw new Error('Failed to create user on server');
            }

            const data = await response.json();
            // Handle response data if needed

        } catch (error) {
            setError(error.message);
        }
    };

    // Function to handle extracting access token from URL query params
    const getAccessTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('accessToken');
    };

    // Check if access token is present in URL query params
    const accessTokenFromUrl = getAccessTokenFromUrl();
    if (accessTokenFromUrl) {
        // Set access token if present in URL
        setAccessToken(accessTokenFromUrl);
        // Call function to create user on the server
        createUserOnServer();
    }

    return (
        <div>
            <h2>Google Login</h2>
            <button onClick={handleLogin}>Login with Google</button>
            {accessToken && (
                <div>
                    <p>Logged in successfully!</p>
                    <p>Access Token: {accessToken}</p>
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default GoogleLogin;




 */