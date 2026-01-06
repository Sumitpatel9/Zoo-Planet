const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      required: true,
      enum: ["birthday", "corporate", "school", "wedding"],
    },
    eventDate: { type: Date, required: true },
    preferredTime: {
      type: String,
      required: true,
      enum: ["morning", "afternoon", "evening"],
    },
    guests: { type: Number, required: true, min: 1, max: 200 },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    specialRequests: { type: String, default: "" },
    baseAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "upi", "netbanking", "wallet"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    bookingReference: { type: String }, // ✅ No unique constraint for now
    termsAccepted: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventBooking", eventBookingSchema);
