import React, {useState, useEffect} from "react";
import deleteaUserBasedOnItsId from './module.DeleteUserById.css';
import * as yup from 'yup';
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";

const accessToken = localStorage.getItem('accessToken');

const validationSchema = yup.object().shape({
    userId: yup.number().required('Must enter a user id to delete')
})


function DeleteUserById() {
    const [userId, setUserId] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [noUserIdFoundError, setNoUserIdFoundError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userNotFoundError, setUserNotFoundError] = useState('');

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
  

    const URL = 'http://localhost';
    const PORT = process.env.PORT || 3001

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate({userId});
            // si se valida:
            const response = await FetchWithAuth(`${URL}:${PORT}/deleteuser/id/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                setNoUserIdFoundError(`Usuario con id: ${userId} no existe`);
                setGeneralError('')
                return;
            };

            if (!response.ok) {
                if (response.status === 404) {
                    const data = await response.json();
                    if (data.noUserIdFound) { 
                        setNoUserIdFoundError(`No existe usuario con id: ${userId}`);
                        setGeneralError('');
                        setSuccessMessage('');
                        return;
                    }
                }
                return; 
            }
            

            setSuccessMessage(`Usuario con id: ${userId} eliminado con exito`);

        } catch (error) {
            setGeneralError('Ha ocurrido un error');
        }
    };

    const handleChange  = (e) => {
        setUserId(e.target.value);
        setGeneralError('');
        setNoUserIdFoundError('');
        setSuccessMessage('');
    };
    
    // puede ser type="number".
    return (
        <div className="DeleteUserById">
            
            <br/>
            <h2>Eliminar usuario por ID</h2>
            <form onSubmit={handleDelete}>
                <label htmlFor="userId">User ID:</label>
                <input 
                    type="text" 
                    id="userId" 
                    value={userId} 
                    onChange={handleChange} 
                />
                {noUserIdFoundError && <p className="error">{noUserIdFoundError}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                {generalError && <p className="error">{generalError}</p>}
                {userNotFoundError && <p className="error">{userNotFoundError}</p>}
                <button type="submit">Eliminar Usuario</button>
            </form>
            <br />
            < AdminNavBar/>
        </div>
    );

};




export default DeleteUserById;
