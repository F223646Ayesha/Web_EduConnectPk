import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Get a student's wishlist
router.get("/", protect, getWishlist);

// ❤️ Add a tutor to wishlist
router.post("/", protect, addToWishlist);

// ❌ Remove a tutor from wishlist
router.delete("/:tutorId", protect, removeFromWishlist);

export default router;
