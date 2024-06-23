import React, {useState, useEffect} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './UpdateProfilePassword.css';
const API_URL = process.env.REACT_APP_URL

const accessToken = localStorage.getItem('accessToken');


function UpdateProfilePassword() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] =  useState('');
    const [missingFields, setMissingFields] = useState('');
    const [passwordTooShort, setPasswordTooShort] = useState('');
    const [invalidOldPassword, setInvalidOldPassword] = useState('');
    const [passwordsDontMatch, setPasswordsDontMatch] = useState('');

    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    if (!accessToken) {
        window.location.href = '/login'
    }; 


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        try {
            
            const response = await FetchWithAuth(`${API_URL}/user/update-user-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.missingInfo) {
                setMissingFields('Missing required fields')
                setGeneralError('');
                setSuccessMessage('');
                setIsLoading(false);
                return
            };

            if (data.passwordTooShort) {
                setPasswordTooShort('Passwords must be at least 8 characters in length');
                setGeneralError('');
                setSuccessMessage('');
                setMissingFields('');
                setIsLoading(false);
                return
            };

            if (data.invalidOldPassword) {
                setInvalidOldPassword('Old password is incorrect');
                setPasswordTooShort('');
                setGeneralError('');
                setSuccessMessage('');
                setIsLoading(false);
                return;
            };

            if (data.passwordsDontMatch) {
                setPasswordsDontMatch('New passwords do not match')
                setInvalidOldPassword('');
                setGeneralError('');
                setSuccessMessage('');
                setIsLoading(false);
                return;
            };

            setSuccessMessage('Password updated successfully');
            setFormData({
                password: '',
                newPassword: '',
                confirmNewPassword: ''
            });
             

        } catch (error) {
            console.log(`error from catch: ${error}`);
            setGeneralError('An error has ocurred')
            setSuccessMessage('');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="UpdateProfilePassword">
            <form onSubmit={handleSubmit}>
                <label>
                    Current Password:
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </label>
                <label>
                    New Password:
                    <input type="password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} />
                </label>
                <label>
                    Confirm New Password:
                    <input type="password" value={formData.confirmNewPassword} onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })} />
                </label>
                {generalError && <p className="error">{generalError}</p>}
                {missingFields && <p className="error">{missingFields}</p>}
                {passwordTooShort && <p className="error">{passwordTooShort}</p>}
                {invalidOldPassword && <p className="error">{invalidOldPassword}</p>}
                {passwordsDontMatch && <p className="error">{passwordsDontMatch}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <button type="submit" disabled={isLoading}>Update Password</button>
            </form>
        </div>
    );

 };






export default UpdateProfilePassword;
