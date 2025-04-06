import express from "express";
import {
    assignedWorker,
    getWorkerReports,
    registerWorker,
    loginWorker,
    getAllWorkers,
    getWorkerPoints
} from "../controllers/worker.controller.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/registration", registerWorker);       // POST /api/worker/registration
router.post("/login", loginWorker);

// Protected routes
router.get("/all", protect, authorize("admin"), getAllWorkers);
router.get("/:id/points", protect, getWorkerPoints);
router.post("/assign", protect, authorize("admin"), assignedWorker);
router.get("/:id/reports", protect, getWorkerReports);

export default router;
