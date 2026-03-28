import pool from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({ message: "Something is missing.", success: false });
        }

        // Check if company is approved before allowing job post
        const [company] = await pool.execute("SELECT id, status FROM companies WHERE id = ?", [companyId]);
        if (company.length === 0) return res.status(404).json({ message: "Company not found.", success: false });
        if (company[0].status !== 'approved') {
            return res.status(403).json({ message: "Your company must be approved by admin before posting jobs.", success: false });
        }

        const newId = uuidv4();
        await pool.execute(
            `INSERT INTO jobs (id, title, description, requirements, salary, experience_level, location, job_type, position, company_id, created_by, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [newId, title, description, requirements, Number(salary), Number(experience), location, jobType, Number(position), companyId, userId]
        );

        const [rows] = await pool.execute(
            `SELECT j.*, c.id as c_id, c.name as c_name, c.description as c_desc, c.website as c_website, c.location as c_location, c.logo as c_logo
             FROM jobs j LEFT JOIN companies c ON j.company_id = c.id WHERE j.id = ?`,
            [newId]
        );

        return res.status(201).json({ message: "Job submitted for admin review. It will appear publicly once approved.", job: formatJob(rows[0]), success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
};

// Public - only approved jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const search = `%${keyword}%`;
        const [jobs] = await pool.execute(
            `SELECT j.*, c.id as c_id, c.name as c_name, c.description as c_desc, c.website as c_website, c.location as c_location, c.logo as c_logo
             FROM jobs j LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.status = 'approved' AND (j.title LIKE ? OR j.description LIKE ?)
             ORDER BY j.created_at DESC`,
            [search, search]
        );
        return res.status(200).json({ jobs: jobs.map(formatJob), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getJobById = async (req, res) => {
    try {
        const [jobs] = await pool.execute(
            `SELECT j.*, c.id as c_id, c.name as c_name, c.description as c_desc, c.website as c_website, c.location as c_location, c.logo as c_logo
             FROM jobs j LEFT JOIN companies c ON j.company_id = c.id WHERE j.id = ?`,
            [req.params.id]
        );
        if (jobs.length === 0) return res.status(404).json({ message: "Job not found.", success: false });

        const [applications] = await pool.execute(
            `SELECT a.*, u.id as u_id, u.fullname, u.email, u.phone_number, u.profile_photo, u.bio, u.skills, u.resume_url, u.resume_original_name
             FROM applications a LEFT JOIN users u ON a.applicant_id = u.id
             WHERE a.job_id = ? ORDER BY a.created_at DESC`,
            [req.params.id]
        );
        const job = formatJob(jobs[0]);
        job.applications = applications.map(formatApplicationWithApplicant);
        return res.status(200).json({ job, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Recruiter sees their own jobs (all statuses)
export const getAdminJobs = async (req, res) => {
    try {
        const [jobs] = await pool.execute(
            `SELECT j.*, c.id as c_id, c.name as c_name, c.description as c_desc, c.website as c_website, c.location as c_location, c.logo as c_logo
             FROM jobs j LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.created_by = ? ORDER BY j.created_at DESC`,
            [req.id]
        );
        return res.status(200).json({ jobs: jobs.map(formatJob), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

const formatJob = (j) => ({
    _id: j.id,
    title: j.title,
    description: j.description,
    requirements: j.requirements ? j.requirements.split(",") : [],
    salary: j.salary,
    experienceLevel: j.experience_level,
    location: j.location,
    jobType: j.job_type,
    position: j.position,
    status: j.status,
    company: j.c_id ? { _id: j.c_id, name: j.c_name, description: j.c_desc, website: j.c_website, location: j.c_location, logo: j.c_logo } : null,
    created_by: j.created_by,
    createdAt: j.created_at,
    updatedAt: j.updated_at,
});

const formatApplicationWithApplicant = (a) => ({
    _id: a.id,
    status: a.status,
    createdAt: a.created_at,
    applicant: {
        _id: a.u_id,
        fullname: a.fullname,
        email: a.email,
        phoneNumber: a.phone_number,
        profile: {
            bio: a.bio,
            skills: a.skills ? a.skills.split(",") : [],
            resume: a.resume_url,
            resumeOriginalName: a.resume_original_name,
            profilePhoto: a.profile_photo,
        }
    }
});
