const express = require("express");
const { 
  createEvent,
  getAllEvents,
  getEventByReference,
  updateEventStatus,
  getEventStats
} = require("../controllers/eventController");

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post("/", createEvent);                            
router.get("/reference/:reference", getEventByReference); 

// ==================== ADMIN ROUTES ====================
router.get("/stats", getEventStats);    // Must be before /:id
router.get("/", getAllEvents);           
router.patch("/:id/status", updateEventStatus);

module.exports = router;
