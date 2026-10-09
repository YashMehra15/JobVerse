import { configureStore } from "@reduxjs/toolkit";
import authSlice, { setUser } from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";
import adminSlice from "./adminSlice";

// Load user from localStorage on startup
const loadUser = () => {
    try {
        const saved = localStorage.getItem("jv_user");
        return saved ? { user: JSON.parse(saved), loading: false } : undefined;
    } catch { return undefined; }
};

const store = configureStore({
    reducer: {
        auth:        authSlice,
        job:         jobSlice,
        company:     companySlice,
        application: applicationSlice,
        admin:       adminSlice,
    },
    preloadedState: {
        auth: loadUser(),
    }
});

// Save user to localStorage whenever it changes
store.subscribe(() => {
    try {
        const { user } = store.getState().auth;
        if (user) localStorage.setItem("jv_user", JSON.stringify(user));
        else localStorage.removeItem("jv_user");
    } catch {}
});

export default store;