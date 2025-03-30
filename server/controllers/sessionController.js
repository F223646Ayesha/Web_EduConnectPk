import Session from "../models/session.js";
import User from "../models/User.js";
const validStatuses = ["scheduled", "completed", "cancelled"];

// 📌 Book a session (Student)
export const bookSession = async (req, res) => {
    try {
      const { tutorId, date, time, sessionType } = req.body;
      const studentId = req.user._id; // From auth middleware
  
      const session = new Session({
        studentId,
        tutorId,
        date,
        time,
        sessionType,
        status: "Pending",
      });
  
      await session.save();
      res.status(201).json({ message: "Session booked successfully", session });
    } catch (error) {
      res.status(500).json({ message: "Failed to book session", error: error.message });
    }
  };

  export const getStudentSessions = async (req, res) => {
    try {
      const studentId = req.params.studentId;
  
      const sessions = await Session.find({ studentId })
        .populate("tutorId", "name email")
        .sort({ date: 1 });
  
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student sessions", error: error.message });
    }
  };

// Get all sessions for a tutor
// 📌 Get sessions for a tutor
export const getTutorSessions = async (req, res) => {
    try {
      const tutorId = req.params.tutorId;
  
      const sessions = await Session.find({ tutorId })
        .populate("studentId", "name email")
        .sort({ date: 1 });
  
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutor sessions", error: error.message });
    }
  };

// 📌 Update session status (Accept, Complete, Cancel)
export const updateSessionStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const { sessionId } = req.params;
  
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ message: "Invalid session status" });
      }
  
      const session = await Session.findById(sessionId);
      if (!session) return res.status(404).json({ message: "Session not found" });
  
      session.status = status;
      await session.save();
  
      res.json({ message: `Session marked as ${status}`, session });
    } catch (error) {
      res.status(500).json({ message: "Failed to update session status", error: error.message });
    }
  };
// 📌 Cancel (Delete) a Session
export const deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        console.log("Deleting session with ID:", sessionId); // Debugging Log

        // Validate session ID format
        if (!sessionId || !sessionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid session ID format" });
        }

        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        await session.deleteOne();
        res.json({ message: "Session deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete session", error: error.message });
    }
};

// 📌 Reschedule a Session (Student)
export const rescheduleSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { newDate, time } = req.body; // 🛑 Changed `newTime` to `time` to match frontend

        console.log("Rescheduling session:", sessionId, "New Date:", newDate, "New Time:", time); // Debugging Log

        // Validate session ID format
        if (!sessionId || !sessionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid session ID format" });
        }

        // ✅ Use `findByIdAndUpdate` to update in a single step
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            { date: newDate, time: time, status: "Rescheduled" },
            { new: true } // Return the updated document
        );

        if (!updatedSession) return res.status(404).json({ message: "Session not found" });

        res.json({ message: "Session rescheduled successfully", session: updatedSession });

    } catch (error) {
        res.status(500).json({ message: "Failed to reschedule session", error: error.message });
    }
};

export const completeSession = async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await Session.findById(sessionId);
  
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      if (session.status === "completed") {
        return res.status(400).json({ message: "Session is already completed" });
      }
  
      session.status = "completed";
      await session.save();
  
      res.json({ message: "Session marked as completed", session });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

