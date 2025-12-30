const TourBooking = require("../models/TourBooking");

exports.createTourBooking = async (req, res) => {
  try {
    const {
        tourDate,
        tourTime,
        participants,
        fullName,
        email,
        phone,
        specialRequests,
    } = req.body;

    // ✅ Validation
    if (
      !tourDate ||
      !tourTime ||
        !participants ||
        !fullName ||
        !email ||
        !phone
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const tourBooking = await TourBooking.create({
        tourDate,
        tourTime,
        participants,
        fullName,
        email,
        phone,
        specialRequests,
    });

    res.status(201).json({
      success: true,
      message: "Tour booked successfully",
      tourBooking,
    });
  } catch (error) {
    console.error("Tour Booking error:", error);
    res.status(500).json({ error: error.message });
  }
};