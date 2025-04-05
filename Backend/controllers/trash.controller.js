import Trash from "../models/trash.models.js";
import User from "../models/user.models.js"

export const reportTrash = async (req, res) => {
    const { image, location } = req.body;
  
    try {
      const newTrash = new Trash({
        user: req.user._id,
        image,
        location
      });
      
      // After saving the trash report:
        const user = await User.findById(req.user._id);
        await newTrash.save();
        user.points += 5;
        await user.save();

      
      res.status(201).json(newTrash);
    } catch (error) {
      res.status(500).json({ message: "Failed to report trash", error });
    }
  };
  
  export const getAllTrashReports = async (req, res) => {
    try {
      const reports = await Trash.find().populate('workerAssigned');
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trash reports", error });
    }
  };

  export const confirmTrashCleaned = async (req, res) => {
    const { trashId } = req.params;
    const { isCleaned } = req.body;

    try {
      const trash = await Trash.findById(trashId);
      if (!trash) { 
        return res.status(404).json({ message: "Trash not found" });
      }

      if (isCleaned) {
        trash.cleanedAt = new Date();
        trash.status = "completed";
      } else {
        trash.status = "pending";
      }

      await trash.save();
      res.json({ message: "Trash status updated", trash });
    } catch (error) {
      res.status(500).json({ message: "Failed to update trash status", error });
    }
  };    

  export const assignTrashToWorker = async (req, res) => {
    const { trashId } = req.params;
    const { workerId } = req.body;

    try {
      const trash = await Trash.findById(trashId);
      if (!trash) {
        return res.status(404).json({ message: "Trash not found" });
      }

      trash.workerAssigned = workerId;  
      trash.status = "assigned";

      await trash.save();
      res.json({ message: "Trash assigned to worker", trash });     

      
    } catch (error) {
    res.status(500).json({ message: "Failed to assign trash to worker", error });
  }
};

export const getUserTrashReports = async (req, res) => {
  try {
    const reports = await Trash.find({ user: req.user._id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user trash reports", error });
  }
};  

export const markerAsCleaned = async (req, res) => {
  const { trashId } = req.params;
//   const { isCleaned } = req.body;

  try {
    const trash = await Trash.findById(trashId);
    if (!trash) {
      return res.status(404).json({ message: "Trash not found" });
    }

    trash.status = "completed";
    trash.cleanedAt = new Date();

    const user = await User.findById(trash.user);
    user.points += 10;
    await user.save();
   
    await trash.save();
    res.json({ message: "Trash marked as cleaned", trash });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark trash as cleaned", error });
  }
};
