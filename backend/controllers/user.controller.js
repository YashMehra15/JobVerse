import pool from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists with this email.", success: false });
        }

        let profilePhotoUrl = "";
        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (uploadErr) {
                console.warn("Profile photo upload skipped:", uploadErr.message);
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newId = uuidv4();
        await pool.execute(
            "INSERT INTO users (id, fullname, email, phone_number, password, role, profile_photo) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [newId, fullname, email, phoneNumber, hashedPassword, role, profilePhotoUrl]
        );

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        const user = rows[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }

        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userData = {
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phone_number,
            role: user.role,
            profile: {
                bio: user.bio,
                skills: user.skills ? user.skills.split(",") : [],
                resume: user.resume_url,
                resumeOriginalName: user.resume_original_name,
                profilePhoto: user.profile_photo
            }
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: 'strict' })
            .json({ message: `Welcome back ${user.fullname}`, user: userData, success: true });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully.", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        let resumeUrl = rows[0].resume_url;
        let resumeOriginalName = rows[0].resume_original_name;

        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                resumeUrl = cloudResponse.secure_url;
                resumeOriginalName = file.originalname;
            } catch (uploadErr) {
                console.warn("Resume upload failed:", uploadErr.message);
            }
        }

        await pool.execute(
            `UPDATE users SET 
                fullname = COALESCE(?, fullname),
                email = COALESCE(?, email),
                phone_number = COALESCE(?, phone_number),
                bio = COALESCE(?, bio),
                skills = COALESCE(?, skills),
                resume_url = ?,
                resume_original_name = ?
            WHERE id = ?`,
            [fullname || null, email || null, phoneNumber || null, bio || null, skills || null, resumeUrl, resumeOriginalName, userId]
        );

        const [updated] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
        const user = updated[0];

        const userData = {
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phone_number,
            role: user.role,
            profile: {
                bio: user.bio,
                skills: user.skills ? user.skills.split(",") : [],
                resume: user.resume_url,
                resumeOriginalName: user.resume_original_name,
                profilePhoto: user.profile_photo
            }
        };

        return res.status(200).json({ message: "Profile updated successfully.", user: userData, success: true });
    } catch (error) {
        console.error("UpdateProfile error:", error);
        return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
};
