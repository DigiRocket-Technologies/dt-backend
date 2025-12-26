import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.js";
import UserModel from "../models/user.js";
import { connectDB } from '../config/db.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        await connectDB();
        let user = await AdminModel.findOne({ email }); if (!user) user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User Not Found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, email: user.email, author: user.author }, process.env.JWT_SECRET_KEY || "defaultsecret", { expiresIn: "7d" });

        const { firstName, userType } = user;
        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: { firstName, userType }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

export const verifyAuth = async (req, res) => {
    try {
        await connectDB();
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ success: false, message: "No token provided" });

        const token = authHeader.split(" ")[1];
        jwt.verify( token, process.env.JWT_SECRET_KEY || "defaultsecret", (err, decoded) => {
                if (err)
                    return res.status(403).json({ success: false, message: "Invalid or expired token" });
                res.status(200).json({ success: true, message: "User authenticated successfully", user: decoded, });
            }
        );
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message, });
    }
};



