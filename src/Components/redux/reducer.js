import { ADD_CART, CLEAR_CART, REMOVE_CART } from "./action-types-products"

const initialProductsState = {
    cart: [],

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

