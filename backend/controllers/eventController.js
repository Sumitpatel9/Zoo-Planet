const EventBooking = require("../models/EventBooking");

exports.createEvent = async (req, res) => {
  try {
    console.log('\n📥 Event Request:', req.body);

    const {
      eventName, eventType, eventDate, preferredTime,
      guests, contactName, email, phone,
      specialRequests, baseAmount, totalAmount, paymentMethod
    } = req.body;

    // ✅ Generate booking reference HERE instead of in model
    const bookingReference = `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const event = await EventBooking.create({
      eventName: eventName || 'Unknown Event',
      eventType: eventType || 'birthday',
      eventDate: new Date(eventDate),
      preferredTime: preferredTime || 'morning',
      guests: parseInt(guests) || 1,
      contactName: contactName || 'Guest',
      email: email || 'test@example.com',
      phone: phone || '9999999999',
      specialRequests: specialRequests || '',
      baseAmount: parseFloat(baseAmount) || 0,
      totalAmount: parseFloat(totalAmount) || 0,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'completed',
      status: 'confirmed',
      termsAccepted: true,
      bookingReference: bookingReference  // ✅ Set it here
    });

    console.log('✅ Event created:', event.bookingReference);

    res.status(201).json({
      success: true,
      message: "Event booked successfully!",
      booking: {
        bookingReference: event.bookingReference,
        _id: event._id,
        eventName: event.eventName,
        eventType: event.eventType,
        contactName: event.contactName,
        email: event.email,
        guests: event.guests,
        totalAmount: event.totalAmount,
        status: event.status
      }
    });

  } catch (error) {
    console.error('❌ Create Event Error:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      error: "Failed to create event booking",
      details: error.message
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await EventBooking.find().limit(20).sort('-createdAt');
    res.json({ success: true, events, count: events.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventByReference = async (req, res) => {
  try {
    const event = await EventBooking.findOne({ 
      bookingReference: req.params.reference.toUpperCase() 
    });
    if (!event) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const event = await EventBooking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventStats = async (req, res) => {
  try {
    const total = await EventBooking.countDocuments();
    const confirmed = await EventBooking.countDocuments({ status: 'confirmed' });
    res.json({ success: true, stats: { total, confirmed } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
