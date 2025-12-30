const mongoose = require("mongoose");

const tourBookingSchema = new mongoose.Schema(
  {
    tourName: {
      type: String,
      default: "Family Explorer Tour",
    },

    tourDate: {
      type: String,
      required: true,
    },

    tourTime: {
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

    specialRequests: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TourBooking", tourBookingSchema);
