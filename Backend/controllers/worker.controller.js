import Worker from "../models/worker.models.js";
import Trash from "../models/trash.models.js";

// Register a worker
export const registerWorker = async (req, res) => {
    const { name, email } = req.body;
    try {
        const newWorker = new Worker({ name, email });
        await newWorker.save();
        res.status(201).json({
            message: "Worker registration successful",
            worker: newWorker,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in worker registration",
            error: error.message,
        });
    }
};

// Assign worker to trash
export const assignedWorker = async (req, res) => {
    const { workerId, trashId } = req.body;

    try {
        const worker = await Worker.findById(workerId);
        const trash = await Trash.findById(trashId);

        if (!worker || !trash) {
            return res.status(404).json({
                message: "Worker or trash not found",
            });
        }

        trash.assignedWorker = worker._id;
        await trash.save();

        worker.tasks.push(trash._id);
        await worker.save();

        res.status(200).json({
            message: "Worker successfully assigned to trash",
            trash,
            worker,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in worker assignment",
            error: error.message,
        });
    }
};

// Get all reports assigned to a worker
export const getWorkerReports = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).populate("tasks");
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        res.status(200).json({
            message: "Worker reports fetched successfully",
            reports: worker.tasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching reports",
            error: error.message,
        });
    }
};
