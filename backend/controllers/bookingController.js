const Booking = require("../models/Booking");

// ==================== GENERATE BOOKING REFERENCE ====================
function generateBookingRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "WAZ-";
  
  // Add 3 letters
  for (let i = 0; i < 3; i++) {
    ref += chars.substring(0, 23)[Math.floor(Math.random() * 23)];
  }
  
  // Add 4 numbers
  for (let i = 0; i < 4; i++) {
    ref += chars.substring(23)[Math.floor(Math.random() * 10)];
  }
  
  return ref;
}

// ==================== VALIDATE EMAIL ====================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== VALIDATE MOBILE ====================
function isValidMobile(mobile) {
  // Indian mobile: 10 digits, can start with +91
  const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\s/g, ''));
}

// ==================== VALIDATE VISIT DATE ====================
function isValidVisitDate(visitDate) {
  const date = new Date(visitDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

// ==================== CREATE BOOKING ====================
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

    console.log("📥 Booking request received:", {
      fullName,
      email,
      mobile,
      visitDate,
      ticketCount: tickets?.length
    });

    // ========== VALIDATION ==========
    
    // Check required fields
    if (!fullName || !email || !mobile || !visitDate || !paymentMethod) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          fullName: !fullName,
          email: !email,
          mobile: !mobile,
          visitDate: !visitDate,
          paymentMethod: !paymentMethod
        }
      });
    }

    // Validate tickets
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ 
        error: "Please select at least one ticket" 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: "Invalid email address" 
      });
    }

    // Validate mobile format
    if (!isValidMobile(mobile)) {
      return res.status(400).json({ 
        error: "Invalid mobile number. Please enter a valid 10-digit number" 
      });
    }

    // Validate visit date
    if (!isValidVisitDate(visitDate)) {
      return res.status(400).json({ 
        error: "Visit date must be today or in the future" 
      });
    }

    // Validate payment method
    const validPaymentMethods = ["credit", "upi", "paypal", "cash"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        error: "Invalid payment method" 
      });
    }

    // Validate ticket types and prices
    const validTicketTypes = ["adult", "child", "senior", "family", "student", "group"];
    const ticketPrices = {
      adult: 24.99,
      child: 14.99,
      senior: 19.99,
      family: 69.99,
      student: 18.99,
      group: 12.99
    };

    for (const ticket of tickets) {
      // Check valid type
      if (!validTicketTypes.includes(ticket.type)) {
        return res.status(400).json({ 
          error: `Invalid ticket type: ${ticket.type}` 
        });
      }

      // Check quantity
      if (!ticket.qty || ticket.qty < 1 || ticket.qty > 50) {
        return res.status(400).json({ 
          error: `Invalid quantity for ${ticket.type} ticket` 
        });
      }

      // Verify price (prevent price manipulation)
      if (Math.abs(ticket.price - ticketPrices[ticket.type]) > 0.01) {
        return res.status(400).json({ 
          error: `Invalid price for ${ticket.type} ticket` 
        });
      }
    }

    // ========== CALCULATE TOTAL ==========
    const calculatedTotal = tickets.reduce(
      (sum, t) => sum + (t.price * t.qty),
      0
    );

    // Round to 2 decimal places
    const totalAmount = Math.round(calculatedTotal * 100) / 100;

    // ========== GENERATE UNIQUE BOOKING REF ==========
    let bookingRef;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      bookingRef = generateBookingRef();
      const existing = await Booking.findOne({ bookingRef });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ 
        error: "Failed to generate unique booking reference. Please try again." 
      });
    }

    // ========== CREATE BOOKING ==========
    const booking = await Booking.create({
      bookingRef,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.replace(/\s/g, ''), // Remove spaces
      visitDate,
      paymentMethod,
      tickets,
      totalAmount,
      notes: notes ? notes.trim() : "",
    });

    console.log("✅ Booking created successfully:", bookingRef);

    // ========== SEND RESPONSE ==========
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingRef: booking.bookingRef,
      createdAt: booking.createdAt,
      totalAmount: booking.totalAmount,
      booking: {
        bookingRef: booking.bookingRef,
        fullName: booking.fullName,
        email: booking.email,
        mobile: booking.mobile,
        visitDate: booking.visitDate,
        paymentMethod: booking.paymentMethod,
        tickets: booking.tickets,
        totalAmount: booking.totalAmount,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Booking error:", error);
    
    // Handle duplicate booking reference (shouldn't happen, but just in case)
    if (error.code === 11000) {
      return res.status(500).json({ 
        error: "Booking reference conflict. Please try again." 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed",
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: "Failed to create booking. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== SEARCH BOOKING ====================
exports.getBookingBySearch = async (req, res) => {
  try {
    const { bookingRef, mobile } = req.query;

    console.log("🔍 Search request:", { bookingRef, mobile });

    // ========== SEARCH BY BOOKING REFERENCE ==========
    if (bookingRef) {
      const booking = await Booking.findOne({ 
        bookingRef: bookingRef.toUpperCase().trim() 
      });

      if (!booking) {
        return res.status(404).json({ 
          error: "Booking not found. Please check your booking reference." 
        });
      }

      console.log("✅ Booking found:", bookingRef);

      return res.json({ 
        type: "single", 
        booking: {
          bookingRef: booking.bookingRef,
          fullName: booking.fullName,
          email: booking.email,
          mobile: booking.mobile,
          visitDate: booking.visitDate,
          paymentMethod: booking.paymentMethod,
          tickets: booking.tickets,
          totalAmount: booking.totalAmount,
          createdAt: booking.createdAt,
          notes: booking.notes
        }
      });
    }

    // ========== SEARCH BY MOBILE NUMBER ==========
    if (mobile) {
      // Remove spaces and validate
      const cleanMobile = mobile.replace(/\s/g, '');
      
      if (!isValidMobile(cleanMobile)) {
        return res.status(400).json({ 
          error: "Invalid mobile number format" 
        });
      }

      // Search with and without country code
      const bookings = await Booking.find({
        $or: [
          { mobile: cleanMobile },
          { mobile: cleanMobile.replace(/^\+91/, '') },
          { mobile: '+91' + cleanMobile.replace(/^\+91/, '') }
        ]
      }).sort({ createdAt: -1 });

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ 
          error: "No bookings found for this mobile number" 
        });
      }

      console.log(`✅ Found ${bookings.length} booking(s) for mobile:`, mobile);

      return res.json({ 
        type: "multiple", 
        bookings: bookings.map(b => ({
          bookingRef: b.bookingRef,
          fullName: b.fullName,
          email: b.email,
          mobile: b.mobile,
          visitDate: b.visitDate,
          paymentMethod: b.paymentMethod,
          tickets: b.tickets,
          totalAmount: b.totalAmount,
          createdAt: b.createdAt
        }))
      });
    }

    // ========== NO SEARCH PARAMS ==========
    res.status(400).json({ 
      error: "Please provide either booking reference or mobile number" 
    });

  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ 
      error: "Search failed. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== GET ALL BOOKINGS (ADMIN) ====================
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, visitDate, paymentMethod } = req.query;

    const query = {};
    
    // Filter by visit date
    if (visitDate) {
      query.visitDate = visitDate;
    }
    
    // Filter by payment method
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBookings: count
    });

  } catch (error) {
    console.error("❌ Get bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ==================== GET BOOKING STATS (ADMIN) ====================
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayBookings
    });

  } catch (error) {
    console.error("❌ Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
