import pool from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ─── Admin Login ──────────────────────────────────────────────────────────────
// Admin credentials are set in .env - no registration possible
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@jobverse.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

        if (email !== ADMIN_EMAIL) {
            return res.status(401).json({ message: "Invalid admin credentials.", success: false });
        }

        const isMatch = password === ADMIN_PASSWORD;
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin credentials.", success: false });
        }

        const token = jwt.sign(
            { adminId: "superadmin", role: "admin" },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res.status(200)
            .cookie("adminToken", token, { maxAge: 86400000, httpOnly: true, sameSite: "strict" })
            .json({ message: "Welcome, Admin!", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const adminLogout = async (req, res) => {
    return res.status(200)
        .cookie("adminToken", "", { maxAge: 0 })
        .json({ message: "Admin logged out.", success: true });
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getStats = async (req, res) => {
    try {
        const [[{ totalUsers }]]       = await pool.execute("SELECT COUNT(*) as totalUsers FROM users");
        const [[{ totalRecruiters }]]  = await pool.execute("SELECT COUNT(*) as totalRecruiters FROM users WHERE role = 'recruiter'");
        const [[{ totalStudents }]]    = await pool.execute("SELECT COUNT(*) as totalStudents FROM users WHERE role = 'student'");
        const [[{ totalCompanies }]]   = await pool.execute("SELECT COUNT(*) as totalCompanies FROM companies");
        const [[{ pendingCompanies }]] = await pool.execute("SELECT COUNT(*) as pendingCompanies FROM companies WHERE status = 'pending'");
        const [[{ totalJobs }]]        = await pool.execute("SELECT COUNT(*) as totalJobs FROM jobs");
        const [[{ pendingJobs }]]      = await pool.execute("SELECT COUNT(*) as pendingJobs FROM jobs WHERE status = 'pending'");
        const [[{ approvedJobs }]]     = await pool.execute("SELECT COUNT(*) as approvedJobs FROM jobs WHERE status = 'approved'");
        const [[{ totalApplications }]]= await pool.execute("SELECT COUNT(*) as totalApplications FROM applications");

        return res.status(200).json({
            stats: {
                totalUsers, totalRecruiters, totalStudents,
                totalCompanies, pendingCompanies,
                totalJobs, pendingJobs, approvedJobs,
                totalApplications
            },
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.execute(
            "SELECT id, fullname, email, phone_number, role, profile_photo, created_at FROM users ORDER BY created_at DESC"
        );
        return res.status(200).json({ users: users.map(u => ({
            _id: u.id, fullname: u.fullname, email: u.email,
            phoneNumber: u.phone_number, role: u.role,
            profilePhoto: u.profile_photo, createdAt: u.created_at
        })), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT id FROM users WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found.", success: false });
        await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
        return res.status(200).json({ message: "User deleted.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ─── Companies ────────────────────────────────────────────────────────────────
export const getAllCompanies = async (req, res) => {
    try {
        const [companies] = await pool.execute(
            `SELECT c.*, u.fullname as owner_name, u.email as owner_email
             FROM companies c LEFT JOIN users u ON c.user_id = u.id
             ORDER BY c.created_at DESC`
        );
        return res.status(200).json({ companies: companies.map(c => ({
            _id: c.id, name: c.name, description: c.description,
            website: c.website, location: c.location, logo: c.logo,
            status: c.status, createdAt: c.created_at,
            owner: { fullname: c.owner_name, email: c.owner_email }
        })), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateCompanyStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' | 'rejected'
        if (!['approved','rejected','pending'].includes(status)) {
            return res.status(400).json({ message: "Invalid status.", success: false });
        }
        const [rows] = await pool.execute("SELECT id FROM companies WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Company not found.", success: false });
        await pool.execute("UPDATE companies SET status = ? WHERE id = ?", [status, req.params.id]);

        // If company rejected, also reject all its pending jobs
        if (status === 'rejected') {
            await pool.execute("UPDATE jobs SET status = 'rejected' WHERE company_id = ? AND status = 'pending'", [req.params.id]);
        }

        return res.status(200).json({ message: `Company ${status}.`, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        await pool.execute("DELETE FROM companies WHERE id = ?", [req.params.id]);
        return res.status(200).json({ message: "Company deleted.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const getAllJobsAdmin = async (req, res) => {
    try {
        const [jobs] = await pool.execute(
            `SELECT j.*, c.id as c_id, c.name as c_name, c.logo as c_logo,
                    u.fullname as poster_name, u.email as poster_email
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             LEFT JOIN users u ON j.created_by = u.id
             ORDER BY j.created_at DESC`
        );
        return res.status(200).json({ jobs: jobs.map(j => ({
            _id: j.id, title: j.title, description: j.description,
            salary: j.salary, location: j.location, jobType: j.job_type,
            experienceLevel: j.experience_level, position: j.position,
            status: j.status, createdAt: j.created_at,
            company: { _id: j.c_id, name: j.c_name, logo: j.c_logo },
            postedBy: { fullname: j.poster_name, email: j.poster_email }
        })), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' | 'rejected' | 'pending'
        if (!['approved','rejected','pending'].includes(status)) {
            return res.status(400).json({ message: "Invalid status.", success: false });
        }
        const [rows] = await pool.execute("SELECT id FROM jobs WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Job not found.", success: false });
        await pool.execute("UPDATE jobs SET status = ? WHERE id = ?", [status, req.params.id]);
        return res.status(200).json({ message: `Job ${status}.`, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteJob = async (req, res) => {
    try {
        await pool.execute("DELETE FROM jobs WHERE id = ?", [req.params.id]);
        return res.status(200).json({ message: "Job deleted.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const getAllApplicationsAdmin = async (req, res) => {
    try {
        const [apps] = await pool.execute(
            `SELECT a.*, j.title as job_title, c.name as company_name,
                    u.fullname as applicant_name, u.email as applicant_email
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             LEFT JOIN users u ON a.applicant_id = u.id
             ORDER BY a.created_at DESC`
        );
        return res.status(200).json({ applications: apps.map(a => ({
            _id: a.id, status: a.status, createdAt: a.created_at,
            job: { title: a.job_title, company: a.company_name },
            applicant: { fullname: a.applicant_name, email: a.applicant_email }
        })), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};
