const express = require("express");
const { 
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} = require("../controllers/contactController");

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post("/", createContact);                    // Submit contact form

// ==================== ADMIN ROUTES (Add auth middleware later) ====================
router.get("/", getAllContacts);                    // Get all contacts
router.get("/stats", getContactStats);              // Get contact statistics
router.get("/:id", getContactById);                 // Get single contact
router.patch("/:id/status", updateContactStatus);   // Update contact status
router.delete("/:id", deleteContact);               // Delete contact

module.exports = router;
