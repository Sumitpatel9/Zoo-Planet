const mongoose = require("mongoose");

const ticketItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["adult", "child", "senior", "student", "family", "group"],
    required: true,
  },
  qty: {
    type: Number,
    min: 1,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },

    visitDate: { type: String, required: true },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "paypal", "cash"],
      required: true,
    },

    tickets: {
      type: [ticketItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
