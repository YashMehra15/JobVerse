import pool from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job id is required.", success: false });
        }

        const [existing] = await pool.execute(
            "SELECT id FROM applications WHERE job_id = ? AND applicant_id = ?",
            [jobId, userId]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }

        const [job] = await pool.execute("SELECT id FROM jobs WHERE id = ?", [jobId]);
        if (job.length === 0) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        const newId = uuidv4();
        await pool.execute(
            "INSERT INTO applications (id, job_id, applicant_id) VALUES (?, ?, ?)",
            [newId, jobId, userId]
        );

        return res.status(201).json({ message: "Job applied successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const [applications] = await pool.execute(
            `SELECT a.*, 
                j.id as j_id, j.title, j.description, j.requirements, j.salary, j.experience_level, j.location, j.job_type, j.position,
                c.id as c_id, c.name as c_name, c.description as c_desc, c.website as c_website, c.location as c_location, c.logo as c_logo
             FROM applications a
             LEFT JOIN jobs j ON a.job_id = j.id
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE a.applicant_id = ?
             ORDER BY a.created_at DESC`,
            [userId]
        );

        return res.status(200).json({
            application: applications.map(a => ({
                _id: a.id,
                status: a.status,
                createdAt: a.created_at,
                job: {
                    _id: a.j_id,
                    title: a.title,
                    description: a.description,
                    requirements: a.requirements ? a.requirements.split(",") : [],
                    salary: a.salary,
                    experienceLevel: a.experience_level,
                    location: a.location,
                    jobType: a.job_type,
                    position: a.position,
                    company: a.c_id ? {
                        _id: a.c_id,
                        name: a.c_name,
                        description: a.c_desc,
                        website: a.c_website,
                        location: a.c_location,
                        logo: a.c_logo,
                    } : null,
                }
            })),
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        const [jobs] = await pool.execute(
            `SELECT j.*, c.id as c_id, c.name as c_name, c.logo as c_logo
             FROM jobs j LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.id = ?`,
            [jobId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        const [applications] = await pool.execute(
            `SELECT a.*, u.id as u_id, u.fullname, u.email, u.phone_number, u.profile_photo, u.bio, u.skills, u.resume_url, u.resume_original_name
             FROM applications a LEFT JOIN users u ON a.applicant_id = u.id
             WHERE a.job_id = ? ORDER BY a.created_at DESC`,
            [jobId]
        );

        const job = {
            _id: jobs[0].id,
            title: jobs[0].title,
            company: { _id: jobs[0].c_id, name: jobs[0].c_name, logo: jobs[0].c_logo },
            applications: applications.map(a => ({
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
            }))
        };

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: "Status is required", success: false });
        }

        const [rows] = await pool.execute("SELECT id FROM applications WHERE id = ?", [applicationId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        await pool.execute(
            "UPDATE applications SET status = ? WHERE id = ?",
            [status.toLowerCase(), applicationId]
        );

        return res.status(200).json({ message: "Status updated successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
