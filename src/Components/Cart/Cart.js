import React, { useId } from 'react'
import "./Cart.css"
import { useDispatch, useSelector } from 'react-redux';
import { addProductCart, clearCart, removeCart } from '../../redux/actionProducts';
import cartIconEmpty from "../../assets/cartIconEmpty.png"
const Cart = (product) => {
    const cartProducts = useSelector(state => state.products.cart);
    const dispatch = useDispatch();
    const cartCheckboxId = useId();

    return (
        <>
            <label className='cart-button' htmlFor={ cartCheckboxId }>
                <img src={ cartIconEmpty } alt="" />
                <p>{ cartProducts.length }</p>
            </label>
            <input id={ cartCheckboxId } type='checkbox' hidden />
            <aside className='cart'>
                <label className='cart-close-button' htmlFor={ cartCheckboxId }>
                    <p className='cart-close'>x</p>
                </label>
                <input id={ cartCheckboxId } type='checkbox' hidden />
                <ul>
                    { cartProducts.map((p, i) => (
                        <li className='cart-product-wrapper' key={ i }>
                            <img src={ p.image } alt={ p.product } />
                            <div className='card-product'>
                                <h3 >{ p.product }</h3>
                                <p>{ p.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }</p>
                                <div className='cart-product-quantity'>
                                    <p>Quantity: { p.quantity }</p>
                                    <button onClick={ () => dispatch(removeCart(p)) }>-</button>
                                    <button onClick={ () => dispatch(addProductCart(p)) }>+</button>
                                </div>
                            </div>
                        </li>
                    )) }
                </ul>
                <div className='total-price'>
                    <p>Total: <span>{
                        cartProducts.reduce((total, p) => total + (p.price * p.quantity), 0)
                            .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                    }</span></p>
                </div>
                <button onClick={ () => dispatch(clearCart()) }>
                    Clear
                </button>
            </aside>
        </>
    )
}

export default Cart