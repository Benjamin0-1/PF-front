import React, { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
    const [email, setEmail] = useState('');

    // here goes a real function which will interact with a new server route.

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Email submitted: ${email}`);
        setEmail();
    };

    return (
        <div className="newsletter-container">
          <h2>Subscribe to Our Newsletter
          </h2>
    
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
          </form>
        </div>
      );
    };
    
export default Newsletter;