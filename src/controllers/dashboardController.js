import User from "../models/userauthModel.js";

export const dashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};