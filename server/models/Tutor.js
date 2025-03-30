import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tutorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    subjects: [{ type: String }],
    hourlyRate: { type: Number },
    availability: [{ day: String, times: [String] }],
    verified: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 }, // New field for average rating
  }, { timestamps: true });
  

// Hash password before saving
tutorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare hashed passwords
tutorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Tutor", tutorSchema);
