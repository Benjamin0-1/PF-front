import React, { useState } from "react";
import './DeleteUserByEmail.css';
import FetchWithAuth from "../Auth/FetchWithAuth";

const accessToken = localStorage.getItem('accessToken');

function DeleteUserByEmail() {
    const [email, setEmail] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [invalidEmailFormat, setInvalidEmailFormat] = useState('');
    // email not found
    // loading.

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const handleDelete = async () => {


        if (!emailRegex.test(email)) {
            setInvalidEmailFormat('Email invalido.')
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
                setGeneralError('Ha ocurrido un error.');
                setSuccessMessage('');
                return;
            }
            setSuccessMessage(`Usuario con email ${email} eliminado con exito`);
            setGeneralError('');
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    return (
        <div className="DeleteUserByEmail">
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
        </div>
    );
}

export default DeleteUserByEmail;
