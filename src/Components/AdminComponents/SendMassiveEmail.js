import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import  sendMassiveMails from  './module.SendMassiveEmail.css';
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

const API_URL = process.env.REACT_APP_URL

function SendMassiveEmail() {
    const [generalError, setGeneralError] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!accessToken) {
        window.location.href = '/login'
    };

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
    
        checkIsAdmin();
      }, []);

    const sendEmails = async () => {
        setIsLoading(true);
        try {
            const response = await FetchWithAuth(`${API_URL}/send-email-to-all-users`, {
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
            
            <br/>
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
            <br />

           <div>
            <AdminNavBar />
           </div>
          
        </div>
        

       

        
    )
};

export default SendMassiveEmail;
