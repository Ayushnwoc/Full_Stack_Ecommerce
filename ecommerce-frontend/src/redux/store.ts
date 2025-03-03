import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";


export const server = import.meta.env.VITE_SERVER;

// We can add all reducers in it
export const store = configureStore({
    reducer: {
        // userAPI: userAPI.reducer,
        [userAPI.reducerPath]: userAPI.reducer, 
        [userReducer.name]: userReducer.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware, productAPI.middleware),
});