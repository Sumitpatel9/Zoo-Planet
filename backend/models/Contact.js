const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+91)?[6-9]\d{9}$/, "Please provide a valid mobile number"]
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [5, "Subject must be at least 5 characters"],
      maxlength: [200, "Subject cannot exceed 200 characters"]
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'read', 'replied', 'resolved', 'spam'],
        message: "{VALUE} is not a valid status"
      },
      default: 'new'
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"]
    },
    repliedAt: {
      type: Date
    },
    ipAddress: {
      type: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==================== INDEXES ====================
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

// ==================== VIRTUAL - RESPONSE TIME ====================
contactSchema.virtual('responseTime').get(function() {
  if (this.repliedAt) {
    return Math.round((this.repliedAt - this.createdAt) / (1000 * 60 * 60)); // Hours
  }
  return null;
});

// ==================== METHOD - TO DISPLAY ====================
contactSchema.methods.toDisplay = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    subject: this.subject,
    message: this.message,
    status: this.status,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("Contact", contactSchema);
