import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import './AllUsers.css';

const URL = 'http://localhost:3001/allusers';
const accessToken = localStorage.getItem('accessToken');

function AllUsers() {
    const [generalError, setGeneralError] = useState('');
    const [users, setUsers] = useState([]);
    const [noUsersError, setNoUsersError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await FetchWithAuth(URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    setGeneralError('Ha ocurrido un error');
                    return;
                }

                const data = await response.json();

                if (data.users.length === 0) {
                    setNoUsersError('No se han encontrado usuarios')
                    setGeneralError('');
                    return;
                }

                setUsers(data.users);

            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
        fetchUsers();
    }, [])

    return (
        <div className="AllUsers">
            
            <br/>
            <br/>
            <h2>Total: {users.length}</h2>
            {noUsersError && <p>{noUsersError}</p>}
            {users.length > 0 && (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <div> First Name: {user.first_name || 'No existe'} </div>
                            <div>Last Name: {user.last_name || 'No existe'}</div>
                            <div>Username: {user.username}</div>
                            <div>Email: {user.email}</div>
                            <div>ID: {user.id} </div>
                            <div>Fecha registro: {user.id} {user.createdAt}</div>
                            <div>Password reset token: {user.password_reset_token || 'No existe'}</div>
                            <div>Is admin: {user.is_admin ? 'Yes' : 'No'}</div>
                            <div>Is banned: {user.banned ? user.ban_expiration : 'User is not banned'}</div>


                          
                        </li>
                    ))}
                </ul>
            )}
            {generalError && <p>{generalError}</p>}

            <br />
            <AdminNavBar/>
        </div>
    )
}

export default AllUsers;
