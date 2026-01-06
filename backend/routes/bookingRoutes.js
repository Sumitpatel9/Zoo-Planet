const express = require("express");
const { 
  createBooking, 
  getBookingBySearch,
  getAllBookings,
  getBookingStats
} = require("../controllers/bookingController");

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post("/", createBooking);              // Create new booking
router.get("/search", getBookingBySearch);    // Search booking

// ==================== ADMIN ROUTES (Add auth middleware later) ====================
router.get("/", getAllBookings);              // Get all bookings
router.get("/stats", getBookingStats);        // Get booking statistics

module.exports = router;
