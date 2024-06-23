import React, {useEffect, useState} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import banAuserforbadBehavior from './module.BanUser.css'; // estilos
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

const API_URL = process.env.REACT_APP_URL

function BanUser() {
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [banDurationHours, setBanDurationHours] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(''); // <-- id de usuario a banear.
    const [userIdNotFoundError, setUserIdNotFoundError] = useState('');
    const [userToBanDetails, setUserToBanDetails] = useState([]); // <-- mostrar de manera dinamica.
    const [detailError, setDetailError] = useState('');
    const [invalidBanError, setInvalidBanError] = useState('');

    if (!accessToken) {
        window.location.href = '/login'
    }

    useEffect(() => {
        setInvalidBanError('');
    }, [userId, banDurationHours]);
    

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
                window.location.href = '/notadmin'
            };

        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    useEffect(() => { checkIsAdmin() }, []);

    const fetchUserDetails = async () => {
        try {
            setDetailError(''); 

            const response = await FetchWithAuth(`${API_URL}/user-details/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status == 404) {
                setDetailError(`Usuario con id: ${userId} no existe`);
                return;
            }

            if (!response.ok) {
                console.log(`Error mostrando detalles de usuario: ${response.status}`);
                return;
            };

            const data = await response.json();
            if (data.length === 0) {
                console.log('El usuario no existe');
                return;
            };

            setUserToBanDetails(data); // <-- 

        } catch (error) {
            console.log(`Error: ${error}`);
            setDetailError('Ha ocurrido un error al obtener los detalles del usuario.');
        }
    };

    useEffect(() => {
        if (userId !== '') {
            fetchUserDetails();
        }
    }, [userId]); //<-- cada vez que se cambie el userId, se mostrara los nuevos detalles.


    const handleBan = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)

            const response = await FetchWithAuth(`${API_URL}/${userId}`, {
                method: 'POST', // <-- tambien puede cambiarse a PUT.
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ banDurationHours })
            });

            const data = await response.json();

            if (data.invalidBan) {
                setInvalidBanError('No puedes banear a otro admin ni a ti mismo');
                setGeneralError('');
                return
            };

            if (response.status === 404) {
                setUserIdNotFoundError(`El usuario con id: ${userId} no existe`);
                setGeneralError('');
                setSuccessMessage('');
                setInvalidBanError('')
                return;
            };

            if (!response.ok) {
                setGeneralError('Ha ocurrido un error');
                return;
            };

            setSuccessMessage(`Usuario baneado exitosamente por ${banDurationHours} horas.`);

        } catch (error) {
            console.log(`Error: ${error}`);
            setGeneralError('Ha ocurrido un error.');
            setSuccessMessage('');
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <div className="BanUser">
            < AdminNavBar/>
            <br/ >
            <br />
            <h2>Ban User</h2>
            <form onSubmit={handleBan}>
                <label htmlFor="userId">User ID:</label>
                <input 
                    type="number" 
                    id="userId" 
                    name="userId" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                />
                <label htmlFor="banDuration">Ban Duration (hours):</label>
                <input 
                    type="number" 
                    id="banDuration" 
                    name="banDuration" 
                    value={banDurationHours} 
                    onChange={(e) => setBanDurationHours(e.target.value)} 
                />

                {userToBanDetails && (
                    <div className="user-details">
                        <h3>User Details</h3>
                        <p>ID: {userToBanDetails.id}</p>
                        <p>Name: {userToBanDetails.username}</p>
                        <p>Email: {userToBanDetails.email}</p>
                        {/* Add more user details here */}
                    </div>
                )}
                {detailError && <p style={{color: 'red'}}>{detailError}</p>}

                <button type="submit">Ban User</button>
            </form>
            {isLoading && <p>Loading...</p>}
            {invalidBanError && <p style={{color: 'red'}}>{invalidBanError}</p>}
            {userIdNotFoundError && <p style={{ color: 'red' }}>{userIdNotFoundError}</p>}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );

};

export default BanUser;
