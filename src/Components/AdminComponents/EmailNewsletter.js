import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './EmailNewsletter.css';
import AdminDashboard from "./AdminDashboard";
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

let newsletter_url = 'http://localhost:3001/email-all-newsletter';

function EmailNewsletter() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [allEmailsSent, setAllEmailsSent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

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



      const handleEmailSending = async () => {
        try {
            setIsLoading(true)
            
            const response = await FetchWithAuth(newsletter_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({subject, body}) // <--
            });

            
            if (response.status === 200) {
      
                const data = await response.json();
                setAllEmailsSent(data.sentEmails) // <-- it's an array.
                setSuccessMessage(data.successMessage);
                setGeneralError('');
            };

            

        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Ha ocurrido un error.');
            setSuccessMessage('');
            
        } finally {
            setIsLoading(false);
        }


      };

      return (
        <div className="Newsletter">
            <h2>Email All Newsletter Subscribers</h2>
            <form onSubmit={handleEmailSending} className="newsletter-form">
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input 
                        type="text" 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        className="newsletter-input"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="body">Body:</label>
                    <textarea 
                        id="body" 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} 
                        className="newsletter-input"
                        required 
                    />
                </div>
                <button type="submit" className="newsletter-button">Send Emails</button>
            </form>
            {isLoading && <p><strong>Loading...</strong></p>}
            {successMessage && 
                <div className="success-message">{successMessage}</div>
            }
            {generalError && 
                <div className="error-message">{generalError}</div>
            }
            {allEmailsSent.length > 0 && (
                <div>
                    <p>Emails Sent:</p>
                    <ul>
                        {allEmailsSent.map((email, index) => (
                            <li key={index}>{email}</li>
                        ))}
                    </ul>
                </div>
            )}
            < AdminNavBar/>
        </div>
    );
    
    
        
    
    
};




export default EmailNewsletter;
