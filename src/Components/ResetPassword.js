import React, { useState } from 'react';
import FetchWithAuth from './Auth/FetchWithAuth';
import resetPassowordStyles from './module.ResetPassword.css';


function ResetPassword() {
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        if (newPassword !== confirmNewPassword) {
            setGeneralError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, newPassword, confirmNewPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccessMessage('Password reset successful. Please log in with your new password.');
        } catch (error) {
            console.error('ERROR:', error);
            setGeneralError(error.message);
        }
    };

    return (
        <div className='ResetPassword'>
    
          
            <form onSubmit={handleSubmit}>
                <h5>Enter the code sent to your email</h5>
                <div>
                    <label htmlFor="resetToken">Reset Token:</label>
                    <input
                        type="text"
                        id="resetToken"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        aria-label="Reset Token"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        aria-label="New Password"
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        aria-label="Confirm New Password"
                    />
                </div>
                <button type="submit">Reset Password</button>
                {generalError && <p className="error">{generalError}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;