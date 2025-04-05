import Trash from "../models/trash.models.js";
import User from "../models/user.models.js";
import Worker from "../models/worker.models.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const [weekly, monthly, yearly, total, completed, pending, assigned] = await Promise.all([
      Trash.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Trash.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
      Trash.countDocuments({ createdAt: { $gte: oneYearAgo } }),
      Trash.countDocuments(),
      Trash.countDocuments({ status: "completed" }),
      Trash.countDocuments({ status: "pending" }),
      Trash.countDocuments({ status: "assigned" }),
    ]);

    const topUsers = await User.find().sort({ points: -1 }).limit(5).select("name points");
    const topWorkers = await Worker.find().sort({ tasks: -1 }).limit(5).select("name tasks");

    res.status(200).json({
      reports: { total, weekly, monthly, yearly },
      statusCount: { completed, pending, assigned },
      topUsers,
      topWorkers
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
};
