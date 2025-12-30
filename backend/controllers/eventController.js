const EventBooking = require("../models/EventBooking");

exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      participants,
      fullName,
      email,
      phone,
      specialRequirements,
      termsAccepted,
    } = req.body;

    // ✅ Validation
    if (
      !eventName ||
      !eventDate ||
      !participants ||
      !fullName ||
      !email ||
      !phone ||
      termsAccepted !== true
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const event = await EventBooking.create({
      eventName,
      eventDate,
      participants,
      fullName,
      email,
      phone,
      specialRequirements,
      termsAccepted,
    });

    res.status(201).json({
      success: true,
      message: "Event booked successfully",
      event,
    });
  } catch (error) {
    console.error("Event error:", error);
    res.status(500).json({ error: error.message });
  }
};
