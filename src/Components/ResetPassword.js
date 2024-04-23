import React, { useState } from 'react';
import FetchWithAuth from './Auth/FetchWithAuth';
import './ResetPassword.css';

const accessToken = localStorage.getItem('accessToken');

const URL = 'http://localhost:3001/reset-password';

function ResetPassword() {
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [expiredTokenError, setExpiredTokenError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ resetToken, newPassword, confirmNewPassword })
            });

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                return;
            }

            setSuccessMessage('Contrasena cambiada con exito');

        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

    return (
        <div className='ResetPassword'>
            <h2>Reset Password</h2>
            <h5>Introduce el codigo que enviado a tu email.</h5>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="resetToken">Reset Token:</label>
                    <input
                        type="text"
                        id="resetToken"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {generalError && <p className="error">{generalError}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            {expiredTokenError && <p className="error">{expiredTokenError}</p>}
        </div>
    )
};

export default ResetPassword;
