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

// exports.getBookingBySearch = async (req, res) => {
//   try {
//     const { bookingRef, mobile } = req.query;

//     let booking;

//     if (bookingRef) {
//       booking = await Booking.findOne({ bookingRef });
//     } else if (mobile) {
//       booking = await Booking.findOne({ mobile }).sort({ createdAt: -1 });
//     } else {
//       return res.status(400).json({ error: "Invalid search" });
//     }

//     if (!booking) {
//       return res.status(404).json({ error: "Ticket not found" });
//     }

//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.getBookingBySearch = async (req, res) => {
  try {
    const { bookingRef, mobile } = req.query;

    // Search by booking reference (single ticket)
    if (bookingRef) {
      const booking = await Booking.findOne({ bookingRef });

      if (!booking) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      return res.json({ type: "single", booking });
    }

    // Search by mobile (MULTIPLE tickets)
    if (mobile) {
      const bookings = await Booking.find({ mobile }).sort({ createdAt: -1 });

      if (!bookings.length) {
        return res.status(404).json({ error: "No tickets found" });
      }

      return res.json({ type: "multiple", bookings });
    }

    res.status(400).json({ error: "Invalid search" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
