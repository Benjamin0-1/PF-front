import React, { useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './SendMassiveEmail.css';

const accessToken = localStorage.getItem('accessToken');

function SendMassiveEmail() {
    const [generalError, setGeneralError] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendEmails = async () => {
        setIsLoading(true);
        const URL = 'http://localhost:3001/send-email-to-all-users';
        try {
            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ subject, message })
            });
            if (response.ok) {
                setSuccessMessage('Emails enviados con exito');
                setGeneralError('');
                return;
            } 

        } catch (error) {
            console.error('Error sending emails:', error);
            setGeneralError('Ha ocurrido un error.');
            setSuccessMessage('');
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="SendMassiveEmail">
            <h2>Send email to all users</h2>
            <div>
                <label htmlFor="subject">Subject:</label>
                <input 
                    type="text" 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="message">Body:</label>
                <textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                />
            </div>
            <div>
                <button onClick={sendEmails}>Send Emails</button>
            </div>
            {isLoading && <p>Sending emails...</p>}
            {generalError && <p className="error">{generalError}</p>}
            {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
        </div>
    )
};

export default SendMassiveEmail;
