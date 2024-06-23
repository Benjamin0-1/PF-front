import React, { useState } from 'react';
import  theNewsletterstyles from  './module.Newsletter.css';
const API_URL = process.env.REACT_APP_URL

function Newsletter() {
    const [email, setEmail] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailAlreadyAddedError, setEmailAlreadyAddedError] = useState('');
    const [emailAlreadyInUsers, setEmailAlreadyInUsers] = useState('');
    const [isLoading, setIsLoading] = useState(false); // <-- se demora en enviar el correo.

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        
        const response = await fetch(`${API_URL}/newsletter/${email}`, {
          method: 'POST'
      });

        const data = await response.json();
        if (data.emailAlreadyAdded) {
          setEmailAlreadyAddedError('Este email ya se encuentra agregado.');
          setGeneralError('');
          setSuccessMessage('');
          return;
        };

          if (data.emailInUserModel) {
            setEmailAlreadyInUsers('Este email ya pertenece a un usuario registrado');
            setEmailAlreadyAddedError('');
            setSuccessMessage('');
            setGeneralError('');
            return;
          };

          setIsLoading(true); // <-- el mensaje de loading solamente aparece luego de descartar errores.

          setSuccessMessage('Email agregado con exito.');
          setGeneralError('');
          setEmailAlreadyAddedError('');
          setEmailAlreadyInUsers('');
          

      } catch (error) {

        console.log(`error: ${error}`);
        setGeneralError('Ha ocurrido un error');
        setSuccessMessage('');
        setEmailAlreadyAddedError('');
        setEmailAlreadyInUsers('');

      } finally {
        setIsLoading(false);
      };


    }

    return (
      <div className="newsletter-container">
          <h2>Subscribe to Our Newsletter</h2>

          {generalError && <p className="error-message">{generalError}</p>}
          {emailAlreadyAddedError && <p className="error-message">{emailAlreadyAddedError}</p>}
          {emailAlreadyInUsers && <p className="error-message">{emailAlreadyInUsers}</p>}
          {isLoading && <p className="loading-message">Loading...</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
              />
              
              <button type="submit" className="newsletter-button">Subscribe</button>

              <div className="message-container">
                  
              </div>
          </form>
      </div>
  );



    };
    
export default Newsletter;
