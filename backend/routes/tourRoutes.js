const express = require("express");

const { createTourBooking } = require("../controllers/tourController");

const router = express.Router();    

router.post("/", createTourBooking);

module.exports = router