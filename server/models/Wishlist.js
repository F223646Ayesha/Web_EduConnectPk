import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tutor" }], // List of saved tutors
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
