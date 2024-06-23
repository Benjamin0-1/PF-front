import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";


const accessToken = localStorage.getItem('accessToken');
const API_URL = process.env.REACT_APP_URL

function DeletedUser() {
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [noUsersFoundError, setNoUsersFoundError] = useState('');

    useEffect(() => {
        const checkIsAdmin = async () => {
            try {
                const response = await FetchWithAuth(`${API_URL}/profile-info`, {
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

        if (!accessToken) {
            window.location.href = '/login'
        } else {
            checkIsAdmin();
        }
    }, []);

    useEffect(() => {
        const fetchDeletedUsers = async () => {
            try {
                const response = await FetchWithAuth(`${API_URL}/all-deleted-users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.status === 404) {
                    setNoUsersFoundError('No existen usuarios eliminados.');
                    setGeneralError('');
                    return;
                }

                const data = await response.json();
                setDeletedUsers(data);

            } catch (error) {
                console.log(`error: ${error}`);
                setGeneralError('Ha ocurrido un error');
                setNoUsersFoundError('');
                setGeneralError('');
            }
        };

        fetchDeletedUsers();
    }, []);

    return (
        <div className="DeletedUser" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ marginBottom: '20px' }}>Deleted Users: {deletedUsers.length}</h1>
          {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
          {noUsersFoundError && <p style={{ color: 'blue' }}>{noUsersFoundError}</p>}
          <div className="user-cards" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {deletedUsers.map(user => (
              <div key={user.id} className="user-card" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px', width: 'calc(33.33% - 20px)' }}>
                <p>ID: {user.id}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Deleted on: {user.createdAt}</p>
              </div>
            ))}
          </div>
          <AdminNavBar />
        </div>
      );
      
      
};

export default DeletedUser;
