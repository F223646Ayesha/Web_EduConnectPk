import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true }, // ✅ Add subject field for "Popular Subjects" report
    city: { type: String }, // ✅ Add city field for "Platform Usage by City" report
    date: { type: Date, required: true }, // ✅ Ensure date is required for "User Growth Over Time"
    time: String,
    sessionType: { type: String, enum: ["online", "in-person"] },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    reviewed: { type: Boolean, default: false }, // Prevent duplicate reviews
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
