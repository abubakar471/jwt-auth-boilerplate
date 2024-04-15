import { configureStore, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { authApi } from "../services/auth/authService";
axios.defaults.withCredentials = true;



const authSlice = createSlice({
    name: "auth",
    initialState: { isSignedIn: false, user: null },
    reducers: {
        signin(state) {
            state.isSignedIn = true;
        },
        signout(state) {
            state.isSignedIn = false;
        },
        setCredentials(state, { payload }) {
            if (payload?.data?.user) {
                state.isSignedIn = true;
                state.user = payload?.data?.user;
            }
        },
        async getUser(state) {
            try {
                console.log("redux getting user....")
                const res = await axios.get(`${process.env.REACT_APP_CLIENT_URL}/api/user/get-user`, {
                    withCredentials: true
                })

                if (res.data.success) {
                    state.user = res.data.data.user;
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
})

export const authActions = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})