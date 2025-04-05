import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {volunteerMarkCleaned , volunteerForTrash ,getAvailableTrash,getUserTrashReports,reportTrash, getAllTrashReports, confirmTrashCleaned ,assignTrashToWorker} from "../controllers/trash.controller.js";
import upload from "../middlewares/upload.js"

const router = express.Router();

router.post("/report" , protect, upload.single("image"), reportTrash);

router.get("/" , protect, authorize("admin"), getAllTrashReports);

router.put("/:trashId/confirm" , protect, authorize("admin"), confirmTrashCleaned);

router.patch("/:trashId/assign" , protect, authorize("admin"), assignTrashToWorker);

router.get("/user/:userId" , protect, getUserTrashReports);

router.get("/available", protect, getAvailableTrash);
router.post("/volunteer/:trashId", protect, volunteerForTrash);
router.post("/volunteer/cleaned/:trashId", protect, volunteerMarkCleaned);




export default router;
