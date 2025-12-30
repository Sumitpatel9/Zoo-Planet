const express = require("express");

const { createMembership } = require("../controllers/membershipController");

const router = express.Router();

router.post("/", createMembership);

module.exports = router;