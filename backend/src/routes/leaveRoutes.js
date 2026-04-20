const express = require("express");
const router = express.Router();
const Leave = require("../models/leaveModel");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { applyLeave } = require("../controllers/leaveController");

// POST /api/leaves
// Employee applies for leave
router.post(
  "/apply",
  verifyToken,
  authorizeRoles("employee", "manager", "admin"),
  applyLeave,
);

// GET /api/leaves/my
// Logged-in user fetches their own leaves
router.get("/my", verifyToken, async (req, res) => {
  try {
    const leaves = await Leave.find({ username: req.user.username }).sort({
      createdAt: -1,
    });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/leaves
// Manager and admin fetch all leave requests
router.get(
  "/",
  verifyToken,
  authorizeRoles("manager", "admin"),
  async (req, res) => {
    try {
      const leaves = await Leave.find().sort({ createdAt: -1 });
      res.status(200).json(leaves);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// PATCH /api/leaves/:id/status
// Manager and admin approve or reject a leave
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("manager", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be approved or rejected" });
      }

      const leave = await Leave.findById(req.params.id);
      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }

      if (leave.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending leaves can be updated" });
      }

      leave.status = status;
      await leave.save();
      res.status(200).json(leave);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// DELETE /api/leaves/:id
// Employee deletes their own pending leave
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("employee", "manager", "admin"),
  async (req, res) => {
    try {
      const leave = await Leave.findById(req.params.id);
      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }

      if (leave.username !== req.user.username) {
        return res
          .status(403)
          .json({ message: "You can only cancel your own leave requests" });
      }

      if (leave.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending leaves can be cancelled" });
      }

      await leave.deleteOne();
      res.status(200).json({ message: "Leave request cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
