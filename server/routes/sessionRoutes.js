import express from "express";
import { bookSession, getStudentSessions, getTutorSessions, updateSessionStatus, deleteSession, rescheduleSession, completeSession} from "../controllers/sessionController.js";
import { protect, studentOnly, tutorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/book", protect, studentOnly, bookSession);

// 📌 Get all sessions for a tutor (Only tutors)
router.get("/tutor/:tutorId", protect, tutorOnly, getTutorSessions);

// 📌 Get all sessions for a student (Only students)
router.get("/student/:studentId", protect, studentOnly, getStudentSessions);

// 📌 Update session status (Confirm, Complete, Cancel)
router.put("/:sessionId/status", protect, updateSessionStatus);
//router.get('/tutor', getTutorSessions);
router.delete("/:sessionId", protect, deleteSession);

router.put("/reschedule/:sessionId", protect, rescheduleSession); // ✅ New Reschedule API
router.put("/complete/:sessionId", protect, completeSession);
export default router;
