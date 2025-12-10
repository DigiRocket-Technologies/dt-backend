import jwt from "jsonwebtoken";

export const protectedRoute = (req, res, next) => {
  try {
    const token = req.cookies.auth_tokens;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized - No token" });

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
