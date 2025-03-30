import Session from "../models/session.js";
import User from "../models/User.js";

// Get all sessions booked by a student
export const getStudentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.params.studentId }).populate("tutorId");
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student sessions" });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Get all available tutors
export const getAvailableTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor" }).select("-password");
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
};
