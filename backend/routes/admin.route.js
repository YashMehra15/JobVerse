import express from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
    adminLogin, adminLogout, getStats,
    getAllUsers, deleteUser,
    getAllCompanies, updateCompanyStatus, deleteCompany,
    getAllJobsAdmin, updateJobStatus, deleteJob,
    getAllApplicationsAdmin
} from "../controllers/admin.controller.js";

const router = express.Router();

// Auth (no middleware needed)
router.post("/login",  adminLogin);
router.get("/logout",  adminLogout);

// Protected admin routes
router.get("/stats",               isAdmin, getStats);
router.get("/users",               isAdmin, getAllUsers);
router.delete("/users/:id",        isAdmin, deleteUser);
router.get("/companies",           isAdmin, getAllCompanies);
router.patch("/companies/:id",     isAdmin, updateCompanyStatus);
router.delete("/companies/:id",    isAdmin, deleteCompany);
router.get("/jobs",                isAdmin, getAllJobsAdmin);
router.patch("/jobs/:id",          isAdmin, updateJobStatus);
router.delete("/jobs/:id",         isAdmin, deleteJob);
router.get("/applications",        isAdmin, getAllApplicationsAdmin);

export default router;
