// ==================== ZOO PLANET - DONATE.JS ====================
// Donation page functionality with API integration

const API_BASE = "https://zoo-planet-backend.onrender.com";

// ==================== DONATION TYPE TOGGLE ====================
document.querySelectorAll(".type-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove active from all
    document
      .querySelectorAll(".type-btn")
      .forEach((b) => b.classList.remove("active"));

    // Add active to clicked
    this.classList.add("active");

    // Update hidden input
    const type = this.getAttribute("data-type");
    document.getElementById("donationType").value = type;

    // Update summary
    document.getElementById("summaryType").textContent =
      type === "one-time" ? "One-Time" : "Monthly";
  });
});

// ==================== AMOUNT SELECTION ====================
let selectedAmount = 0;

document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove active from all
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("active"));

    // Check if custom button
    if (this.classList.contains("custom-btn")) {
      this.classList.add("active");
      document.getElementById("customAmountGroup").style.display = "block";
      document.getElementById("customAmount").focus();
    } else {
      // Regular amount button
      this.classList.add("active");
      document.getElementById("customAmountGroup").style.display = "none";

      const amount = parseInt(this.getAttribute("data-amount"));
      selectedAmount = amount;

      // Update hidden input
      document.getElementById("selectedAmount").value = amount;

      // Update summary
      updateSummary(amount);
    }
  });
});

// Handle custom amount input
document.getElementById("customAmount").addEventListener("input", function () {
  const amount = parseInt(this.value) || 0;

  if (amount >= 100) {
    selectedAmount = amount;
    document.getElementById("selectedAmount").value = amount;
    updateSummary(amount);
  } else {
    selectedAmount = 0;
    updateSummary(0);
  }
});

// ==================== UPDATE SUMMARY ====================
function updateSummary(amount) {
  // Update amount display
  document.getElementById(
    "summaryAmount"
  ).textContent = `₹${amount.toLocaleString("en-IN")}`;
  document.getElementById(
    "summaryTotal"
  ).textContent = `₹${amount.toLocaleString("en-IN")}`;

  // Update impact text
  updateImpactText(amount);
}

function updateImpactText(amount) {
  const impactText = document.getElementById("impactText");

  if (amount === 0) {
    impactText.textContent = "Select an amount to see your impact";
  } else if (amount < 500) {
    impactText.textContent =
      "Provides nutritious meals for small animals for a day";
  } else if (amount < 1000) {
    impactText.textContent = "Feeds 5 animals for an entire day";
  } else if (amount < 2500) {
    impactText.textContent =
      "Covers medical checkup and basic care for one animal";
  } else if (amount < 5000) {
    impactText.textContent = "Helps upgrade and enrich animal habitats";
  } else if (amount < 10000) {
    impactText.textContent =
      "Supports a month-long conservation research project";
  } else {
    impactText.textContent =
      "Makes a major impact on multiple conservation programs!";
  }
}

// ==================== DEDICATION CHECKBOX ====================
document
  .getElementById("dedicationCheck")
  .addEventListener("change", function () {
    const dedicationFields = document.getElementById("dedicationFields");
    if (this.checked) {
      dedicationFields.style.display = "block";
    } else {
      dedicationFields.style.display = "none";
    }
  });

// ==================== FORM VALIDATION ====================
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(phone) {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && regex.test(phone);
}

function showSuccessMessage(message) {
  const successElement = document.getElementById("donationSuccess");
  successElement.querySelector("p").textContent = message;
  successElement.classList.add("show");

  setTimeout(() => {
    successElement.classList.remove("show");
  }, 5000);
}

function showErrorMessage(message) {
  const errorElement = document.getElementById("donationError");
  errorElement.querySelector("p").textContent = message;
  errorElement.classList.add("show");

  setTimeout(() => {
    errorElement.classList.remove("show");
  }, 5000);
}

// ==================== FORM SUBMISSION WITH BACKEND ====================
document
  .getElementById("donationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Validation
    if (selectedAmount < 100) {
      showErrorMessage(
        "Please select or enter a donation amount (minimum ₹100)"
      );
      return;
    }

    const email = this.email.value;
    const phone = this.phone.value;

    if (!validateEmail(email)) {
      showErrorMessage("Please enter a valid email address");
      return;
    }

    if (!validatePhone(phone)) {
      showErrorMessage("Please enter a valid phone number");
      return;
    }

    // Check terms
    if (!this.terms.checked) {
      showErrorMessage("Please accept the Terms & Conditions");
      return;
    }

    // Prepare form data
    const formData = {
      donationType: document.getElementById("donationType").value,
      amount: selectedAmount,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: email,
      phone: phone,
      paymentMethod: this.paymentMethod.value,
      newsletter: this.newsletter.checked,
      termsAccepted: this.terms.checked,
      timestamp: new Date().toISOString(),
    };

    // Add dedication if selected
    const dedicationCheck = document.getElementById("dedicationCheck");
    if (dedicationCheck.checked) {
      formData.dedication = {
        type: this.dedicationType.value,
        name: this.dedicationName.value,
      };
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing Donation...';

    try {
      // Make API call to backend
      const response = await fetch(`${API_BASE}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Donation failed");
      }

      // Success!
      showSuccessMessage(
        "Thank you for your generous donation! A receipt has been sent to your email."
      );

      // Reset form after 2 seconds
      setTimeout(() => {
        this.reset();
        selectedAmount = 0;
        updateSummary(0);

        // Remove active states
        document
          .querySelectorAll(".amount-btn")
          .forEach((b) => b.classList.remove("active"));
        document.getElementById("customAmountGroup").style.display = "none";
        document.getElementById("dedicationFields").style.display = "none";

        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 2000);

      // Analytics tracking (if Google Analytics is available)
      if (typeof gtag !== "undefined") {
        gtag("event", "donation", {
          event_category: "Donations",
          event_label: formData.donationType,
          value: selectedAmount,
        });
      }
    } catch (error) {
      console.error("Donation Error:", error);
      showErrorMessage(
        error.message || "Donation failed. Please try again or contact support."
      );
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

// ==================== SMOOTH SCROLL TO DONATION FORM ====================
document.querySelectorAll('a[href="#donation-form"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector("#donation-form");
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(".impact-item, .way-card, .testimonial-card")
  .forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });

// ==================== COUNTER ANIMATION FOR HERO STATS ====================
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent =
        target + (element.textContent.includes("K") ? "K+" : "+");
      clearInterval(timer);
    } else {
      element.textContent =
        Math.floor(start) + (element.textContent.includes("K") ? "K+" : "+");
    }
  }, 16);
}

// Animate counters when page loads
window.addEventListener("load", function () {
  const statNumbers = document.querySelectorAll(".stat-number");

  setTimeout(() => {
    statNumbers.forEach((stat) => {
      const text = stat.textContent;
      const number = parseInt(text.replace(/[^\d]/g, ""));

      if (text.includes("K")) {
        animateCounter(stat, number, 2000);
      } else {
        animateCounter(stat, number, 1500);
      }
    });
  }, 300);
});

// ==================== PAYMENT METHOD VISUAL FEEDBACK ====================
document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    // Add ripple effect or animation here if needed
    const card = this.nextElementSibling;
    card.style.transform = "scale(1.05)";
    setTimeout(() => {
      card.style.transform = "scale(1)";
    }, 200);
  });
});

// ==================== PAYMENT METHOD VISUAL FEEDBACK ====================
document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const card = this.nextElementSibling;
    card.style.transform = "scale(1.05)";
    setTimeout(() => {
      card.style.transform = "scale(1)";
    }, 200);
  });
});

// ==================== STICKY SUMMARY SIDEBAR ====================
(function () {
  const summary = document.querySelector(".donation-summary");
  if (!summary) return;

  window.addEventListener("scroll", function () {
    const scrollPosition = window.pageYOffset;

    // Add shadow effect when scrolling
    if (scrollPosition > 200) {
      summary.style.transition = "box-shadow 0.3s ease";
      summary.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    } else {
      summary.style.boxShadow = "none";
    }
  });
})();

// ==================== LOCAL STORAGE FOR DRAFT DONATIONS ====================
const donationForm = document.getElementById("donationForm");
if (donationForm) {
  const formInputs = donationForm.querySelectorAll(
    'input:not([type="checkbox"]):not([type="radio"])'
  );

  formInputs.forEach((input) => {
    // Load saved data on page load
    const savedValue = localStorage.getItem(`donation_${input.name}`);
    if (savedValue && input.type !== "hidden") {
      input.value = savedValue;
    }

    // Save data on change
    input.addEventListener("input", function () {
      localStorage.setItem(`donation_${this.name}`, this.value);
    });
  });
}

// Clear localStorage after successful donation
function clearDonationDraft() {
  const donationForm = document.getElementById("donationForm");
  if (donationForm) {
    const formInputs = donationForm.querySelectorAll(
      'input:not([type="checkbox"]):not([type="radio"])'
    );
    formInputs.forEach((input) => {
      localStorage.removeItem(`donation_${input.name}`);
    });
  }
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + D = Focus on donation form
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    document
      .querySelector(".donation-form")
      .scrollIntoView({ behavior: "smooth" });
    document.querySelector(".amount-btn").focus();
  }
});

// ==================== PRINT RECEIPT FUNCTION ====================
function printReceipt(donationData) {
  const receiptWindow = window.open("", "_blank");
  receiptWindow.document.write(`
        <html>
        <head>
            <title>Donation Receipt - Zoo Planet</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .amount { font-size: 2rem; color: #2d8659; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                .footer { margin-top: 40px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🦁 Zoo Planet</h1>
                <h2>Donation Receipt</h2>
            </div>
            <div class="amount">₹${donationData.amount}</div>
            <table>
                <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
                <tr><td>Donor:</td><td>${donationData.firstName} ${
    donationData.lastName
  }</td></tr>
                <tr><td>Email:</td><td>${donationData.email}</td></tr>
                <tr><td>Type:</td><td>${donationData.donationType}</td></tr>
                <tr><td>Payment Method:</td><td>${
                  donationData.paymentMethod
                }</td></tr>
            </table>
            <div class="footer">
                <p>This donation is tax-deductible under Section 80G</p>
                <p>Thank you for supporting wildlife conservation!</p>
            </div>
        </body>
        </html>
    `);
  receiptWindow.document.close();
  receiptWindow.print();
}

// ==================== SOCIAL SHARING ====================
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      "I just donated to Zoo Planet to support wildlife conservation! Join me in making a difference."
    );

    const platform = this.querySelector("i").classList;
    let shareUrl = "";

    if (platform.contains("fa-facebook-f")) {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform.contains("fa-twitter")) {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform.contains("fa-linkedin-in")) {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform.contains("fa-whatsapp")) {
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  });
});

// ==================== CONSOLE LOG ====================
console.log(
  "%c🦁 Zoo Planet Donate Page Loaded!",
  "color: #2d8659; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cBackend API: `${API_BASE}/api/donations`/api/donations",
  "color: #666; font-weight: bold;"
);
console.log(
  "%cThank you for supporting wildlife conservation! 💚",
  "color: #2d8659;"
);
// ==================== END OF DONATE.JS ====================

// ==================== ADOPTION MODAL FUNCTIONALITY ====================
let selectedAnimal = '';
let selectedPrice = 0;

function openAdoptModal() {
    document.getElementById('adoptModal').classList.add('show');
    document.getElementById('adoptModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAdoptModal() {
    document.getElementById('adoptModal').classList.remove('show');
    document.getElementById('adoptModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function selectAnimal(animal, price) {
    selectedAnimal = animal;
    selectedPrice = price;
    
    // Update form modal
    document.getElementById('selectedAnimalName').textContent = animal;
    document.getElementById('selectedAnimalPrice').textContent = price.toLocaleString('en-IN');
    
    // Close selection modal, open form modal
    closeAdoptModal();
    
    setTimeout(() => {
        document.getElementById('adoptFormModal').classList.add('show');
        document.getElementById('adoptFormModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 300);
}

function closeAdoptFormModal() {
    document.getElementById('adoptFormModal').classList.remove('show');
    document.getElementById('adoptFormModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle adoption form submission
document.getElementById('adoptionForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        animal: selectedAnimal,
        price: selectedPrice,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        phone: this.phone.value,
        paymentMethod: this.paymentMethod.value,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Adoption failed');
        
        // Show success
        document.getElementById('adoptionSuccess').classList.add('show');
        
        setTimeout(() => {
            closeAdoptFormModal();
            this.reset();
            document.getElementById('adoptionSuccess').classList.remove('show');
        }, 3000);
        
    } catch (error) {
        alert(error.message || 'Adoption failed. Please try again.');
    }
});
