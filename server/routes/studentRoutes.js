import express from "express";
import { getStudentSessions, updateStudentProfile, getAvailableTutors } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
router.get("/sessions/:studentId", getStudentSessions);
// Get all sessions booked by a student
router.get("/:studentId/sessions", protect, getStudentSessions);

// Update student profile
router.put("/:studentId/profile", protect, updateStudentProfile);

// Get all available tutors
router.get("/tutors", protect, getAvailableTutors);

export default router;
