import Wishlist from "../models/wishlistModel.js";

// ✅ Get wishlist for the logged-in student
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ studentId: req.user._id }).populate("tutors");
    res.json(wishlist ? wishlist.tutors : []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ❤️ Add a tutor to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { tutorId } = req.body;
    let wishlist = await Wishlist.findOne({ studentId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ studentId: req.user._id, tutors: [] });
    }

    if (!wishlist.tutors.includes(tutorId)) {
      wishlist.tutors.push(tutorId);
      await wishlist.save();
    }

    res.json({ message: "Tutor added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ❌ Remove a tutor from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const wishlist = await Wishlist.findOne({ studentId: req.user._id });

    if (wishlist) {
      wishlist.tutors = wishlist.tutors.filter((id) => id.toString() !== tutorId);
      await wishlist.save();
      res.json({ message: "Tutor removed from wishlist" });
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
