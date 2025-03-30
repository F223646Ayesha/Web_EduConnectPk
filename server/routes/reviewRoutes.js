import express from "express";
import { addReview, getTutorReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview); // Submit review
router.get("/:tutorId", getTutorReviews); // Get all reviews for a tutor

export default router;
