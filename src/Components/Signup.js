import React, { useState } from "react";
import './Signup.css';

// agregar: <-- EMAIL ALREADY IN USE ERROR.

const accessToken = localStorage.getItem('accessToken');
console.log(`signup accesstoken: ${accessToken}`);

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
    // errores especificos.
    const [emailError, setEmailError] = useState('');
    const [passwordsDontMatchError, setPasswordsDontMatchError] = useState('');
    const [passwordTooShortError, setPasswordTooShortError] = useState('');
    const [usernamesDontMatchError, setUsernamesDontMatchError] = useState('');
    const [invalidEmailFormat, setInvalidEmailFormat] = useState('');
    const [usernameAlreadyExistsError, setUsernameAlreadyExistsError] = useState('');
    const [accountAlreadyDeletedError, setAccountAlreadyDeletedError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // <-- it takes time to send the welcome email.

    if (accessToken) {
        window.location.href = '/viewprofile'
    }

    const PORT = 3001; // server port.
    const URL = 'http://localhost';

    const handleSubmit = async (e) => {
        setIsLoading(true)

        e.preventDefault();

        if (formData.username !== formData.confirmUsername) {
            setUsernamesDontMatchError('Los nombres de usuario no coinciden');
            setGeneralError('');
            return;
        };

        if (formData.password.length > 8) {
            setPasswordTooShortError('Constraseña debe contener al menos 8 caracteres');
            setGeneralError('');
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordsDontMatchError('Las contraseñas no coinciden');
            setGeneralError('');
            return;
        }
        if (formData.email !== formData.confirmEmail) {
            setEmailError('Los correos electrónicos no coinciden');
            setGeneralError('');
            return;
        }

        // Check email format
        const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(formData.email)) {
            setInvalidEmailFormat('Formato de email invalido');
            setGeneralError('');
            return;
        }

        try {
            const response = await fetch(`${URL}:${PORT}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(formData)
            });

            if (response.status == 403) {
                setAccountAlreadyDeletedError('Tu cuenta ya ha sido eliminada');
                setGeneralError("");
                return
            };

            if (!response.ok) {
                if (response.status === 400) {
                    const data = await response.json();
                    if (data.usernameAlreadyExists){
                        setUsernameAlreadyExistsError('El usuario ya existe.');
                        setGeneralError('');
                        return;
                    }
                }
            };

            //limpiar todos los campos luego de un signup exitoso.
            setFormData({
                username: '',
                confirmUsername: '',
                email: '',
                confirmEmail: '',
                password: '',
                confirmPassword: '',
            });
    
            
            setSuccessMessage('Registrado con éxito');
            setGeneralError('');
        } catch (error) {
            console.log('Error:', error);
            setGeneralError('Ha ocurrido un error');
            setEmailError('');
        } finally {
            setIsLoading(true)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return(
        <div className="Signup">
            <h2>Sign Up</h2>
            {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                {isLoading && <p><strong>Creating account...</strong></p>}
            <input type="text" name="firstName" placeholder="first name" value={formData.firstName} onChange={handleChange} />
            <input type="text" name="lastName" placeholder="last name" value={formData.lastName} onChange={handleChange} />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input type="text" name="confirmUsername" placeholder="Confirm Username" value={formData.confirmUsername} onChange={handleChange} />
                {usernamesDontMatchError && <p style={{color: 'red'}}> {usernamesDontMatchError} </p>}
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input type="email" name="confirmEmail" placeholder="Confirm Email" value={formData.confirmEmail} onChange={handleChange} />
                {emailError && <p style={{color: 'red'}}>{emailError}</p>}
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                {passwordTooShortError && <p style={{color: 'red'}}>{passwordTooShortError}</p>}
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                {passwordsDontMatchError && <p style={{color: 'red'}}> {passwordTooShortError} </p>}
                {generalError && <p style={{color: 'red'}}>{generalError}</p>}
                {usernameAlreadyExistsError && <p style={{color: 'red'}}>{usernameAlreadyExistsError}</p>}
                {accountAlreadyDeletedError && <p style={{color: 'red'}}>{accountAlreadyDeletedError}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;
