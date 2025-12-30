const Membership = require("../models/Membership");

// Create a new membership
exports.createMembership = async (req, res) => {
  try {
    const {
      membershipPlan,
      price,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zipCode,
      paymentMethod,
      termsAccepted,
    } = req.body;

     if (!membershipPlan) {
      return res.status(400).json({
        error: "Membership plan is required",
      });
    }

    const normalizedPlan = membershipPlan
      .replace(" membership", "")
      .toLowerCase();

    // Validation
    if (
      !membershipPlan ||
      !price ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !zipCode ||
      !paymentMethod ||
      termsAccepted !== true
    ) {
      return res.status(400).json({
        error: "All required fields must be filled",
      });
    }

    const membership = await Membership.create({
      membershipPlan: normalizedPlan,
      price,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zipCode,
      paymentMethod,
      termsAccepted,
    });

    res.status(201).json({
      success: true,
      message: "Membership created successfully",
      membership,
    });
  } catch (error) {
    console.error("Membership Error:", error);
    res.status(500).json({ error: error.message });
  }
};
