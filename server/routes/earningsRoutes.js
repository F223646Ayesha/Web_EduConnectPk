import express from "express";
import { getTutorEarnings, updateTutorEarnings } from "../controllers/earningsController.js";

const router = express.Router();

router.get("/tutor/:id", getTutorEarnings);
router.post("/update", updateTutorEarnings);

export default router;
