import Tutor from "../models/Tutor.js";

// 📌 Get all pending tutors for verification
export const getPendingTutors = async (req, res) => {
  try {
    const pendingTutors = await Tutor.find({ verified: false }).select("-password");
    res.status(200).json(pendingTutors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending tutors", error: error.message });
  }
};

// 📌 Verify or Reject a tutor
export const verifyTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    const tutor = await Tutor.findById(id);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    tutor.verified = status === "Verified";

    // Optional: Store admin's comment in a log (not stored in Tutor model)
    console.log(`Admin verified tutor ${tutor.email}: ${status} - ${comment}`);

    await tutor.save();
    res.status(200).json({ message: `Tutor ${status.toLowerCase()}`, tutor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update verification status", error: error.message });
  }
};

// 📌 Get tutor verification statistics
export const getTutorStats = async (req, res) => {
  try {
    const pending = await Tutor.countDocuments({ verified: false });
    const verified = await Tutor.countDocuments({ verified: true });
    const rejected = await Tutor.countDocuments({ verified: false }); // Placeholder if rejection is stored differently

    res.status(200).json({ pending, verified, rejected });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tutor statistics", error: error.message });
  }
};

// 📌 Get most popular subjects
export const getPopularSubjects = async (req, res) => {
    try {
      const popularSubjects = await Session.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: "$subject", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
  
      res.status(200).json(popularSubjects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching popular subjects", error: error.message });
    }
  };
  
  // 📌 Get session completion rates
  export const getSessionCompletionRates = async (req, res) => {
    try {
      const totalSessions = await Session.countDocuments();
      const completedSessions = await Session.countDocuments({ status: "Completed" });
  
      const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  
      res.status(200).json({ totalSessions, completedSessions, completionRate: completionRate.toFixed(2) });
    } catch (error) {
      res.status(500).json({ message: "Error fetching session completion rates", error: error.message });
    }
  };
  
  // 📌 Get platform usage by city
  export const getPlatformUsageByCity = async (req, res) => {
    try {
      const usageByCity = await User.aggregate([
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
  
      res.status(200).json(usageByCity);
    } catch (error) {
      res.status(500).json({ message: "Error fetching platform usage by city", error: error.message });
    }
  };
  
  // 📌 Get user growth over time
  export const getUserGrowth = async (req, res) => {
    try {
      const growthData = await User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.status(200).json(growthData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user growth data", error: error.message });
    }
  };