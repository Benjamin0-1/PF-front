import React, { useState, useEffect } from "react";
import FetchWithAuth from "../Auth/FetchWithAuth";
import './Favorite.css'; // Import the CSS file
import { useDispatch, useSelector } from "react-redux";
import { userFavorites } from "../../redux/actionUser";
import Card from "../Card/Card";



let URL = 'http://localhost:3001/products/user/favorites';

function Favorite() {
    const [ favorites, setFavorites ] = useState([]);
    const accessToken = useSelector(state => state.user.tokens.accessToken);
    const userFav = useSelector(state => state.user.userFavorites);
    const dispatch = useDispatch()
    useEffect(() => {
        if (!accessToken) {
            return window.location.href = '/login';
        }
        dispatch(userFavorites());
    }, [ accessToken, dispatch ]);

    useEffect(() => {
        if (!userFav?.length) {
            console.log(userFav);
            return setFavorites([])
        }
        return setFavorites(userFav)
    }, [ userFav ]);

    return (
        <div className="Favorite">
            <h2>Your Favorite Products: { favorites.length }</h2>

            <div className="favorite-products-wrapper">
                { favorites.length > 0 ? (favorites.map((favorite) => (
                    // console.log(favorite.Product.image)
                    <Card
                        key={ favorite.Product?.id }
                        image={ favorite.Product?.image }
                        product={ favorite.Product?.product }
                        price={ favorite.Product?.price }
                        description={ favorite.Product?.description }
                        id={ favorite.Product?.id } />
                ))) : <p>No products yet</p> }
            </div>
        </div>
    )

}

export default Favorite;
