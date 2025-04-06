import Worker from "../models/worker.models.js";
import Trash from "../models/trash.models.js";
import generateToken from "../generateToken.js";

// Register a worker
export const registerWorker = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if worker already exists
        const workerExists = await Worker.findOne({ email });
        if (workerExists) {
            return res.status(400).json({
                message: "Worker already exists",
            });
        }

        const newWorker = new Worker({ name, email, password });
        await newWorker.save();
        
        res.status(201).json({
            message: "Worker registration successful",
            worker: {
                _id: newWorker._id,
                name: newWorker.name,
                email: newWorker.email,
                token: generateToken(newWorker._id)
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in worker registration",
            error: error.message,
        });
    }
};

// Login worker
export const loginWorker = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const worker = await Worker.findOne({ email });
        
        if (worker && (await worker.matchPassword(password))) {
            res.json({
                token: generateToken(worker._id),
                user: {
                    _id: worker._id,
                    name: worker.name,
                    email: worker.email,
                    role: "worker"
                }
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error in worker login",
            error: error.message,
        });
    }
};

// Get all workers
export const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().select("-password");
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching workers",
            error: error.message,
        });
    }
};

// Get worker points
export const getWorkerPoints = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).select("points");
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        
        res.status(200).json({ points: worker.points || 0 });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching worker points",
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

        trash.workerAssigned = worker._id;
        trash.status = "assigned";
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
