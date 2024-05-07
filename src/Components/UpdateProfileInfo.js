import React, { useState, useEffect } from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import './UpdateProfileInfo.css';

const accessToken = localStorage.getItem('accessToken');

let URL = 'http://localhost:3001/profile/update-profile-info';

function UpdateProfileInfo() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [usernamesDontMatchError, setUsernamesDontMatchError] = useState('');
    const [usernameAlreadyExistsError, setUsernameAlreadyExistsError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        new_first_name: '',
        new_last_name: '',
        new_username: '',
        confirmNewUsername: ''
    });
    const [oldValues, setOldValues] = useState({
        first_name: '',
        last_name: '',
        username: ''
    });

    //prevent access 
    if (!accessToken) {
        window.location.href = '/login'
    };

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const response = await FetchWithAuth('http://localhost:3001/profile-info', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setOldValues({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username
                });
            } catch (error) {
                console.error("Error fetching profile info:", error);
            }
        };

        fetchProfileInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            if (!formData.new_first_name && !formData.new_last_name && !formData.new_username && !formData.confirmNewUsername) {
                setGeneralError('Must provide at least 1 value to update');
                setIsLoading(false);
                return;
            }

            const response = await FetchWithAuth(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.usernamesMustMatch) {
                setUsernamesDontMatchError('New usernames must match');
                setGeneralError('');
                setIsLoading(false);
                return;
            }

            if (data.usernameAlreadyExists) {
                setUsernameAlreadyExistsError(`Username: ${formData.confirmNewUsername} already exists`);
                setGeneralError('');
                setIsLoading(false);
                return;
            }

            setSuccessMessage('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setGeneralError('An error has occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="UpdateProfileInfo">
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" value={formData.new_first_name} onChange={(e) => setFormData({ ...formData, new_first_name: e.target.value })} />
                    Old Value: {oldValues.first_name}
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" value={formData.new_last_name} onChange={(e) => setFormData({ ...formData, new_last_name: e.target.value })} />
                    Old Value: {oldValues.last_name}
                </label>
                <br />
                <label>
                    Username:
                    <input type="text" value={formData.new_username} onChange={(e) => setFormData({ ...formData, new_username: e.target.value })} />
                    Old Value: {oldValues.username}
                </label>
                <br />
                <label>
                    Confirm New Username:
                    <input type="text" value={formData.confirmNewUsername} onChange={(e) => setFormData({ ...formData, confirmNewUsername: e.target.value })} />
                </label>
                <br />
                {generalError && <p>{generalError}</p>}
                {usernamesDontMatchError && <p>{usernamesDontMatchError}</p>}
                {usernameAlreadyExistsError && <p>{usernameAlreadyExistsError}</p>}
                {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
                <button type="submit" disabled={isLoading}>Update Profile</button>
            </form>
        </div>
    );
}

export default UpdateProfileInfo;
