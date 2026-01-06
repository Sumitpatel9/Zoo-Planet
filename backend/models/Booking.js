const mongoose = require("mongoose");

// ==================== TICKET ITEM SCHEMA ====================
const ticketItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["adult", "child", "senior", "student", "family", "group"],
    required: [true, "Ticket type is required"],
  },
  qty: {
    type: Number,
    min: [1, "Quantity must be at least 1"],
    max: [50, "Quantity cannot exceed 50"],
    required: [true, "Quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

// ==================== BOOKING SCHEMA ====================
const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: [true, "Booking reference is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^(\+91)?[6-9]\d{9}$/, "Please provide a valid mobile number"],
    },
    visitDate: {
      type: String,
      required: [true, "Visit date is required"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["credit", "upi", "paypal", "cash"],
        message: "{VALUE} is not a valid payment method"
      },
      required: [true, "Payment method is required"],
    },
    tickets: {
      type: [ticketItemSchema],
      required: [true, "At least one ticket is required"],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: "At least one ticket must be selected"
      }
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==================== INDEXES ====================
bookingSchema.index({ mobile: 1, createdAt: -1 });
bookingSchema.index({ visitDate: 1 });
bookingSchema.index({ email: 1 });

// ==================== VIRTUAL - TICKET COUNT ====================
bookingSchema.virtual('ticketCount').get(function() {
  return this.tickets.reduce((sum, ticket) => sum + ticket.qty, 0);
});

// ==================== METHOD - FORMAT DISPLAY ====================
bookingSchema.methods.toDisplay = function() {
  return {
    bookingRef: this.bookingRef,
    fullName: this.fullName,
    email: this.email,
    mobile: this.mobile,
    visitDate: this.visitDate,
    paymentMethod: this.paymentMethod,
    tickets: this.tickets,
    totalAmount: this.totalAmount,
    ticketCount: this.ticketCount,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("Booking", bookingSchema);
