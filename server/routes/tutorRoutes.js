import express from "express";
import {
    registerTutor,
    loginTutor,
    getTutorProfile,
    updateTutorProfile,
    submitVerification,
    getAllTutors,
    getTutorById,
    getTutorSessions,
    updateSessionStatus,
    getTutorEarnings
} from "../controllers/tutorController.js";
import { protectTutor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerTutor);
router.post("/login", loginTutor);
router.get("/profile", protectTutor, getTutorProfile);
router.put("/profile", protectTutor, updateTutorProfile);
router.post("/submit-verification", protectTutor, submitVerification);
// Get tutor's sessions
router.get("/sessions", protectTutor, getTutorSessions);

// Accept/Reject session
router.put("/sessions/:sessionId", protectTutor, updateSessionStatus);

// Get tutor earnings
router.get("/earnings", protectTutor, getTutorEarnings);

router.get("/", getAllTutors);

router.get("/:id", getTutorById);

export default router;
