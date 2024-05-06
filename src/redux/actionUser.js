import axios from "axios"
import { GET_FAVORITES, GET_FAVORITES_ERROR, LOGIN_ERROR_USER, LOGIN_USER, SIGNUP_ERROR_USER, SIGNUP_USER } from "./action-types-products"
import FetchWithAuth from "../Components/Auth/FetchWithAuth";


export function userLogin(credentials) {
    return async (dispatch) => {
        try {
            const { data, status } = await axios.post("http://localhost:3001/login", credentials);

            if (status === 200) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                const auth = await FetchWithAuth("http://localhost:3001/profile-info", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                if (auth.status === 200) {
                    const response = await axios.get("http://localhost:3001/profile-info", {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${data.accessToken}`
                        }
                    })

                    localStorage.setItem('userInfo', JSON.stringify(response.data));
                    localStorage.setItem("isAdmin", response.data.is_admin);
                    dispatch({
                        type: LOGIN_USER,
                    })
                }
            }
            return dispatch({
                type: LOGIN_USER,
                success: data.message
            })
        } catch (error) {
            console.log(error);
            return dispatch({
                type: LOGIN_ERROR_USER,
                error: error.response.data.message
            })
        }
    }
}

export function userSignup(userData) {
    return async (dispatch) => {
        try {
            const response = await axios.post("http://localhost:3001/signup", userData);
            return dispatch({
                type: SIGNUP_USER,
                payload: response.data
            })
        } catch (error) {
            return dispatch({
                type: SIGNUP_ERROR_USER,
                payload: error.response.data.message
            })
        }
    }
}

export function userFavorites() {
    return async (dispatch) => {
        try {
            const { data, status } = await FetchWithAuth("http://localhost:3001/products/user/favorites", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (status === 404) {
                return dispatch({
                    type: GET_FAVORITES_ERROR,
                    error: "There are no favorites yet"
                })
            }
            return dispatch({
                type: GET_FAVORITES,
                payload: data.favorites
            })
        } catch (error) {
            return dispatch({
                type: GET_FAVORITES,
                error: error
            })

        }
    }
}

export function addFavorites(id) {
    return async (dispatch) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await FetchWithAuth('http://localhost:3001/products/user/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                data: JSON.stringify({productId: id})
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
}
export function removeFavorites(id) {
    return async (dispatch) => {
        const accessToken = localStorage.getItem("accessToken");
        try {
                const response = await FetchWithAuth(`http://localhost:3001/delete-favorite/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
}