import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // Example: "Sessions", "Users", "Revenue"
    date: { type: Date, default: Date.now },
    data: { type: Object, required: true }, // Stores detailed report data
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
