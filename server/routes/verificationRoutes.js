const express = require("express");
const router = express.Router();
const Verification = require("../models/verificationModel");
const Tutor = require("../models/tutorModel");

// Submit verification request
router.post("/", async (req, res) => {
  try {
    const { tutorId, documents } = req.body;
    const verification = new Verification({ tutorId, documents });
    await verification.save();
    res.status(201).json({ message: "Verification request submitted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit verification request" });
  }
});

// Get all pending verification requests (Admin only)
router.get("/pending", async (req, res) => {
  try {
    const requests = await Verification.find({ status: "Pending" }).populate("tutorId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch verification requests" });
  }
});

// Approve or Reject a tutor
router.put("/:id", async (req, res) => {
  try {
    const { status, comments } = req.body;
    const verification = await Verification.findById(req.params.id);
    
    if (!verification) {
      return res.status(404).json({ error: "Verification request not found" });
    }

    verification.status = status;
    verification.comments = comments;
    await verification.save();

    // Update tutor's verification status
    await Tutor.findByIdAndUpdate(verification.tutorId, { verificationStatus: status });

    res.json({ message: `Tutor verification ${status.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update verification status" });
  }
});

module.exports = router;
