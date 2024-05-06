import { ADD_CART, CLEAR_CART, REMOVE_CART } from "./action-types-products"

export function addProductCart(product) {
    return async (dispatch) => {
        
        dispatch({
            type: ADD_CART,
            payload: product
        })
    }
}

export function removeCart(product) {
    return async (dispatch) => {

        dispatch({
            type: REMOVE_CART,
            payload: product
        })
    }
}

export function clearCart() {
    return async (dispatch) => {

        dispatch({
            type: CLEAR_CART,
        })
    }
}