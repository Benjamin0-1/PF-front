import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminDashboard from "./AdminDashboard";
import './AllNewsLetterEmail.css';
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

const all_newsletter_emails_url = 'http://localhost:3001/all-newsletter-emails'

function AllNewsLetterEmail() {
    const [generalError, setGeneralError] = useState('');
    const [allEmails, setAllEmails] = useState([]);
    const [noEmailsFound, setNoEmailsFound] = useState('');

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

    useEffect(() => {
        const fetchAllEmais = async () => {
            
            try {
                
                const response = await FetchWithAuth(all_newsletter_emails_url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();

                if (data.length === 0) {
                    setNoEmailsFound('Aun no hay ningun email en newsletter');
                    setGeneralError('');
                    return
                };

                setAllEmails(data);

            } catch (error) {
                console.log(`error: ${error}`);
                setGeneralError('Ha ocurrido un error');
                
            };

        }
        fetchAllEmais();
    }, []);


    return (
        <div className="AllNewsletterEmail">
            <h2>All Newsletter Emails</h2>
            <h4>total: {allEmails.length}</h4>
            {generalError && <p className="error-message">{generalError}</p>}
            {noEmailsFound && <p>{noEmailsFound}</p>}
            {allEmails.length > 0 && (
                <ul>
                    {allEmails.map((email) => (
                        <li key={email.id}>{email.email}</li>
                    ))}
                </ul>
            )}

            <br/>
            <AdminNavBar/>
        </div>
    );
    

};

export default AllNewsLetterEmail;
