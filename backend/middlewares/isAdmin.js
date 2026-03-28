import jwt from "jsonwebtoken";

const isAdmin = (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;
        if (!token) {
            return res.status(401).json({ message: "Admin access required.", success: false });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Not authorized as admin.", success: false });
        }

        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired admin session.", success: false });
    }
};

export default isAdmin;
