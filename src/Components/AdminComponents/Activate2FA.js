import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './Activate2FA.css';

const accessToken = localStorage.getItem('accessToken');
let TWO_FA_URL = 'http://localhost:3001/2fa/activate-and-generate-secret';

function Active2FA() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);

    // prevent access
    // if (!accessToken) {
    //     window.location.href = '/login'
    // };

    useEffect(() => {
        const checkIsAdmin = async () => {
            try {
                const response = await FetchWithAuth('http://localhost:3001/profile-info', {
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
                console.log(`error: ${error}`);
            }
        };

        checkIsAdmin();
    }, []);

    const handleEnable = async () => {
        try {
            const response = await FetchWithAuth(TWO_FA_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setResponseData(data);
                setGeneralError('');
            } else {
                setGeneralError(data.message || 'Failed to enable 2FA');
            }
        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Error enabling 2FA. Please try again later.');
        }
    };

    return(
        <div className="Activate2FA">
            <h2>Enable Two-Factor Authentication</h2>
            {generalError && <p className="error">{generalError}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            {isLoading && <p>Loading...</p>}
            {responseData && responseData.secret &&
                <div className="qr-code-container">
                    <p>Scan the QR code or copy the secret key to your authenticator app:</p>
                    <QRCode value={responseData.secret} />
                    <p>Secret Key: {responseData.secret}</p>
                </div>
            }
            <button onClick={handleEnable}>Enable 2FA</button>
        </div>
    );
}

export default Active2FA;
