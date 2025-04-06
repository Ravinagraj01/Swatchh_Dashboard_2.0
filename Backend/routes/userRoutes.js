import express from "express";
import { getUserPoints, registerUser, loginUser, logoutUser, adminLogin, getAllUsers } from "../controllers/user.controller.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);
router.post("/logout", logoutUser);

// Protected routes
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

router.get("/points", protect, getUserPoints);

// Admin routes
router.get("/all", protect, authorize("admin"), getAllUsers);

router.get("/admin/dashboard", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Admin dashboard access granted" });
});

export default router;
