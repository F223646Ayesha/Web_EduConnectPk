const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Sessions", "Users", "Revenue"
  date: { type: Date, default: Date.now },
  data: Object, // Dynamic data based on report type
});

module.exports = mongoose.model("Report", reportSchema);
