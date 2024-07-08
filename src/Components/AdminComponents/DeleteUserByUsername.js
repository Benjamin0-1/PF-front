import React, { useEffect, useState } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import AdminNavBar from "./AdminNavBar";
import { TextField, Button, Container, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// los tokens siempre se obtienen del /login.
const accessToken = localStorage.getItem('accessToken');

const API_URL = process.env.REACT_APP_URL;

function DeleteUserByUsername() {
    const [usernameToDelete, setUsernameToDelete] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteAdminError, setDeleteAdminError] = useState('');

    if (!accessToken) {
        window.location.href = '/login';
    }

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

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/deleteuser/${usernameToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 404) {
                toast.error('User does not exist');
                return;
            }

            const data = await response.json();
            if (data.isUserAdmin) {
                setDeleteAdminError('cannot delete another admin!');
                setGeneralError('');
                setSuccessMessage('');
                toast.error('Cannot delete another admin!');
                return;
            }

            if (!response.ok) {
                setGeneralError('Error eliminando usuario');
                toast.error('Error eliminando usuario');
                return;
            }
            setSuccessMessage(`Usuario ${usernameToDelete} eliminado con éxito`);
            toast.success(`Usuario ${usernameToDelete} eliminado con éxito`);
        } catch (error) {
            console.error(`Error: ${error}`);
            toast.error('An error occurred');
        }
    }

    return (
        <Container className="DeleteUserByUsername">
            <Typography variant="h4" component="h1" gutterBottom>
                Delete User By Username
            </Typography>
            <TextField 
                fullWidth
                type="text" 
                placeholder="Username to delete" 
                value={usernameToDelete} 
                onChange={(e) => setUsernameToDelete(e.target.value)} 
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleDelete}>
                Delete User
            </Button>
            {deleteAdminError && <Typography color="error">{deleteAdminError}</Typography>}
            {generalError && <Typography color="error">{generalError}</Typography>}
            {successMessage && <Typography color="success.main">{successMessage}</Typography>}
            <AdminNavBar/>
            <ToastContainer />
        </Container>
    );
}

export default DeleteUserByUsername;
