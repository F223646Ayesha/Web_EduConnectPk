import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            amount: Number,
            date: {
                type: Date,
                default: Date.now
            },
            description: String
        }
    ]
});

const Earnings = mongoose.model("Earnings", earningsSchema);

export default Earnings; // ✅ Use `export default`
