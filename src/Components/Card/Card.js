import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./Card.css"
import { useDispatch, useSelector } from "react-redux"
import { addProductCart } from '../../redux/actionProducts'
import heartEmpty from "../../assets/heartEmpty.png"
import heartFull from "../../assets/heartFull.png"
import cartIconEmpty from "../../assets/cartIconEmpty.png"
import { addFavorites, removeFavorites, userFavorites } from '../../redux/actionUser'

export default function Card({ image, product, price, description, id }) {
    const dispatch = useDispatch()
    const favorites = useSelector(state => state.user.userFavorites);
    const [ isFavorite, setIsFavorite ] = useState(false);

    useEffect(() => {
        dispatch(userFavorites())
        console.log(favorites);
    }, [isFavorite]);

    useEffect(() => {
        if (favorites.length) {
            const favoriteProduct = favorites.find(favorite => favorite.productId === id);
            setIsFavorite(!!favoriteProduct);
            return
        }
        dispatch(userFavorites())
        return
    }, [ favorites, id, dispatch]);

    const handleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorites(id))
            setIsFavorite(false)
        } else {
            dispatch(addFavorites(id))
            setIsFavorite(true)
        }
    }
    return (
        <div className='card-container'>
            <button onClick={ handleFavorite } className={ `like-button ${isFavorite ? 'favorite' : ''}` }><img src={ heartFull } alt="" /></button>
            <Link to={ `/detail/${id}` } className='card'>
                <div className='card-image-container'>
                    <img className='card-image' src={ image } alt="" />
                </div>
                <div className='card-info-container'>
                    <h2>{ product }</h2>
                    <h3>{ price }</h3>
                    <p>{ description }</p>
                </div>
            </Link>
            <button className='add-cart' onClick={ () => dispatch(addProductCart({ image, product, price, description, id })) }><p>Add to <span><img src={ cartIconEmpty } alt="" /></span></p></button>
        </div>
    )
}
