import express from "express";
import { assignedWorker, getWorkerReports, registerWorker } from "../controllers/worker.controller.js";

const router = express.Router();

router.post("/registration", registerWorker);
router.post("/assign", assignedWorker);
router.get("/:id/reports", getWorkerReports);

export default router;