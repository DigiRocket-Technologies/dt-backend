import jwt from "jsonwebtoken"


export const protectedRoute = async (req, res, next) => {
    try {
        const token = req?.headers["authorization"]?.trim() || null;

        if (!token) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: "Unauthorized - Access" });
        }
     
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!verifiedToken) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: "Unauthorized - Access" });
        }
        
           const exp = verifiedToken.exp;
        if (exp && exp < Math.floor(Date.now() / 1000)) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: "Session expired, please log in again" });
        }


        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

