const Booking = require("../models/Booking");

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

    if (!tickets || tickets.length === 0) {
      return res.status(400).json({ error: "No tickets selected" });
    }

    const totalAmount = tickets.reduce(
      (sum, t) => sum + t.price * t.qty,
      0
    );

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

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
