import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux';
import { reducerProducts, reducerUser} from './reducer';
import { thunk as thunkMiddleware } from "redux-thunk"


// Combina los reducers
const rootReducer = combineReducers({
    user: reducerUser,
    products: reducerProducts,

});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer, // Utiliza el reducer combinado aquí
    composeEnhancer(applyMiddleware(thunkMiddleware))
);
export default store;