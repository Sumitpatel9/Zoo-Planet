// ==================== ZOO PLANET - DONATE.JS ====================
// Donation page functionality with API integration

// ==================== API CONFIGURATION ====================
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://zoo-planet-backend.onrender.com';

// const API_BASE = "http://localhost:4000"; // Change this to your backend URL in production

const DONATIONS_API = `${API_BASE}/api/donations`;
const ADOPTIONS_API = `${API_BASE}/api/adoptions`;

console.log(`🔗 Using API: ${API_BASE}`);

// ==================== DONATION TYPE TOGGLE ====================
document.querySelectorAll(".type-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".type-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    const type = this.getAttribute("data-type");
    document.getElementById("donationType").value = type;

    document.getElementById("summaryType").textContent =
      type === "one-time"
        ? "One-Time"
        : type === "monthly"
        ? "Monthly"
        : "Yearly";
  });
});

// ==================== AMOUNT SELECTION ====================
let selectedAmount = 0;

document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("active"));

    if (this.classList.contains("custom-btn")) {
      this.classList.add("active");
      document.getElementById("customAmountGroup").style.display = "block";
      document.getElementById("customAmount").focus();
    } else {
      this.classList.add("active");
      document.getElementById("customAmountGroup").style.display = "none";

      const amount = parseInt(this.getAttribute("data-amount"));
      selectedAmount = amount;
      document.getElementById("selectedAmount").value = amount;
      updateSummary(amount);
    }
  });
});

// Handle custom amount input
document.getElementById("customAmount")?.addEventListener("input", function () {
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
  document.getElementById(
    "summaryAmount"
  ).textContent = `₹${amount.toLocaleString("en-IN")}`;
  document.getElementById(
    "summaryTotal"
  ).textContent = `₹${amount.toLocaleString("en-IN")}`;
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
  ?.addEventListener("change", function () {
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
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10;
}

function showSuccessMessage(message) {
  const successElement = document.getElementById("donationSuccess");
  if (successElement) {
    successElement.querySelector("p").textContent = message;
    successElement.classList.add("show");

    setTimeout(() => {
      successElement.classList.remove("show");
    }, 5000);
  }
}

function showErrorMessage(message) {
  const errorElement = document.getElementById("donationError");
  if (errorElement) {
    errorElement.querySelector("p").textContent = message;
    errorElement.classList.add("show");

    setTimeout(() => {
      errorElement.classList.remove("show");
    }, 5000);
  } else {
    alert(message);
  }
}

// ==================== FORM SUBMISSION WITH BACKEND ====================
document
  .getElementById("donationForm")
  ?.addEventListener("submit", async function (e) {
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

    const email = this.email.value.trim();
    const phone = this.phone.value.trim();
    const firstName = this.firstName.value.trim();
    const lastName = this.lastName.value.trim();

    if (!firstName || !lastName) {
      showErrorMessage("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      showErrorMessage("Please enter a valid email address");
      return;
    }

    if (!validatePhone(phone)) {
      showErrorMessage("Please enter a valid 10-digit phone number");
      return;
    }

    if (!this.terms.checked) {
      showErrorMessage("Please accept the Terms & Conditions");
      return;
    }

    // Prepare form data matching backend model
    const formData = {
      donorName: `${firstName} ${lastName}`,
      email: email,
      phone: phone.replace(/\D/g, ""), // Only digits
      amount: selectedAmount,
      donationType:
        document.getElementById("donationType")?.value || "one-time",
      purpose: this.purpose?.value || "general",
      paymentMethod: this.paymentMethod.value,
      isAnonymous: this.anonymous?.checked || false,
      message: this.message?.value?.trim() || "",
      taxReceiptRequested: this.taxReceipt?.checked !== false,
    };

    console.log("📤 Sending donation data:", formData);

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing Donation...';

    try {
      const response = await fetch(DONATIONS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Donation failed");
      }

      // Success!
      showSuccessMessage(
        `Thank you for your generous donation of ₹${selectedAmount.toLocaleString(
          "en-IN"
        )}! Reference: ${data.donation.donationReference}`
      );

      // Clear localStorage draft
      clearDonationDraft();

      // Reset form after 2 seconds
      setTimeout(() => {
        this.reset();
        selectedAmount = 0;
        updateSummary(0);

        document
          .querySelectorAll(".amount-btn")
          .forEach((b) => b.classList.remove("active"));
        document.getElementById("customAmountGroup").style.display = "none";

        const dedicationFields = document.getElementById("dedicationFields");
        if (dedicationFields) dedicationFields.style.display = "none";

        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);

      // Analytics tracking
      if (typeof gtag !== "undefined") {
        gtag("event", "donation", {
          event_category: "Donations",
          event_label: formData.donationType,
          value: selectedAmount,
        });
      }
    } catch (error) {
      console.error("❌ Donation Error:", error);
      showErrorMessage(
        error.message || "Donation failed. Please try again or contact support."
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

// ==================== ADOPTION MODAL FUNCTIONALITY ====================
let selectedAnimal = "";
let selectedAnimalType = "";
let selectedPrice = 0;
let selectedPlan = "";

function openAdoptModal() {
  const modal = document.getElementById("adoptModal");
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeAdoptModal() {
  const modal = document.getElementById("adoptModal");
  if (modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function selectAnimal(animalName, animalType, plan, price) {
  // ✅ Add validation
  if (!animalName || !price) {
    console.error("Missing required parameters:", {
      animalName,
      animalType,
      plan,
      price,
    });
    return;
  }

  selectedAnimal = animalName;
  selectedAnimalType = animalType || "other";
  selectedPlan = plan || "bronze";
  selectedPrice = Number(price) || 0;

  // Update form modal
  const nameElement = document.getElementById("selectedAnimalName");
  const priceElement = document.getElementById("selectedAnimalPrice");

  if (nameElement) nameElement.textContent = animalName;
  if (priceElement)
    priceElement.textContent = selectedPrice.toLocaleString("en-IN");

  closeAdoptModal();

  setTimeout(() => {
    const formModal = document.getElementById("adoptFormModal");
    if (formModal) {
      formModal.classList.add("show");
      formModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }, 300);
}

function closeAdoptFormModal() {
  const modal = document.getElementById("adoptFormModal");
  if (modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Handle adoption form submission
document
  .getElementById("adoptionForm")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const firstName = this.firstName.value.trim();
    const lastName = this.lastName.value.trim();
    const email = this.email.value.trim();
    const phone = this.phone.value.trim();
    const address = this.address?.value?.trim();
    const city = this.city?.value?.trim();
    const zipCode = this.zipCode?.value?.trim();

    // Validation
    if (!firstName || !lastName) {
      alert("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!validatePhone(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (!address || !city || !zipCode) {
      alert("Please complete your address information");
      return;
    }

    // Prepare form data matching backend model
    const formData = {
      animalName: selectedAnimal,
      animalType: selectedAnimalType,
      adoptionPlan: selectedPlan,
      duration: this.duration?.value || "1year",
      price: selectedPrice,
      adopterName: `${firstName} ${lastName}`,
      email: email,
      phone: phone.replace(/\D/g, ""),
      address: address,
      city: city,
      zipCode: zipCode,
      paymentMethod: this.paymentMethod.value,
      certificateRequested: this.certificate?.checked !== false,
      message: this.message?.value?.trim() || "",
    };

    console.log("📤 Sending adoption data:", formData);

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
      const response = await fetch(ADOPTIONS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Adoption failed");
      }

      // Show success
      const successElement = document.getElementById("adoptionSuccess");
      if (successElement) {
        successElement.querySelector(
          "p"
        ).textContent = `Thank you for adopting ${selectedAnimal}! Reference: ${data.adoption.adoptionReference}`;
        successElement.classList.add("show");
      } else {
        alert(
          `Success! Thank you for adopting ${selectedAnimal}! Reference: ${data.adoption.adoptionReference}`
        );
      }

      setTimeout(() => {
        closeAdoptFormModal();
        this.reset();
        if (successElement) successElement.classList.remove("show");
      }, 3000);
    } catch (error) {
      console.error("❌ Adoption Error:", error);
      alert(error.message || "Adoption failed. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

// Close modals on outside click
window.addEventListener("click", function (e) {
  const adoptModal = document.getElementById("adoptModal");
  const formModal = document.getElementById("adoptFormModal");

  if (e.target === adoptModal) closeAdoptModal();
  if (e.target === formModal) closeAdoptFormModal();
});

// Close modals on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeAdoptModal();
    closeAdoptFormModal();
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

document
  .querySelectorAll(".impact-item, .way-card, .testimonial-card")
  .forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });

// ==================== COUNTER ANIMATION FOR HERO STATS ====================
function animateCounter(element, target, suffix = "+", duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start).toLocaleString() + suffix;
    }
  }, 16);
}

window.addEventListener("load", function () {
  // Define your stats data
  const stats = [
    {
      selector: ".stat-item:nth-child(1) .stat-number",
      value: 500,
      suffix: "+",
    },
    {
      selector: ".stat-item:nth-child(2) .stat-number",
      value: 50,
      suffix: "+",
    },
    {
      selector: ".stat-item:nth-child(3) .stat-number",
      value: 10000,
      suffix: "+",
    },
  ];

  setTimeout(() => {
    stats.forEach((stat) => {
      const element = document.querySelector(stat.selector);
      if (element) {
        element.textContent = "0+"; // Start from 0
        animateCounter(element, stat.value, stat.suffix, 2000);
      }
    });
  }, 300);
});

// ==================== PAYMENT METHOD VISUAL FEEDBACK ====================
document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const label = this.closest("label") || this.nextElementSibling;
    if (label) {
      label.style.transform = "scale(1.05)";
      setTimeout(() => {
        label.style.transform = "scale(1)";
      }, 200);
    }
  });
});

// ==================== STICKY SUMMARY SIDEBAR ====================
(function () {
  const summary = document.querySelector(".donation-summary");
  if (!summary) return;

  window.addEventListener("scroll", function () {
    const scrollPosition = window.pageYOffset;

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
    'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"])'
  );

  formInputs.forEach((input) => {
    const savedValue = localStorage.getItem(`donation_${input.name}`);
    if (savedValue) {
      input.value = savedValue;
    }

    input.addEventListener("input", function () {
      localStorage.setItem(`donation_${this.name}`, this.value);
    });
  });
}

function clearDonationDraft() {
  const donationForm = document.getElementById("donationForm");
  if (donationForm) {
    const formInputs = donationForm.querySelectorAll(
      'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"])'
    );
    formInputs.forEach((input) => {
      localStorage.removeItem(`donation_${input.name}`);
    });
  }
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    const form = document.querySelector(".donation-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
      const firstBtn = document.querySelector(".amount-btn");
      if (firstBtn) firstBtn.focus();
    }
  }
});

// ==================== SOCIAL SHARING ====================
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      "I just donated to Zoo Planet to support wildlife conservation! Join me in making a difference."
    );

    const iconClasses = this.querySelector("i")?.classList;
    let shareUrl = "";

    if (iconClasses?.contains("fa-facebook-f")) {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (
      iconClasses?.contains("fa-twitter") ||
      iconClasses?.contains("fa-x-twitter")
    ) {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (iconClasses?.contains("fa-linkedin-in")) {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (iconClasses?.contains("fa-whatsapp")) {
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
  `%cDonations API: ${DONATIONS_API}`,
  "color: #666; font-weight: bold;"
);
console.log(
  `%cAdoptions API: ${ADOPTIONS_API}`,
  "color: #666; font-weight: bold;"
);
console.log(
  "%cThank you for supporting wildlife conservation! 💚",
  "color: #2d8659;"
);

// ==================== END OF DONATE.JS ====================
