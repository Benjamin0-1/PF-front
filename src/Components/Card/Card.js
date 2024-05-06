import React from 'react'
import { Link } from 'react-router-dom'
import "./Card.css"
import { useDispatch } from "react-redux"
import { addProductCart } from '../../redux/actionProducts'

export default function Card({ image, product, price, description, id }) {
    const dispatch = useDispatch()
    return (
        <div className='card-container'>
            <Link to={`/detail/${id}`} className='card'>
                <div className='card-image-container'>
                    <img className='card-image' src={ image } alt="" />
                </div>
                <div className='card-info-container'>
                    <h1>{ product }</h1>
                    <h3>{ price }</h3>
                </div>
                <div className='card-info-detail'>
                    <p>{ description }</p>
                </div>
            </Link>
            <button onClick={ () => dispatch(addProductCart({ image, product, price, description, id })) }>ADD CART</button>
        </div>
    )
}
