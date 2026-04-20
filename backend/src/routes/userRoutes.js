const express = require("express");

const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

//Only admin can acess this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin priyanka" });
});

//Only Manager can acess this router
router.get(
  "/manager",
  verifyToken,
  authorizeRoles("manager", "admin"),
  (req, res) => {
    res.json({ message: "Welcome Manger" });
  },
);

//Only employee can acess this router
router.get(
  "/employee",
  verifyToken,
  authorizeRoles("employee", "admin", "manager"),
  (req, res) => {
    res.json({ message: "Welcome Employee" });
  },
);

// User management — admin only
router.get("/all", verifyToken, authorizeRoles("admin"), getAllUsers);

router.patch("/:id/role", verifyToken, authorizeRoles("admin"), updateUserRole);

module.exports = router;
