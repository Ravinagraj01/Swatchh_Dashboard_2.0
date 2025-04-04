import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {markerAsCleaned,getUserTrashReports,reportTrash, getAllTrashReports, confirmTrashCleaned ,assignTrashToWorker} from "../controllers/trash.controller.js";

const router = express.Router();

router.post("/report" , protect, reportTrash);

router.get("/" , protect, authorize("admin"), getAllTrashReports);

router.patch("/:trashId/confirm" , protect, authorize("admin"), confirmTrashCleaned);

router.patch("/:trashId/assign" , protect, authorize("admin"), assignTrashToWorker);

router.get("/user/:userId" , protect, getUserTrashReports);

router.put("/cleaned/:trashId" , markerAsCleaned);

export default router;
