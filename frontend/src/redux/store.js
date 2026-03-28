import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";
import adminSlice from "./adminSlice";

const store = configureStore({
    reducer: {
        auth:        authSlice,
        job:         jobSlice,
        company:     companySlice,
        application: applicationSlice,
        admin:       adminSlice,
    }
});

export default store;