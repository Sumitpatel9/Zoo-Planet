const Booking = require("../models/Booking");

// Generate booking reference
function generateBookingRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "ZOO-" + new Date().getFullYear() + "-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

exports.createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      visitDate,
      paymentMethod,
      tickets,
      notes,
    } = req.body;

    // ✅ Validation
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "No tickets selected" });
    }
    if (!fullName || !email || !mobile || !visitDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate total
    const totalAmount = tickets.reduce(
      (sum, t) => sum + t.price * t.qty,
      0
    );

    // Save booking
    const booking = await Booking.create({
      bookingRef: generateBookingRef(),
      fullName,
      email,
      mobile,
      visitDate,
      paymentMethod,
      tickets,
      totalAmount,
      notes,
    });

    res.status(201).json({
      success: true,
      bookingRef: booking.bookingRef,
      createdAt: booking.createdAt,
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: error.message });
  }
};
