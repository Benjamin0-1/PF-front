import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import './CreateUser.css';

const accessToken = localStorage.getItem('accessToken');

const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

let URL = 'http://localhost:3001/'; // <-- IMPORTANTE: <-- FALTA AGREGAR URL.

function CreateUser() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState('');
    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [usernamesDontMatch, setUsernamesDontMatch] = useState('');
    const [emailsDontMatch, setEmailsDontMatch] = useState('');
    const [invalidPassword, setInvalidPassword] = useState(''); // <-- regex
    const [passwordsDontMatch, setPasswordsDontMatch] = useState(''); 

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

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        try {

            if (formData.firstName.length < 3) {
                setNameError('Nombre de usuario debe tener al menos 3 caracteres');
                setGeneralError('');
                return
            };

            if (formData.lastName.length < 3) {
                setLastNameError('Apellido debe tener al menos 3 caracteres');
                setNameError('');
                setGeneralError('');
                return;
            };

            if (formData.username.length < 3) {
                setUsernameError('Username debe tener al menos 3 caracteres');
                setLastNameError('');
                setGeneralError('');
                return
            };

            if (formData.username !== formData.confirmUsername) {
                setUsernamesDontMatch('Los nombres de usuario deben ser iguales');
                setUsernameError('');
                setGeneralError('');
            };

            if (!emailRegex.test(formData.email)) {
                setInvalidEmailFormat('Formato de email invalido.')
                setUsernameError('');
                setGeneralError('');
            };

            if (formData.email !== formData.confirmEmail) {
                setEmailsDontMatch('Los emails deben ser iguales');
                setUsernamesDontMatch('');
                setGeneralError('');
            };

            // password validation <--
            if (!passwordRegex.test(formData.password)) {
                setInvalidPassword('Las contraseña debe tener al menos una mayuscula, al menos un numero y 8 caracteres de longitud');
                setEmailsDontMatch('');
                setGeneralError('');
            };

            if (formData.password !== formData.confirmPassword) {
                setPasswordsDontMatch('Las contraseña deben ser iguales')
            }

            const response = await FetchWithAuth(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });
    

        } catch (error) {
            console.log(`error: ${error}`);
            
        } finally {
            setIsLoading(false)
        }

    };


    return (
        <div className="CreateUser">
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {nameError && <p>{nameError}</p>}
    
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {lastNameError && <p>{lastNameError}</p>}
    
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                {usernameError && <p>{usernameError}</p>}
    
                <label htmlFor="confirmUsername">Confirm Username:</label>
                <input
                    type="text"
                    id="confirmUsername"
                    value={formData.confirmUsername}
                    onChange={(e) => setFormData({ ...formData, confirmUsername: e.target.value })}
                />
                {usernamesDontMatch && <p>{usernamesDontMatch}</p>}
    
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {invalidEmailFormat && <p>{invalidEmailFormat}</p>}
    
                <label htmlFor="confirmEmail">Confirm Email:</label>
                <input
                    type="email"
                    id="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                />
                {emailsDontMatch && <p>{emailsDontMatch}</p>}
    
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
    
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {invalidPassword && <p>{invalidPassword}</p>}
                {passwordsDontMatch && <p>{passwordsDontMatch}</p>}
    
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create User'}
                </button>
                {generalError && <p>{generalError}</p>}
                {successMessage && <p>{successMessage}</p>}
            </form>
            <br/>
            < AdminNavBar/>
        </div>
    );
    
};





export default CreateUser;
