import React, {useState, useEffect} from "react";
import FetchWithAuth from "./Auth/FetchWithAuth";
import  favStyles from './module.Favorite.css'; // Import the CSS file
import ProfileIcon from "./ProfileIcon";
import AdminButtonIcon from "./AdminButtonIcon";

import { Button, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material"; // MUI 5


const accessToken = localStorage.getItem('accessToken');

let URL = 'http://localhost:3001/products/user/favorites';

function Favorite() {
    const [favorites, setFavorites] = useState([]);
    const [generalError, setGeneralError] = useState('');
    const [noProductsFound, setNoProductsFound] = useState('');

    if (!accessToken) {
        window.location.href = '/login';
    };

    const handleDeleteFavorite = async (id) => {
        try {
            
            const response = await FetchWithAuth(`http://localhost:3001/delete-favorite/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 200) {
                setFavorites(preFavorites => preFavorites.filter(favorite => favorite.id !== id));
            }

        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    const handleFetch = async () => {
        try {
            
            const response = await FetchWithAuth(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            if (!Array.isArray(data.allFavorites)) {
                setNoProductsFound('Aun no tienes favoritos, intenta agregar uno');
                setGeneralError('');
                return
            };

            setFavorites(data.allFavorites);
            setGeneralError('');
            setNoProductsFound('');

        } catch (error) {
            console.log(`error: ${error}`);
            setGeneralError('Ha ocurrido un error');
            setNoProductsFound('');
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

   

    return (
        <div className="Favorite">
            < ProfileIcon />
            < AdminButtonIcon/>
            <h2>Your Favorite Products: {favorites.length}</h2>
            {Array.isArray(favorites) && favorites.map((favorite) => (
                <div key={favorite.id} className="favorite-card">
                    <h3>{favorite.Product.product}</h3>
                    <p>Description: {favorite.Product.description}</p>
                    <p>Price: {favorite.Product.price}</p>
                    <img src={favorite.Product.image} alt={favorite.Product.product} />
                    <button className="DeleteFavoriteButton" onClick={() => handleDeleteFavorite(favorite.id)}>Delete</button>

                </div>
            ))}
            {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
            {noProductsFound && <p style={{ color: 'blue' }}>{noProductsFound}</p>}
        </div>
    )

}

export default Favorite;
