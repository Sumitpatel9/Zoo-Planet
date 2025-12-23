const express = require("express");
const { createBooking, getBookingBySearch } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/search", getBookingBySearch);

module.exports = router;
