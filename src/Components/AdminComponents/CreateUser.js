import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";


const accessToken = localStorage.getItem('accessToken');

const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

 const API_URL = process.env.REACT_APP_URL

//let URL = 'http://localhost:3001/signup'; // <-- IMPORTANTE: <-- FALTA AGREGAR URL.

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

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        try {

            if (formData.firstName.length < 3) {
                setNameError('Username must be at least 3 characters long');
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

            const response = await FetchWithAuth(`${API_URL}/signup`, {
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
        <div className="CreateUser" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ color: '#333', textAlign: 'center' }}>Create User</h1>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                <label htmlFor="firstName" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {nameError && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{nameError}</p>}
    
                <label htmlFor="lastName" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {lastNameError && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{lastNameError}</p>}
    
                <label htmlFor="username" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Username:</label>
                <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {usernameError && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{usernameError}</p>}
    
                <label htmlFor="confirmUsername" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Confirm Username:</label>
                <input
                    type="text"
                    id="confirmUsername"
                    value={formData.confirmUsername}
                    onChange={(e) => setFormData({ ...formData, confirmUsername: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {usernamesDontMatch && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{usernamesDontMatch}</p>}
    
                <label htmlFor="email" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {invalidEmailFormat && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{invalidEmailFormat}</p>}
    
                <label htmlFor="confirmEmail" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Confirm Email:</label>
                <input
                    type="email"
                    id="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {emailsDontMatch && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{emailsDontMatch}</p>}
    
                <label htmlFor="password" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Password:</label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
    
                <label htmlFor="confirmPassword" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {invalidPassword && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{invalidPassword}</p>}
                {passwordsDontMatch && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{passwordsDontMatch}</p>}
    
                <button type="submit" disabled={isLoading} style={{ backgroundColor: '#5cabff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                    {isLoading ? 'Loading...' : 'Create User'}
                </button>
                {generalError && <p style={{ margin: '5px 0', color: '#d8000c', backgroundColor: '#ffbaba', borderColor: '#d8000c', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{generalError}</p>}
                {successMessage && <p style={{ margin: '5px 0', color: '#4F8A10', backgroundColor: '#DFF2BF', borderColor: '#4F8A10', padding: '10px', borderRadius: '5px', fontSize: '14px' }}>{successMessage}</p>}
            </form>
            <br />
            <AdminNavBar />
        </div>
    );
    
    
};





export default CreateUser;
