import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tutor from "../models/Tutor.js";

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
    console.log("Admin Middleware - User Data:", req.user); // 🛠 Debugging
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      console.error("❌ Access denied - Not an admin:", req.user);
      res.status(403).json({ message: "Access denied, admin only" });
    }
  };
  

// Tutor-only middleware
const tutorOnly = (req, res, next) => {
  if (req.user && req.user.role === "tutor") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, tutor only" });
  }
};

// Student-only middleware
const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, student only" });
  }
};

export const protectTutor = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("Decoded Token:", decoded); // 🛠 Debug: Log the decoded token

            // ✅ Fetch tutor from `Tutor` model instead of `User`
            const tutor = await Tutor.findById(decoded.id).select("-password");

            if (!tutor) {
                console.error("❌ Tutor not found or not authorized:", decoded.id);
                return res.status(401).json({ message: "Unauthorized, tutor not found" });
            }

            console.log("✅ Tutor Found:", tutor); // 🛠 Debug: Log the found tutor

            req.user = tutor; // Store the tutor data in `req.user`
            next();
        } catch (error) {
            console.error("❌ JWT verification failed:", error);
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }
    } else {
        console.error("❌ No authorization token provided");
        return res.status(401).json({ message: "No token provided" });
    }
};



export { protect, adminOnly, tutorOnly, studentOnly };
