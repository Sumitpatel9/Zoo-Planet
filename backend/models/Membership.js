const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    membershipPlan: {
      type: String,
      enum: ["individual", "family", "premium"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    zipCode: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["credit", "upi", "cash"],
      required: true,
    },

    termsAccepted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
