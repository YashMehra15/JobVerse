import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        isAdminLoggedIn: false,
        stats: null,
        users: [],
        companies: [],
        jobs: [],
        applications: [],
        loading: false,
    },
    reducers: {
        setAdminLoggedIn:  (s, a) => { s.isAdminLoggedIn = a.payload; },
        setStats:          (s, a) => { s.stats = a.payload; },
        setAdminUsers:     (s, a) => { s.users = a.payload; },
        setAdminCompanies: (s, a) => { s.companies = a.payload; },
        setAdminJobs:      (s, a) => { s.jobs = a.payload; },
        setAdminApps:      (s, a) => { s.applications = a.payload; },
        setAdminLoading:   (s, a) => { s.loading = a.payload; },
        updateAdminCompanyStatus: (s, a) => {
            const c = s.companies.find(x => x._id === a.payload.id);
            if (c) c.status = a.payload.status;
        },
        updateAdminJobStatus: (s, a) => {
            const j = s.jobs.find(x => x._id === a.payload.id);
            if (j) j.status = a.payload.status;
        },
        removeAdminUser:    (s, a) => { s.users = s.users.filter(u => u._id !== a.payload); },
        removeAdminCompany: (s, a) => { s.companies = s.companies.filter(c => c._id !== a.payload); },
        removeAdminJob:     (s, a) => { s.jobs = s.jobs.filter(j => j._id !== a.payload); },
    }
});

export const {
    setAdminLoggedIn, setStats, setAdminUsers, setAdminCompanies,
    setAdminJobs, setAdminApps, setAdminLoading,
    updateAdminCompanyStatus, updateAdminJobStatus,
    removeAdminUser, removeAdminCompany, removeAdminJob
} = adminSlice.actions;
export default adminSlice.reducer;
