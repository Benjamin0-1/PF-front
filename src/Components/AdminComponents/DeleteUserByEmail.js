import React, { useState, useEffect } from "react";
import delteauserbyemail from './module.DeleteUserByEmail.css';
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

function DeleteUserByEmail() {
    const [email, setEmail] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [invalidEmailFormat, setInvalidEmailFormat] = useState('');
    // email not found
    // loading.

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

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const handleDelete = async () => {


        if (!emailRegex.test(email)) {
            setInvalidEmailFormat('Invalid email format.')
            setGeneralError('');
            setSuccessMessage('');
            return
        }

        try {
            const response = await FetchWithAuth(`http://localhost:3001/deleteuser/email/${email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                setGeneralError('An error has ocurred.');
                setSuccessMessage('');
                return;
            }
            setSuccessMessage(`User with email ${email} successfully deleted`);
            setGeneralError('');
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    return (
        <div className="DeleteUserByEmail">
            
            <br/>
            <h2>Delete User By Email</h2>
            <input 
                type="text" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <button onClick={handleDelete}>Delete User</button>
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {invalidEmailFormat &&<p style={{color: 'red'}}>{invalidEmailFormat}</p>}

            <br />
            <br/>
            < AdminNavBar/>
           <br />
        </div>
    );
}

export default DeleteUserByEmail;
