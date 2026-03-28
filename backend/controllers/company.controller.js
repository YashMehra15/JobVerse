import pool from "../utils/db.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) return res.status(400).json({ message: "Company name is required.", success: false });

        const [existing] = await pool.execute("SELECT id FROM companies WHERE name = ?", [companyName]);
        if (existing.length > 0) return res.status(400).json({ message: "Company name already exists.", success: false });

        const newId = uuidv4();
        await pool.execute(
            "INSERT INTO companies (id, name, user_id, status) VALUES (?, ?, ?, 'pending')",
            [newId, companyName, req.id]
        );

        const [company] = await pool.execute("SELECT * FROM companies WHERE id = ?", [newId]);
        return res.status(201).json({
            message: "Company registered and submitted for admin approval.",
            company: formatCompany(company[0]),
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
};

export const getCompany = async (req, res) => {
    try {
        const [companies] = await pool.execute(
            "SELECT * FROM companies WHERE user_id = ? ORDER BY created_at DESC",
            [req.id]
        );
        return res.status(200).json({ companies: companies.map(formatCompany), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM companies WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Company not found.", success: false });
        return res.status(200).json({ company: formatCompany(rows[0]), success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        let logo = null;

        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            } catch (uploadErr) {
                console.warn("Logo upload skipped:", uploadErr.message);
            }
        }

        const [existing] = await pool.execute("SELECT * FROM companies WHERE id = ?", [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: "Company not found.", success: false });

        await pool.execute(
            `UPDATE companies SET
                name = COALESCE(?, name), description = COALESCE(?, description),
                website = COALESCE(?, website), location = COALESCE(?, location),
                logo = COALESCE(?, logo)
             WHERE id = ?`,
            [name || null, description || null, website || null, location || null, logo, req.params.id]
        );

        return res.status(200).json({ message: "Company updated.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};

const formatCompany = (c) => ({
    _id: c.id,
    name: c.name,
    description: c.description,
    website: c.website,
    location: c.location,
    logo: c.logo,
    userId: c.user_id,
    status: c.status,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
});
