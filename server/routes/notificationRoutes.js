import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new notification
router.post("/", createNotification);

// ✅ Get unread notifications for a student
router.get("/:studentId", protect, studentOnly, getNotifications);

// ✅ Mark a notification as read
router.put("/:notificationId/read", protect, studentOnly, markAsRead);

export default router;
