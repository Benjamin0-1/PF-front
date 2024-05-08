import React, { useEffect, useState } from "react";
import deleteauserbyitsusername from './module.DeleteUserByUsername.css';
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";

// los tokens siempre se obtienen del /login.
const accessToken = localStorage.getItem('accessToken');

function DeleteUserByUsername() {
    const [usernameToDelete, setUsernameToDelete] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteAdminError, setDeleteAdminError] = useState('');

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

    if (!accessToken) {
        window.location.href = '/login'
    };

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

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/deleteuser/${usernameToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            if (data.isUserAdmin) {
                setDeleteAdminError('No puedes eliminar otro admin!');
                setGeneralError('');
                setSuccessMessage('');
                return
            };

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
           
            <br />
            <br />
            <input 
                type="text" 
                placeholder="Username to delete" 
                value={usernameToDelete} 
                onChange={(e) => setUsernameToDelete(e.target.value)} 
            />
            <button onClick={handleDelete}>Delete User</button>
            {deleteAdminError && <p style={{color: 'red'}}>{deleteAdminError}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <br />
            <br />
            < AdminNavBar/>
        </div>
    )
};

export default DeleteUserByUsername;
