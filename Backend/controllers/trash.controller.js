import Trash from "../models/trash.models.js";
import User from "../models/user.models.js";

// POST /api/trash/report
export const reportTrash = async (req, res) => {
    const { location } = req.body;
    try {
      const newTrash = new Trash({
        user: req.user._id,
        image: req.file.path, // Cloudinary URL
        location
      });
  
      await newTrash.save();
  
      const user = await User.findById(req.user._id);
      user.points += 5;
      await user.save();
  
      res.status(201).json({
        message: "Trash reported successfully",
        trash: newTrash
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to report trash", error });
    }
  };
  

// GET /api/trash/all
export const getAllTrashReports = async (req, res) => {
  try {
    const reports = await Trash.find()
      .populate("workerAssigned", "name email") // show basic worker info
      .populate("user", "name email"); // optional: show reporter info

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trash reports", error });
  }
};

// PUT /api/trash/:trashId/status
export const confirmTrashCleaned = async (req, res) => {
  const { trashId } = req.params;
  const { isCleaned } = req.body;

  try {
    const trash = await Trash.findById(trashId);
    if (!trash) return res.status(404).json({ message: "Trash not found" });

    if (isCleaned) {
      trash.cleanedAt = new Date();
      trash.status = "completed";

      const user = await User.findById(trash.user);
      user.points += 10;
      await user.save();
    } else {
      trash.status = "pending";
    }

    await trash.save();
    res.json({ message: "Trash status updated", trash });
  } catch (error) {
    res.status(500).json({ message: "Failed to update trash status", error });
  }
};

// PUT /api/trash/:trashId/assign
export const assignTrashToWorker = async (req, res) => {
  const { trashId } = req.params;
  const { workerId } = req.body;

  try {
    const trash = await Trash.findById(trashId);
    if (!trash) return res.status(404).json({ message: "Trash not found" });

    trash.workerAssigned = workerId;
    trash.status = "assigned";

    await trash.save();
    res.json({ message: "Trash assigned to worker", trash });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign trash to worker", error });
  }
};

// GET /api/trash/my-reports
export const getUserTrashReports = async (req, res) => {
  try {
    const reports = await Trash.find({ user: req.user._id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user trash reports", error });
  }
};


export const getAvailableTrash = async (req, res) => {
    try {
      const trash = await Trash.find({ status: "pending", volunteer: null });
      res.json(trash);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available trash", error });
    }
  };
  
  export const volunteerForTrash = async (req, res) => {
    const { trashId } = req.params;
  
    try {
      const trash = await Trash.findById(trashId);
      if (!trash) {
        return res.status(404).json({ message: "Trash not found" });
      }
  
      if (trash.status !== "pending") {
        return res.status(400).json({ message: "Trash already assigned" });
      }
  
      trash.volunteer = req.user._id;
      trash.status = "assigned";
      await trash.save();
  
      res.json({ message: "You are now assigned to clean this trash!", trash });
    } catch (error) {
      res.status(500).json({ message: "Error assigning volunteer", error });
    }
  };
  

  export const volunteerMarkCleaned = async (req, res) => {
    const { trashId } = req.params;
  
    try {
      const trash = await Trash.findById(trashId);
      if (!trash || !trash.volunteer.equals(req.user._id)) {
        return res.status(403).json({ message: "Not allowed" });
      }
  
      trash.status = "completed";
      trash.cleanedAt = new Date();
      await trash.save();
  
      const user = await User.findById(req.user._id);
      user.points += 15; // Bonus points for volunteering
      await user.save();
  
      res.json({ message: "Trash marked as cleaned by volunteer", trash });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark trash as cleaned", error });
    }
  };
  