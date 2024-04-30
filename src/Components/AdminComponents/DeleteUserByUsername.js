import React, { useEffect, useState } from "react";
import './DeleteUserByUsername.css';
import AdminNavBar from "./AdminNavBar";

// los tokens siempre se obtienen del /login.
const accessToken = localStorage.getItem('accessToken');

function DeleteUserByUsername() {
    const [usernameToDelete, setUsernameToDelete] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    /*
    useEffect(() => {
        const checkAccessTokenExpired = async () => {
            try {
                const response = await fetch('http://localhost:3001/access-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to refresh access token');
                }
                // Update the access token in local storage with the new one
                const data = await response.json();
                localStorage.setItem('accessToken', data.accessToken);
            } catch (error) {
                console.error('Error refreshing access token:', error.message);
            }
        }
        checkAccessTokenExpired();
    }, []);  */

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/deleteuser/${usernameToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                setGeneralError('Error eliminando usuario');
                return;
            }
            setSuccessMessage(`Usuario ${usernameToDelete} eliminado con exito`);
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    return (
        <div className="DeleteUserByUsername">
            < AdminNavBar/>
            <br />
            <br />
            <input 
                type="text" 
                placeholder="Username to delete" 
                value={usernameToDelete} 
                onChange={(e) => setUsernameToDelete(e.target.value)} 
            />
            <button onClick={handleDelete}>Delete User</button>
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    )
};

export default DeleteUserByUsername;
