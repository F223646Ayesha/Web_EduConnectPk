import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Assuming tutors are stored in the User model
});

export default mongoose.model("Wishlist", wishlistSchema);
