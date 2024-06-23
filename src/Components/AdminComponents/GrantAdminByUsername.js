import React, {useState, useEffect} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminDashboard from "./AdminDashboard";
import grantadminbyusername from './module.GrantAdminByUsername.css';
import ProfileIcon from "../ProfileIcon";

const accessToken = localStorage.getItem('accessToken');

const API_URL = process.env.REACT_APP_URL

function GrantAdminByUsername() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [username, setUsername] = useState('');
    const [alreadyAdmin, setAlreadyAdmin] = useState('');
    const [userNotFoundError, setUserNotFoundError] = useState('');
    
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

    const handleCreateAdmin = async () => {
        try {
            
            const response = await FetchWithAuth(`${API_URL}/grant-admin-by-username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({username})
            });

            const data = await response.json();

            if (data.userNotFound) {
                setUserNotFoundError(`User: ${username} does not exist`);
                setGeneralError('');
                setSuccessMessage('');
                return;
            };
 

            if (data.isUserAdmin) {
                setAlreadyAdmin(`Usuario ${username} ya es un admin`);
                setSuccessMessage('');
                setGeneralError('');
                return;
            };

            setSuccessMessage(`Usuario ${username} ha sido asignado el rol de administrador exitosamente.`);
            setGeneralError('');
            setUserNotFoundError('');
            setAlreadyAdmin('');

           
        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Error asignando admin');
            setAlreadyAdmin('');
            setUserNotFoundError('');
            setSuccessMessage("");
        }
    };

  
    useEffect(() => {
        
        const fetchUserDetails = async () => {
            try {
                // Perform API request to fetch user details   <-- users/info/details/:username
                const response = await FetchWithAuth(`${API_URL}/users/info/details/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();

                // Check if user exists
                if (!data.userExists) {
                    setUserNotFoundError(`User: ${username} does not exist`);
                    setGeneralError('');
                    setSuccessMessage('');
                } else {
                    setUserNotFoundError('');
                }
            } catch (error) {
                console.log(`error: ${error}`);
                setUserNotFoundError('');
               // setGeneralError('Error obteniendo detalles del usuario'); IMPORTANTE: ARREGLAR ESTO! !
                setSuccessMessage('');
            }
        };

        if (username !== '') {
            fetchUserDetails();
        }
    }, [username]);



    return (
        <div className="GrantAdminByUsername">
            < ProfileIcon/>
            < br/>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleCreateAdmin}>Grant Admin</button>
            {userNotFoundError && <p style={{ color: 'red' }}>{userNotFoundError}</p>}
            {alreadyAdmin && <p style={{ color: 'red' }}>{alreadyAdmin}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <br/>
            <  AdminDashboard/>
            <br/>
        </div>
    );


};




export default GrantAdminByUsername;
