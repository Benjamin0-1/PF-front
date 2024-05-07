import axios from "axios"
import { ADD_CART, CLEAR_CART, GET_PRODUCT_ID, REMOVE_CART } from "./action-types-products"

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

export function getProductById(id) {
    return async (dispatch) => {
        try {
            const {data} = await axios.get(`http://localhost:3001/product-detail/${id}`);
            return dispatch({
                type: GET_PRODUCT_ID,
                payload: data
            })
        } catch (error) {

        }
    }
}