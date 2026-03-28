import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
        allAppliedJobs: [],
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        updateApplicationStatus: (state, action) => {
            const { id, status } = action.payload;
            if (state.applicants?.applications) {
                const app = state.applicants.applications.find(a => a._id === id);
                if (app) app.status = status;
            }
        }
    }
});

export const { setAllApplicants, setAllAppliedJobs, updateApplicationStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
