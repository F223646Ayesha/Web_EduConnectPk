import mongoose from "mongoose";
import Notification from "../models/Notification.js";

// ✅ Create a new notification
export const createNotification = async (req, res) => {
  const { studentId, message } = req.body;

  try {
    const studentObjectId = new mongoose.Types.ObjectId(studentId); // Convert to ObjectId
    const notification = new Notification({ studentId: studentObjectId, message });
    await notification.save();
    res.status(201).json({ message: "Notification created successfully", notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification", details: error.message });
  }
};

// ✅ Get unread notifications for a student
export const getNotifications = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.params.studentId);
    const notifications = await Notification.find({ studentId, isRead: false });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications", details: error.message });
  }
};

// ✅ Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.notificationId, { isRead: true });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification", details: error.message });
  }
};
