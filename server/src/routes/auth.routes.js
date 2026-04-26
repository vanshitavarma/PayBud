const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { register, login, getMe } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

module.exports = router;
