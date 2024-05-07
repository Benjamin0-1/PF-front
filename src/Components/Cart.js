import React, {useId} from "react";
import './Cart.css';

import { useDispatch, useSelector } from 'react-redux';
import { addProductCart, clearCart, removeCart } from '../redux/actionProducts'; // <--


const Cart = (product) => {
    const cartProducts = useSelector(state => state.products.cart);
    const dispatch = useDispatch();
    const cartCheckboxId = useId();
    
    return (
        <>
            <label className='cart-button' htmlFor={ cartCheckboxId }>
            <img src={'https://www.shutterstock.com/image-vector/shopping-cart-vector-icon-flat-260nw-1690453492.jpg'} alt="Cart img here" style={{ width: '30px', height: '30px' }} />

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
                                <p>{p.price}</p>
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

