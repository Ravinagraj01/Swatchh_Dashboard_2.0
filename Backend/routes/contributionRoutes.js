import express from "express";
import { getUserContributionSummary } from "../controllers/contribution.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getUserContributionSummary);

export default router;
