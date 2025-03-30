const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  documents: [String], // Array of document URLs
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  comments: String, // Admin's rejection reason
}, { timestamps: true });

module.exports = mongoose.model("Verification", verificationSchema);
