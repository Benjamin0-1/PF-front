import axios from "axios"
import { LOGIN_ERROR_USER, LOGIN_USER, SIGNUP_ERROR_USER, SIGNUP_USER } from "./action-types-products"
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
            })
        } catch (error) {
            return dispatch({
                type: LOGIN_ERROR_USER,
                // error: error.response.data.message
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