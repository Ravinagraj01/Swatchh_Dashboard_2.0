import Trash from "../models/trash.models.js";
import User from "../models/user.models.js";

export const getUserContributionSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    const reportedCount = await Trash.countDocuments({ user: userId });
    const cleanedCount = await Trash.countDocuments({ volunteer: userId, status: "completed" });

    res.json({
      reported: reportedCount,
      cleaned: cleanedCount,
      points: user.points,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contribution summary", error });
  }
};
