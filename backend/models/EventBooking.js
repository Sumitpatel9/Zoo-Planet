const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema( {
    eventName: {
      type: String,
      required: true,
    },

    eventDate: {
      type: String,
      required: true,
    },

    participants: {
      type: Number,
      min: 1,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    specialRequirements: String,

    termsAccepted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true });

module.exports = mongoose.model("EventBooking", eventBookingSchema);