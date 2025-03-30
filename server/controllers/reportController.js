import Report from "../models/Report.js";

// Get all reports (Filtered by type & date)
export const getReports = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    let query = {};

    if (type) query.type = type;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const reports = await Report.find(query);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// Generate a new report (Manual testing)
export const generateReport = async (req, res) => {
  try {
    const { type, data } = req.body;
    const report = new Report({ type, data });
    await report.save();
    res.status(201).json({ message: "Report generated!", report });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
};
