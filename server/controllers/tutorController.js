import User from "../models/User.js"; // User model for authentication
import Tutor from "../models/Tutor.js"; // Tutor model for profile data
import Session from "../models/session.js"; // Model for tutoring sessions
import generateToken from "../utils/generateToken.js";

// @desc Register Tutor
// @route POST /api/tutors/register
// @access Public
export const registerTutor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const tutorExists = await User.findOne({ email, role: "tutor" });
        if (tutorExists) {
            return res.status(400).json({ message: "Tutor already exists" });
        }

        const tutor = await User.create({ name, email, password, role: "tutor" });

        if (tutor) {
            res.status(201).json({
                _id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                role: tutor.role,
                token: generateToken(tutor._id),
            });
        } else {
            res.status(400).json({ message: "Invalid tutor data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Login Tutor
// @route POST /api/tutors/login
// @access Public
export const loginTutor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tutor = await User.findOne({ email, role: "tutor" });

        if (tutor && (await tutor.matchPassword(password))) {
            res.json({
                _id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                role: tutor.role,
                token: generateToken(tutor._id),
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get Tutor Profile
// @route GET /api/tutors/profile
// @access Private (Tutor)
export const getTutorProfile = async (req, res) => {
    console.log("🚀 Tutor Profile API Hit"); // 🛠 Debugging log

    try {
        const tutor = await Tutor.findById(req.user._id);
        if (!tutor) {
            return res.status(404).json({ message: "Tutor not found" });
        }
        res.json(tutor);
    } catch (error) {
        console.error("❌ Error fetching tutor profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc Update Tutor Profile
// @route PUT /api/tutors/profile
// @access Private (Tutor)
export const updateTutorProfile = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "tutor") {
            return res.status(401).json({ message: "Unauthorized, tutor not found" });
        }

        const tutor = await Tutor.findById(req.user._id);
        if (!tutor) {
            return res.status(404).json({ message: "Tutor not found" });
        }

        tutor.name = req.body.name || tutor.name;
        tutor.bio = req.body.bio || tutor.bio;
        tutor.subjects = req.body.subjects || tutor.subjects;
        tutor.hourlyRate = req.body.hourlyRate || tutor.hourlyRate;
        tutor.availability = req.body.availability || tutor.availability;

        const updatedTutor = await tutor.save();
        res.json(updatedTutor);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Submit Verification Request
// @route POST /api/tutors/verify
// @access Private (Tutor)
export const submitVerification = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "tutor") {
            return res.status(401).json({ message: "Unauthorized, tutor not found" });
        }

        const tutor = await Tutor.findById(req.user._id);
        if (!tutor) {
            return res.status(404).json({ message: "Tutor not found" });
        }

        tutor.verified = false; // Set verification as pending
        await tutor.save();
        res.json({ message: "Verification request submitted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get all tutors (with search & filtering)
// @route GET /api/tutors
// @access Public
export const getAllTutors = async (req, res) => {
    try {
        const { search, subject, minRate, maxRate } = req.query;
        let filter = {};

        // Search by name
        if (search) {
            filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Filter by subject
        if (subject) {
            filter.subjects = subject; // Assuming 'subjects' is an array
        }

        // Filter by hourly rate
        if (minRate || maxRate) {
            filter.hourlyRate = {};
            if (minRate) filter.hourlyRate.$gte = Number(minRate);
            if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
        }

        const tutors = await Tutor.find(filter).select("-password");
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get tutor by ID
// @route GET /api/tutors/:id
// @access Public
export const getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id).select("-password");
        if (!tutor) {
            return res.status(404).json({ message: "Tutor not found" });
        }
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get tutor sessions
// @route GET /api/tutors/sessions
// @access Private (Tutor)
export const getTutorSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ tutor: req.user._id, status: "pending" });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update session status (accept/reject)
// @route PUT /api/tutors/sessions/:sessionId
// @access Private (Tutor)
export const updateSessionStatus = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (session.tutor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        session.status = req.body.status; // "accepted" or "rejected"
        await session.save();

        res.json({ message: `Session ${session.status} successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get tutor earnings
// @route GET /api/tutors/earnings
// @access Private (Tutor)
export const getTutorEarnings = async (req, res) => {
    try {
        const earnings = await Session.aggregate([
            { $match: { tutor: req.user._id, status: "completed" } },
            { $group: { _id: null, totalEarnings: { $sum: "$fee" } } },
        ]);

        res.json({ totalEarnings: earnings[0]?.totalEarnings || 0 });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
