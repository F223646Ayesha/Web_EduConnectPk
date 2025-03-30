import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getPendingTutors, verifyTutor, getTutorStats,getPopularSubjects, getSessionCompletionRates, getPlatformUsageByCity, getUserGrowth } from "../controllers/adminController.js";

const router = express.Router();

// 📌 Fetch pending tutor verifications
router.get("/tutors/pending", protect, adminOnly, getPendingTutors);

// 📌 Approve/Reject tutor verification
router.put("/tutors/:id/verify", protect, adminOnly, verifyTutor);

// 📌 Fetch tutor verification statistics
router.get("/tutors/stats", protect, adminOnly, getTutorStats);
// 📌 Get popular subjects
router.get("/reports/popular-subjects", protect, adminOnly, getPopularSubjects);

// 📌 Get session completion rates
router.get("/reports/session-completion", protect, adminOnly, getSessionCompletionRates);

// 📌 Get platform usage by city
router.get("/reports/platform-usage", protect, adminOnly, getPlatformUsageByCity);

// 📌 Get user growth over time
router.get("/reports/user-growth", protect, adminOnly, getUserGrowth);
export default router;
