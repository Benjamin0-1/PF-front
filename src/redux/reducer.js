import { ADD_CART, CLEAR_CART, LOGIN_ERROR_USER, LOGIN_USER, REMOVE_CART, SIGNUP_ERROR_USER, SIGNUP_USER } from "./action-types-products"

const initialProductsState = {
    cart: [],
}
const initialUserState = {
    logged: localStorage.getItem("accessToken") ? true : false,
    isAdmin: localStorage.getItem("isAdmin") || false,
    tokens: {
        accessToken: localStorage.getItem("accessToken") || "",
        refreshToken: localStorage.getItem("refreshToken") || ""
    },
    userProfile: JSON.parse(localStorage.getItem("userInfo")) || {},
    error: "",
    success: ""
}

export const reducerUser = (state = initialUserState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
            }
        case LOGIN_ERROR_USER:
            return {
                ...state,
                error: action.error
            }
        case SIGNUP_USER:
            return {
                ...state,
                success: action.payload
            }
        case SIGNUP_ERROR_USER:
            return {
                ...state,
                error: action.payload
            }
        default:
            return {
                ...state,
            };
    }
}

export const reducerProducts = (state = initialProductsState, action) => {
    switch (action.type) {
        case ADD_CART:

            const existingProductIndex = state.cart.findIndex(
                (product) => product.id === action.payload.id
            );

            if (existingProductIndex >= 0) {
                const newCart = [ ...state.cart ];
                newCart[ existingProductIndex ] = {
                    ...newCart[ existingProductIndex ],
                    quantity: (newCart[ existingProductIndex ].quantity || 1) + 1,
                };

                return {
                    ...state,
                    cart: newCart,
                };
            }

            return {
                ...state,
                cart: [ ...state.cart, { ...action.payload, quantity: 1 } ],
            };
        case REMOVE_CART:
            const existingProductIndexRemove = state.cart.findIndex(
                (product) => product.id === action.payload.id
            );

            if (existingProductIndexRemove >= 0) {
                const newCart = [ ...state.cart ];
                newCart[ existingProductIndexRemove ].quantity -= 1;

                if (newCart[ existingProductIndexRemove ].quantity === 0) {
                    newCart.splice(existingProductIndexRemove, 1);
                }

                return {
                    ...state,
                    cart: newCart,
                };
            }
            return state;

        case CLEAR_CART:
            return {
                ...state,
                cart: []
            }
        default:
            return {
                ...state,
            };
    }
};

