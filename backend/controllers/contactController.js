const Contact = require("../models/Contact");

// ==================== VALIDATION HELPERS ====================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Indian mobile: 10 digits, optional +91
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ==================== CREATE CONTACT ====================
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // console.log("📧 Contact form submission:", { name, email, subject });

    // ========== VALIDATION ==========
    
    // Check required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "Please fill in all required fields",
        details: {
          name: !name ? "Name is required" : null,
          email: !email ? "Email is required" : null,
          subject: !subject ? "Subject is required" : null,
          message: !message ? "Message is required" : null
        }
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        error: "Name must be at least 2 characters long"
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        error: "Name cannot exceed 100 characters"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address"
      });
    }

    // Validate phone if provided
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        error: "Please provide a valid 10-digit mobile number"
      });
    }

    // Validate subject length
    if (subject.trim().length < 5) {
      return res.status(400).json({
        error: "Subject must be at least 5 characters long"
      });
    }

    if (subject.trim().length > 200) {
      return res.status(400).json({
        error: "Subject cannot exceed 200 characters"
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        error: "Message must be at least 10 characters long"
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        error: "Message cannot exceed 2000 characters"
      });
    }

    // ========== CHECK FOR SPAM (Optional) ==========
    // Prevent rapid submissions from same email
    const recentContact = await Contact.findOne({
      email: email.trim().toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
    });

    if (recentContact) {
      return res.status(429).json({
        error: "Please wait at least 5 minutes before submitting another message"
      });
    }

    // ========== CREATE CONTACT ==========
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.replace(/\s/g, '') : undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: "new",
      ipAddress: req.ip || req.connection.remoteAddress
    });

    console.log("✅ Contact message saved:", contact._id);

    // ========== SEND RESPONSE ==========
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      contactId: contact._id,
      contact: {
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });

    // TODO: Send email notification to admin (implement later)
    // sendAdminNotification(contact);

  } catch (error) {
    console.error("❌ Contact error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message
      });
    }

    res.status(500).json({ 
      error: "Failed to submit contact form. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== GET ALL CONTACTS (ADMIN) ====================
exports.getAllContacts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Search by name, email, or subject
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("❌ Get contacts error:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// ==================== GET CONTACT BY ID (ADMIN) ====================
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({
      success: true,
      contact
    });

  } catch (error) {
    console.error("❌ Get contact error:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: "Invalid contact ID" });
    }
    
    res.status(500).json({ error: "Failed to fetch contact" });
  }
};

// ==================== UPDATE CONTACT STATUS (ADMIN) ====================
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['new', 'read', 'replied', 'resolved', 'spam'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminNotes: adminNotes || undefined,
        repliedAt: status === 'replied' ? new Date() : undefined
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({
      success: true,
      message: "Contact status updated successfully",
      contact
    });

  } catch (error) {
    console.error("❌ Update contact error:", error);
    res.status(500).json({ error: "Failed to update contact" });
  }
};

// ==================== DELETE CONTACT (ADMIN) ====================
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully"
    });

  } catch (error) {
    console.error("❌ Delete contact error:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};

// ==================== GET CONTACT STATS (ADMIN) ====================
exports.getContactStats = async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });

    // Get contacts from last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // Get today's contacts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayContacts = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      stats: {
        total: totalContacts,
        new: newContacts,
        replied: repliedContacts,
        resolved: resolvedContacts,
        lastWeek: recentContacts,
        today: todayContacts
      }
    });

  } catch (error) {
    console.error("❌ Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// ==================== GET ALL CONTACTS (Quick View) ====================
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`📋 Retrieved ${contacts.length} contacts`);

    res.json({
      success: true,
      count: contacts.length,
      contacts
    });

  } catch (error) {
    console.error("❌ Get contacts error:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};
