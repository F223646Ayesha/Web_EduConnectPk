import express from "express";
import { getReports, generateReport } from "../controllers/reportController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all reports (Admins only)
router.get("/", protect, adminOnly, getReports);

// Generate a new report (Manual trigger for testing)
router.post("/", protect, adminOnly, generateReport);

export default router;
