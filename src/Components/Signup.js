import React, { useState } from "react";
import signUpRegisterFormStyles from  './module.Signup.css';
import signupImage from './Assets/signup.webp'
const API_URL = process.env.REACT_APP_URL

function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        confirmUsername: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
    });
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordsDontMatchError, setPasswordsDontMatchError] = useState('');
    const [passwordTooShortError, setPasswordTooShortError] = useState('');
    const [usernamesDontMatchError, setUsernamesDontMatchError] = useState('');
    const [invalidEmailFormat, setInvalidEmailFormat] = useState('');
    const [usernameAlreadyExistsError, setUsernameAlreadyExistsError] = useState('');
    const [accountAlreadyDeletedError, setAccountAlreadyDeletedError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [invalidUsernameError, setInvalidUsernameError] = useState('');
    const [emailAlreadyInUse, setEmailAlreadyInUse] = useState('');

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        window.location.href = '/viewprofile';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearErrors();

        if (!validateFields()) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            handleResponse(response.status, data);
        } catch (error) {
            console.error('Error:', error);
            setGeneralError('Ha ocurrido un error');
        } finally {
            setIsLoading(false);
        }
    };

    const validateFields = () => {
        let isValid = true;
        if (formData.firstName.length < 3) {
            setFirstNameError('Name must be at least 3 characters');
            isValid = false;
        }
        if (formData.lastName.length < 3) {
            setLastNameError('Last name must have at least 3 characters');
            isValid = false;
        }
        if (formData.username.length < 3) {
            setInvalidUsernameError('Username must have at least 3 characters');
            isValid = false;
        }
        if (formData.username !== formData.confirmUsername) {
            setUsernamesDontMatchError('Usernames do not match');
            isValid = false;
        }
        if (formData.password.length < 8) {
            setPasswordTooShortError('Password must be at least 8 characters long');
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            setPasswordsDontMatchError('Passwords do not match');
            isValid = false;
        }
        if (formData.email !== formData.confirmEmail) {
            setEmailError('Emails do not match');
            isValid = false;
        }
        const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(formData.email)) {
            setInvalidEmailFormat('Invalid email format');
            isValid = false;
        }
        return isValid;
    };

    const clearErrors = () => {
        setGeneralError('');
        setFirstNameError('');
        setLastNameError('');
        setInvalidUsernameError('');
        setUsernamesDontMatchError('');
        setPasswordTooShortError('');
        setPasswordsDontMatchError('');
        setEmailError('');
        setInvalidEmailFormat('');
        setUsernameAlreadyExistsError('');
        setAccountAlreadyDeletedError('');
        setEmailAlreadyInUse('');
    };

    const handleResponse = (status, data) => {
        if (status === 403) {
            setAccountAlreadyDeletedError('Your account has been deleted');
        } else if (data.emailAlreadyInUse) {
            setEmailAlreadyInUse('Email is already in use');
        } else if (data.usernameAlreadyExists) {
            setUsernameAlreadyExistsError('Username already exists');
        } else if (status === 201) {
            setFormData({
                firstName: '',
                lastName: '',
                username: '',
                confirmUsername: '',
                email: '',
                confirmEmail: '',
                password: '',
                confirmPassword: '',
            });
            setSuccessMessage('Registrado con éxito');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        


        <div className="Signup">
        <h2>Sign Up</h2>
    
            


            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="signup-form">
                {isLoading && <p className="loading-message"><strong>Creating account...</strong></p>}
                <div className="form-group">
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="input-field" />
                    {firstNameError && <p className="error-message">{firstNameError}</p>}
                </div>
                <div className="form-group">
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="input-field" />
                    {lastNameError && <p className="error-message">{lastNameError}</p>}
                </div>
                <div className="form-group">
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="input-field" />
                    <input type="text" name="confirmUsername" placeholder="Confirm Username" value={formData.confirmUsername} onChange={handleChange} className="input-field" />
                    {invalidUsernameError && <p className="error-message">{invalidUsernameError}</p>}
                    {usernamesDontMatchError && <p className="error-message">{usernamesDontMatchError}</p>}
                </div>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field" />
                    <input type="email" name="confirmEmail" placeholder="Confirm Email" value={formData.confirmEmail} onChange={handleChange} className="input-field" />
                    {emailError && <p className="error-message">{emailError}</p>}
                    {invalidEmailFormat && <p className="error-message">{invalidEmailFormat}</p>}
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-field" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input-field" />
                    {passwordTooShortError && <p className="error-message">{passwordTooShortError}</p>}
                    {passwordsDontMatchError && <p className="error-message">{passwordsDontMatchError}</p>}
                </div>
                {generalError && <p className="error-message">{generalError}</p>}
                {usernameAlreadyExistsError && <p className="error-message">{usernameAlreadyExistsError}</p>}
                {accountAlreadyDeletedError && <p className="error-message">{accountAlreadyDeletedError}</p>}
                <button type="submit" className="button" disabled={isLoading}>Sign Up</button>
                <p className="link-text">Already have an account? <a href='/login' className="link">Login</a></p>
            </form>
        </div>
    );
}

export default Signup;
