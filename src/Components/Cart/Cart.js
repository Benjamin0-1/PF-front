import React, { useId } from 'react'
import "./Cart.css"
import { useDispatch, useSelector } from 'react-redux';
import { addProductCart, clearCart, removeCart } from '../redux/actionProducts';
import cartIconEmpty from "../../assets/cartIconEmpty.png"
const Cart = (product) => {
    const cartProducts = useSelector(state => state.products.cart);
    const dispatch = useDispatch();
    console.log(cartProducts);
    const cartCheckboxId = useId();
    return (
        <>
            <label className='cart-button' htmlFor={ cartCheckboxId }>
                <img src={cartIconEmpty} alt="" />
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
                        <li key={ i }>
                            <img src={ p.image } alt={ p.product } />
                            <div className='card-product'>
                                <p >{ p.product }</p>
                            </div>
                            <footer>
                                <p>Quantity: { p.quantity }</p>
                                <button onClick={ () => dispatch(removeCart(p)) }>-</button>
                                <button onClick={ () => dispatch(addProductCart(p)) }>+</button>
                            </footer>
                        </li>
                    )) }
                </ul>
                <button onClick={ () => dispatch(clearCart()) }>
                    Clear
                </button>
            </aside>
        </>
    )
}

export default Cart