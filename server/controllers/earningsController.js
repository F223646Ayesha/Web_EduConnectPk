import Earnings from "../models/Earnings.js"; // Use `import` instead of `require`

// ✅ Get tutor earnings
export const getTutorEarnings = async (req, res) => {
    console.log("Tutor ID received:", req.params.id); // Debugging
  
    if (!req.params.id) {
      return res.status(400).json({ message: "Tutor ID is required" });
    }
  
    try {
      const earnings = await Earnings.findOne({ tutorId: req.params.id });
      res.json({ totalEarnings: earnings ? earnings.totalEarnings : 0 });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ message: "Server error" });
    }
  };  

// ✅ Update earnings when a session is completed
export const updateTutorEarnings = async (req, res) => {
    try {
        const { tutorId, amount, description } = req.body;

        let earnings = await Earnings.findOne({ tutorId });

        if (!earnings) {
            earnings = new Earnings({ tutorId, totalEarnings: 0, transactions: [] });
        }

        earnings.totalEarnings += amount;
        earnings.transactions.push({ amount, description });

        await earnings.save();
        res.status(200).json({ message: "Earnings updated successfully", earnings });
    } catch (error) {
        console.error("Error updating earnings:", error);
        res.status(500).json({ message: "Server error" });
    }
};
