import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isRemoteDatabase =
    Boolean(process.env.DB_HOST) &&
    process.env.DB_HOST !== 'localhost' &&
    process.env.DB_HOST !== '127.0.0.1';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jobverse',

    // Aiven requires SSL for remote MySQL connections.
    // Certificate verification remains enabled.
    ssl: isRemoteDatabase
        ? {
              rejectUnauthorized: true,
          }
        : undefined,

    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

// Test the database connection.
export const connectDB = async () => {
    let connection;

    try {
        connection = await pool.getConnection();

        console.log('MySQL connected successfully');
    } catch (error) {
        console.error(
            'MySQL connection error:',
            error.message
        );

        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Create and initialize the required database tables.
export const initDB = async () => {
    try {
        const [versionRows] = await pool.execute(
            'SELECT VERSION() AS ver'
        );

        console.log('MySQL version:', versionRows[0].ver);

        // Users table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) NOT NULL,
                fullname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone_number VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('student', 'recruiter') NOT NULL,
                bio TEXT,
                skills TEXT,
                resume_url VARCHAR(500),
                resume_original_name VARCHAR(255),
                profile_photo VARCHAR(500) DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);

        // Companies table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS companies (
                id CHAR(36) NOT NULL,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                website VARCHAR(500),
                location VARCHAR(255),
                logo VARCHAR(500),
                user_id CHAR(36) NOT NULL,
                status ENUM('pending', 'approved', 'rejected')
                    DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `);

        // Jobs table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS jobs (
                id CHAR(36) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                requirements TEXT,
                salary DECIMAL(15, 2) NOT NULL,
                experience_level INT NOT NULL DEFAULT 0,
                location VARCHAR(255) NOT NULL,
                job_type VARCHAR(100) NOT NULL,
                position INT NOT NULL DEFAULT 1,
                company_id CHAR(36) NOT NULL,
                created_by CHAR(36) NOT NULL,
                status ENUM('pending', 'approved', 'rejected')
                    DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (company_id)
                    REFERENCES companies(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (created_by)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `);

        // Applications table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS applications (
                id CHAR(36) NOT NULL,
                job_id CHAR(36) NOT NULL,
                applicant_id CHAR(36) NOT NULL,
                status ENUM('pending', 'accepted', 'rejected')
                    DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                FOREIGN KEY (job_id)
                    REFERENCES jobs(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (applicant_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                UNIQUE KEY unique_application (job_id, applicant_id)
            )
        `);

        // Ensure status columns exist in older installations.
        // Existing columns are left unchanged.
        const ensureStatusColumn = async (tableName) => {
            const [columns] = await pool.execute(
                `
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = ?
                  AND COLUMN_NAME = 'status'
                `,
                [tableName]
            );

            if (columns.length === 0) {
                await pool.execute(`
                    ALTER TABLE \`${tableName}\`
                    ADD COLUMN status
                    ENUM('pending', 'approved', 'rejected')
                    DEFAULT 'pending'
                `);
            }
        };

        await ensureStatusColumn('companies');
        await ensureStatusColumn('jobs');

        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error(
            'DB initialization error:',
            error.message
        );

        throw error;
    }
};

export default pool;