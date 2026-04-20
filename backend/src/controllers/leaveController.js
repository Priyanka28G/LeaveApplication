const Leave = require("../models/leaveModel");

// POST /api/leaves/apply
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const username = req.user.username;
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "End date must be on or after start date." });
    }
    const leave = new Leave({
      username,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();
    res.status(201).json({ message: "Leave applied successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/leaves/my  — logged-in employee's own leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ username: req.user.username }).sort({
      createdAt: -1,
    });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leaves/all  — admin/manager only
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/leaves/:id/status  — admin/manager only
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!leave) return res.status(404).json({ message: "Leave not found." });
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE /api/leaves/:id
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found." });
    res.status(200).json({ message: "Leave deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
};
