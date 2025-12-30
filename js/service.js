// Service tabs functionality
document.querySelectorAll(".service-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    // Remove active class from all tabs
    document.querySelectorAll(".service-tab").forEach((t) => {
      t.classList.remove("active");
      t.style.transform = "";
      t.style.boxShadow = "";
    });

    // Add active class to clicked tab with animation
    this.classList.add("active");
    this.style.transform = "translateY(-5px)";
    this.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";

    // Hide all info sections
    document.querySelectorAll(".service-info").forEach((info) => {
      info.classList.remove("active");
    });

    // Show corresponding info section with animation
    const targetInfo = document.getElementById(`${this.dataset.tab}-info`);
    targetInfo.classList.add("active");

    // Scroll to the content smoothly
    targetInfo.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Membership card hover effect enhancement
document.querySelectorAll(".membership-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    if (!this.classList.contains("highlight")) {
      this.style.borderColor = "var(--secondary-green)";
    }
  });

  card.addEventListener("mouseleave", function () {
    if (!this.classList.contains("highlight")) {
      this.style.borderColor = "transparent";
    }
  });
});

// Close other sections when one is opened (for mobile)
function closeOtherSections(currentSection) {
  document.querySelectorAll(".service-info").forEach((section) => {
    if (section !== currentSection && section.classList.contains("active")) {
      section.classList.remove("active");
    }
  });
}

// Handle ESC key to reset tabs (if needed)
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".service-tab").forEach((tab) => {
      tab.classList.remove("active");
      tab.style.transform = "";
      tab.style.boxShadow = "";
    });

    document.querySelectorAll(".service-info").forEach((info) => {
      info.classList.remove("active");
    });

    // Activate first tab by default
    document.querySelector(".service-tab").click();
  }
});

// Tour Booking Modal Functionality
document.querySelectorAll(".tour-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const tourName = this.getAttribute("data-tour");
    document.getElementById("modalTourTitle").textContent = `Book ${tourName}`;
    document.getElementById("tourBookingModal").style.display = "block";
  });
});

// Private Tour Modal Functionality
document
  .getElementById("privateTourBtn")
  .addEventListener("click", function () {
    document.getElementById("privateTourModal").style.display = "block";
  });

// Close Modal Functionality
document.querySelectorAll(".close-modal").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    this.closest(".modal").style.display = "none";
  });
});

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
});

// Form Submissions
document
  .getElementById("tourBookingForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // Here you would normally send the data to your server
    document.getElementById("tourBookingModal").style.display = "none";

    // Show confirmation
    document.getElementById("confirmationTitle").textContent =
      "Tour Booking Confirmed!";
    document.getElementById("confirmationMessage").textContent =
      "Thank you for your booking. We've sent a confirmation to your email.";
    document.getElementById("confirmationModal").style.display = "block";

    // Reset form
    this.reset();
  });

document
  .getElementById("privateTourForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    // Here you would normally send the data to your server
    document.getElementById("privateTourModal").style.display = "none";

    // Show confirmation
    document.getElementById("confirmationTitle").textContent =
      "Inquiry Submitted!";
    document.getElementById("confirmationMessage").textContent =
      "Thank you for your private tour inquiry. Our team will contact you within 24 hours to discuss your request.";
    document.getElementById("confirmationModal").style.display = "block";

    // Reset form
    this.reset();
  });

// Close confirmation modal
document
  .querySelector(".close-confirmation")
  .addEventListener("click", function () {
    document.getElementById("confirmationModal").style.display = "none";
  });

// Set minimum date for date inputs to today
const today = new Date().toISOString().split("T")[0];
document.getElementById("tourDate").min = today;
document.getElementById("preferredDate1").min = today;
document.getElementById("preferredDate2").min = today;

// Membership Form Functionality
document.querySelectorAll(".membership-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const plan = this.getAttribute("data-plan");
    const price = this.getAttribute("data-price");

    document.getElementById(
      "membershipModalTitle"
    ).textContent = `Join ${plan} Membership`;
    document.getElementById("membershipPlan").value = `${plan} Membership`;
    document.getElementById("membershipPrice").value = `₹${price}/year`;

    // Show/hide family member fields
    const familyFields = document.querySelector(".family-fields");
    if (plan === "Family") {
      familyFields.style.display = "block";
    } else {
      familyFields.style.display = "none";
    }

    document.getElementById("membershipModal").style.display = "block";
  });
});

// Event Booking Functionality
document.querySelectorAll(".event-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const eventName = this.getAttribute("data-event");
    document.getElementById(
      "eventModalTitle"
    ).textContent = `Book ${eventName}`;
    document.getElementById("eventName").value = eventName;

    // Populate dates (this would normally come from an API)
    const dateSelect = document.getElementById("eventDate");
    dateSelect.innerHTML = '<option value="">Select available date</option>';

    // Add sample dates based on event type
    if (eventName === "Moonlight Safari") {
      addDateOptions(dateSelect, "Friday", 4);
    } else if (eventName === "Breakfast with Giraffes") {
      addDateOptions(dateSelect, "Saturday", 3);
    } else if (eventName === "Photography Workshop") {
      addDateOptions(dateSelect, "Sunday", 2);
    }

    document.getElementById("eventBookingModal").style.display = "block";
  });
});

// Helper function to add date options
function addDateOptions(select, dayOfWeek, count) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const targetDay = days.indexOf(dayOfWeek);

  const today = new Date();
  let found = 0;
  let date = new Date(today);

  while (found < count) {
    if (date.getDay() === targetDay) {
      const dateStr = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const option = document.createElement("option");
      option.value = date.toISOString().split("T")[0];
      option.textContent = dateStr;
      select.appendChild(option);

      found++;
    }
    date.setDate(date.getDate() + 1);
  }
}

// Payment method toggle
document
  .getElementById("paymentMethod")
  .addEventListener("change", function () {
    document.querySelector(".payment-details").style.display = "none";
    document.querySelector(".upi-details").style.display = "none";

    if (this.value === "credit") {
      document.querySelector(".payment-details").style.display = "block";
    } else if (this.value === "upi") {
      document.querySelector(".upi-details").style.display = "block";
    }
  });

// Form Submissions
// document.getElementById('membershipForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     document.getElementById('membershipModal').style.display = 'none';

//     // Set confirmation details
//     const plan = document.getElementById('membershipPlan').value;
//     document.getElementById('confirmationPlan').textContent = plan;

//     // Generate random member ID
//     const randomId = 'ZM' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
//     document.getElementById('memberId').textContent = randomId;

//     // Set expiry date (1 year from now)
//     const expiry = new Date();
//     expiry.setFullYear(expiry.getFullYear() + 1);
//     document.getElementById('expiryDate').textContent = expiry.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     document.getElementById('membershipConfirmation').style.display = 'block';
//     this.reset();
// });

// document
//   .getElementById("membershipForm")
//   .addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const formData = {
//       membershipPlan: document
//         .getElementById("membershipPlan")
//         .value.replace(" Membership", "")
//         .value.toLowerCase(),
//       price: Number(
//         document.getElementById("membershipPrice").value.replace(/\D/g, "")
//       ),
//       firstName: document.getElementById("firstName").value,
//       lastName: document.getElementById("lastName").value,
//       email: document.getElementById("email").value,
//       phone: document.getElementById("phone").value,
//       address: document.getElementById("address").value,
//       city: document.getElementById("city").value,
//       zipCode: document.getElementById("zipCode").value,
//       paymentMethod: document.getElementById("paymentMethod").value,
//       termsAccepted: document.getElementById("agreeTerms").checked,
//     };

//     try {
//       const res = await fetch("http://localhost:4000/api/memberships", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Membership failed");

//       document.getElementById("membershipModal").style.display = "none";
//       document.getElementById("membershipConfirmation").style.display = "block";
//       this.reset();
//     } catch (err) {
//       alert(err.message);
//     }
//   });

document.getElementById("membershipForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const termsCheckbox = document.getElementById("agreeTerms");
  if (!termsCheckbox || !termsCheckbox.checked) {
    alert("You must accept Terms & Conditions");
    return;
  }

  const planRaw = document.getElementById("membershipPlan").value;

  const formData = {
    membershipPlan: planRaw.replace(" Membership", "").toLowerCase(),
    price: Number(document.getElementById("membershipPrice").value.replace(/\D/g, "")),
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    zipCode: document.getElementById("zipCode").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    termsAccepted: true
  };

  try {
    const res = await fetch("http://localhost:4000/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Membership failed");

    document.getElementById("membershipModal").style.display = "none";
    document.getElementById("membershipConfirmation").style.display = "block";
    this.reset();

  } catch (err) {
    alert(err.message);
  }
});


// document.getElementById('eventBookingForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     document.getElementById('eventBookingModal').style.display = 'none';

//     // Show confirmation
//     document.getElementById('confirmationTitle').textContent = 'Event Booking Confirmed!';
//     const eventName = document.getElementById('eventName').value;
//     document.getElementById('confirmationMessage').textContent =
//         `Your booking for ${eventName} has been confirmed. Details have been sent to your email.`;
//     document.getElementById('confirmationModal').style.display = 'block';

//     this.reset();
// });

document
  .getElementById("eventBookingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      eventName: document.getElementById("eventName").value,
      eventDate: document.getElementById("eventDate").value,
      participants: Number(document.getElementById("eventParticipants").value),
      fullName: document.getElementById("eventFullName").value,
      email: document.getElementById("eventEmail").value,
      phone: document.getElementById("eventPhone").value,
      specialRequirements: document.getElementById("eventSpecialReq").value,
      termsAccepted: document.getElementById("eventAgreeTerms").checked,
    };

    try {
      const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Event booking failed");

      document.getElementById("eventBookingModal").style.display = "none";
      document.getElementById("confirmationModal").style.display = "block";
      this.reset();
    } catch (err) {
      alert(err.message);
    }
  });

document.getElementById("tourBookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    tourDate: document.getElementById("tourDate").value,
    tourTime: document.getElementById("tourTime").value,
    participants: Number(document.getElementById("participants").value),
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    specialRequests: document.getElementById("specialRequests").value.trim(),
  };

  // ✅ Correct validation
  if (
    !formData.tourDate ||
    !formData.tourTime ||
    formData.participants <= 0 ||
    !formData.fullName ||
    !formData.email ||
    !formData.phone
  ) {
    alert("Please fill all required tour fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Tour booking failed");

    document.getElementById("tourBookingModal").style.display = "none";
    document.getElementById("confirmationModal").style.display = "block";
    this.reset();
  } catch (err) {
    alert(err.message);
  }
});



// Close modals
document
  .querySelectorAll(".close-modal, .close-confirmation")
  .forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none";
    });
  });

window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
});
