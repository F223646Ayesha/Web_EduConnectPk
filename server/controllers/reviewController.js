import Review from "../models/Review.js";
import User from "../models/User.js";
import Session from "../models/session.js";

export const addReview = async (req, res) => {
    try {
        console.log("Received review request:", req.body); // ✅ Log incoming data
        const { tutorId, sessionId, rating, reviewText } = req.body;
        const studentId = req.user ? req.user._id : null;

        if (!studentId) {
            return res.status(401).json({ message: "Unauthorized - Missing Token" });
        }

        if (!tutorId || !sessionId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid review data." });
        }

        // ✅ Log session status
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }
        console.log("Session Status:", session.status); // ✅ Log session status

        if (session.status !== "completed") {
            return res.status(400).json({ message: "You can only review completed sessions." });
        }

        const existingReview = await Review.findOne({ sessionId, studentId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this session." });
        }

        const review = new Review({
            studentId,
            tutorId,
            sessionId,
            rating,
            reviewText,
        });

        await review.save();
        session.reviewed = true;
        await session.save();

        console.log("Review saved successfully:", review); // ✅ Log success

        res.status(201).json({ message: "Review submitted successfully!", review });
    } catch (error) {
        console.error("Error submitting review:", error.message); // ✅ Log full error
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// ✅ Get all reviews for a tutor
export const getTutorReviews = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const reviews = await Review.find({ tutorId }).populate("studentId", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
