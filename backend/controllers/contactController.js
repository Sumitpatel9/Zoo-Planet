const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All required fields must be filled",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact message saved successfully",
      contact,
    });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
