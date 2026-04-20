const User = require("../models/userModel");

// GET /api/users/all — admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/:id/role — admin only
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "manager", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value." });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found." });
    res
      .status(200)
      .json({ message: `Role updated to "${role}" successfully.`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole };
