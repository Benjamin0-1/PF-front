import React, {useEffect, useState} from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './BanUser.css'; // estilos
import AdminNavBar from "./AdminNavBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const accessToken = localStorage.getItem('accessToken');

let URL = 'http://localhost:3001/ban'; // <-- esto aun no esta en Heroku.

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
            
            const response = await FetchWithAuth('http://localhost:3001/profile-info', {
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
            setDetailError(''); // Clear detailError when starting to fetch new user details

            const response = await FetchWithAuth(`http://localhost:3001/user-details/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status == 404) {
                // setDetailError(`Usuario con id: ${userId} no existe`);
                toast.error(`User with id: ${userId} does not exist`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    
                    });
                return;
            }

            if (!response.ok) {
                console.log(`Error mostrando detalles de usuario: ${response.status}`);
                return;
            };

            const data = await response.json();
            if (data.length === 0) {
                // console.log('El usuario no existe');
                toast.error('Username does not exist', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    
                    });
                return;
            };

            setUserToBanDetails(data); // <-- 

        } catch (error) {
            console.log(`Error: ${error}`);
            // setDetailError('Ha ocurrido un error al obtener los detalles del usuario.');
            toast.error('An error occurred while obtaining user details.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                
                });
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

            const response = await FetchWithAuth(`${URL}/${userId}`, {
                method: 'POST', // <-- tambien puede cambiarse a PUT.
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ banDurationHours })
            });

            const data = await response.json();

            if (data.invalidBan) {
                // setInvalidBanError('No puedes banear a otro admin ni a ti mismo');
                toast.error('You cannot ban another admin or yourself', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    
                    });
                setGeneralError('');
                return
            };

            if (response.status === 404) {
                // setUserIdNotFoundError(`El usuario con id: ${userId} no existe`);
                toast.error(`The user with id: ${userId} does not exist`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    
                    });
                setGeneralError('');
                setSuccessMessage('');
                setInvalidBanError('')
                return;
            };

            if (!response.ok) {
                // setGeneralError('Ha ocurrido un error');
                toast.error('An error has occurred', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    
                    });
                return;
            };

            // setSuccessMessage(`Usuario baneado exitosamente por ${banDurationHours} horas.`);
            toast.success(`User successfully banned for ${banDurationHours} hours.` , {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });

        } catch (error) {
            console.log(`Error: ${error}`);
            // setGeneralError('Ha ocurrido un error.');
            toast.error('An error has occurred', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                
                });
            setSuccessMessage('');
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <div >
            <br/ >
            <br />
            <div className="BanUser">
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
                <div className="containerButton">
                <button type="submit">Ban User</button>
                </div>
            </form>
            {isLoading && <p>Loading...</p>}
            {invalidBanError && <p style={{color: 'red'}}>{invalidBanError}</p>}
            {userIdNotFoundError && <p style={{ color: 'red' }}>{userIdNotFoundError}</p>}
            {/* {generalError && <p style={{ color: 'red' }}>{generalError}</p>} */}
            {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
            <ToastContainer />
            </div>
            <div >
            <AdminNavBar/>
            </div>
        </div>
    );

};

export default BanUser;
