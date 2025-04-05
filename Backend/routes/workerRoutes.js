import express from "express";
import {
    assignedWorker,
    getWorkerReports,
    registerWorker,
} from "../controllers/worker.controller.js";

const router = express.Router();

router.post("/registration", registerWorker);       // POST /api/worker/registration
router.post("/assign", assignedWorker);             // POST /api/worker/assign
router.get("/:id/reports", getWorkerReports);       // GET /api/worker/:id/reports

export default router;
