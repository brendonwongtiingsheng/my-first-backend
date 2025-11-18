const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users.controller");

// GET /users
router.get("/", getAllUsers);

// GET /users/:id
router.get("/:id", getUserById);

// POST /users
router.post("/", createUser);

// PATCH /users/:id
router.patch("/:id", updateUser);

// DELETE /users/:id
router.delete("/:id", deleteUser);

module.exports = router;
