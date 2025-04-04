import express from "express";
import { registerUser, loginUser, logoutUser, adminLogin } from "../controllers/user.controller.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/admin/login", adminLogin);

router.post("/logout", logoutUser);

router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

// Admin routes
router.get("/admin/dashboard", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Admin dashboard access granted" });
});

export default router;
