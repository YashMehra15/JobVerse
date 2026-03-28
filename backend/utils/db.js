import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jobverse',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL connected successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL connection error:', error.message);
        process.exit(1);
    }
};

export const initDB = async () => {
    try {
        const [versionRows] = await pool.execute("SELECT VERSION() as ver");
        console.log("MySQL version:", versionRows[0].ver);

        await pool.execute(`CREATE TABLE IF NOT EXISTS users (
            id CHAR(36) NOT NULL,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone_number VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('student','recruiter') NOT NULL,
            bio TEXT,
            skills TEXT,
            resume_url VARCHAR(500),
            resume_original_name VARCHAR(255),
            profile_photo VARCHAR(500) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);

        await pool.execute(`CREATE TABLE IF NOT EXISTS companies (
            id CHAR(36) NOT NULL,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            website VARCHAR(500),
            location VARCHAR(255),
            logo VARCHAR(500),
            user_id CHAR(36) NOT NULL,
            status ENUM('pending','approved','rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        await pool.execute(`CREATE TABLE IF NOT EXISTS jobs (
            id CHAR(36) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT,
            salary DECIMAL(15,2) NOT NULL,
            experience_level INT NOT NULL DEFAULT 0,
            location VARCHAR(255) NOT NULL,
            job_type VARCHAR(100) NOT NULL,
            position INT NOT NULL DEFAULT 1,
            company_id CHAR(36) NOT NULL,
            created_by CHAR(36) NOT NULL,
            status ENUM('pending','approved','rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
        )`);

        await pool.execute(`CREATE TABLE IF NOT EXISTS applications (
            id CHAR(36) NOT NULL,
            job_id CHAR(36) NOT NULL,
            applicant_id CHAR(36) NOT NULL,
            status ENUM('pending','accepted','rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
            FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_application (job_id, applicant_id)
        )`);

        // Add status column to existing tables if they don't have it
        await pool.execute(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS status ENUM('pending','approved','rejected') DEFAULT 'pending'`).catch(() => {});
        await pool.execute(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status ENUM('pending','approved','rejected') DEFAULT 'pending'`).catch(() => {});

        console.log('Database tables initialized');
    } catch (error) {
        console.error('DB init error:', error.message);
        throw error;
    }
};

export default pool;
