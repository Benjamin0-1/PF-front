import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import './DeletedUser.css';

const accessToken = localStorage.getItem('accessToken');

function DeletedUser() {
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [noUsersFoundError, setNoUsersFoundError] = useState('');

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

        if (!accessToken) {
            window.location.href = '/login'
        } else {
            checkIsAdmin();
        }
    }, []);

    useEffect(() => {
        const fetchDeletedUsers = async () => {
            try {
                const response = await FetchWithAuth('http://localhost:3001/all-deleted-users', {
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
        <div className="DeletedUser">
            
          <h1>Deleted Users: {deletedUsers.length}</h1>
          {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
          {noUsersFoundError && <p style={{ color: 'blue' }}>{noUsersFoundError}</p>}
          <div className="user-cards">
            {deletedUsers.map(user => (
              <div key={user.id} className="user-card">
                <p>ID: {user.id}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Deleted on: {user.createdAt}</p>
              </div>
            ))}
          </div>
          < AdminNavBar/>
        </div>
      );
      
};

export default DeletedUser;
