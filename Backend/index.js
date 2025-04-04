import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import trashRoutes from "./routes/trashRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trash", trashRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/contributions", contributionRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

