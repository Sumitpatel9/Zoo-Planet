// ==================== ZOO PLANET - SERVICES.JS ====================
// Complete services page with API integration + payment system

const MEMBERSHIP_API = 'https://zoo-planet-backend.onrender.com/api/memberships';
const EVENTS_API = 'https://zoo-planet-backend.onrender.com/api/events';
const TOURS_API = 'https://zoo-planet-backend.onrender.com/api/tours';

// ==================== PRICE CONFIGURATIONS ====================
const PRICES = {
    membership: {
        individual: 75,
        family: 150,
        premium: 250
    },
    events: {
        // Keys match your HTML onclick values
        'birthday': 299,
        'corporate': 999,
        'school': 199,
        'wedding': 2999
    },
    tours: {
        // Keys match your HTML onclick values
        'safari': 25,
        'behind-scenes': 45,
        'rainforest': 18,
        'twilight': 35
    }
};

// Event and Tour full names for display
const EVENT_NAMES = {
    'birthday': 'Birthday Party',
    'corporate': 'Corporate Event',
    'school': 'School Field Trip',
    'wedding': 'Wedding Reception'
};

const TOUR_NAMES = {
    'safari': 'Safari Adventure Tour',
    'behind-scenes': 'Behind-the-Scenes Experience',
    'rainforest': 'Tropical Rainforest Walk',
    'twilight': 'Twilight Safari'
};

const GST_RATE = 0.18; // 18% GST

// Global variables
let selectedMembershipPlan = '';
let membershipAmount = 0;
let selectedEventType = '';
let selectedEventKey = '';
let eventAmount = 0;
let selectedTourType = '';
let selectedTourKey = '';
let tourPricePerPerson = 0;

// ==================== CALCULATE PAYMENT SUMMARY ====================
// ==================== CALCULATE PAYMENT SUMMARY (IMPROVED) ====================
function updatePaymentSummary(baseAmount, prefix) {
    const tax = (baseAmount * GST_RATE).toFixed(2);
    const total = (parseFloat(baseAmount) + parseFloat(tax)).toFixed(2);
    
    // Use prefix to target correct modal's elements
    let baseAmountEl = document.getElementById(`${prefix}BaseAmount`);
    let taxAmountEl = document.getElementById(`${prefix}TaxAmount`);
    let totalAmountEl = document.getElementById(`${prefix}TotalAmount`);
    
    // Fallback for membership (no prefix)
    if (!baseAmountEl) {
        baseAmountEl = document.getElementById('baseAmount');
        taxAmountEl = document.getElementById('taxAmount');
        totalAmountEl = document.getElementById('totalAmount');
    }
    
    // Update elements if they exist
    if (baseAmountEl) {
        baseAmountEl.textContent = `₹${baseAmount}`;
        baseAmountEl.style.fontWeight = '600';
        baseAmountEl.style.color = '#fff';
    }
    
    if (taxAmountEl) {
        taxAmountEl.textContent = `₹${tax}`;
        taxAmountEl.style.fontWeight = '600';
        taxAmountEl.style.color = '#fff';
    }
    
    if (totalAmountEl) {
        totalAmountEl.textContent = `₹${total}`;
        totalAmountEl.style.fontWeight = '700';
        totalAmountEl.style.fontSize = '20px';
        totalAmountEl.style.color = '#fff';
    }
    
    console.log(`💰 Payment Summary Updated [${prefix || 'membership'}]: Base: ₹${baseAmount}, GST (18%): ₹${tax}, Total: ₹${total}`);
    
    // Make payment summary visible
    const paymentSummary = baseAmountEl?.closest('.payment-summary');
    if (paymentSummary) {
        paymentSummary.style.display = 'block';
        paymentSummary.style.animation = 'fadeIn 0.5s ease';
    }
    
    return parseFloat(total);
}

// ==================== SERVICE TABS FUNCTIONALITY ====================
document.querySelectorAll(".service-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".service-tab").forEach((t) => {
      t.classList.remove("active");
      t.style.transform = "";
      t.style.boxShadow = "";
    });

    this.classList.add("active");
    this.style.transform = "translateY(-5px)";
    this.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";

    document.querySelectorAll(".service-info").forEach((info) => {
      info.classList.remove("active");
    });

    const targetInfo = document.getElementById(`${this.dataset.tab}-info`);
    if (targetInfo) {
      targetInfo.classList.add("active");
      targetInfo.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ==================== MEMBERSHIP CARD HOVER EFFECT ====================
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

// ==================== ESC KEY HANDLER ====================
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.style.display = "none";
      modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
  }
});

// ==================== MEMBERSHIP MODAL FUNCTIONS ====================
function openMembershipModal(plan) {
  selectedMembershipPlan = plan;
  const modal = document.getElementById('membershipModal');
  if (!modal) return;
  
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
  const selectedPlanElement = document.getElementById('selectedPlan');
  if (selectedPlanElement) {
    selectedPlanElement.textContent = `${planName} Plan`;
  }
  
  // Get price from configuration
  membershipAmount = PRICES.membership[plan] || 0;
  console.log(`🎫 Opening Membership: ${plan} - ₹${membershipAmount}`);
  
  // Show/hide family members section
  const familySection = document.getElementById('familyMembersSection');
  if (familySection) {
    familySection.style.display = (plan === 'family' || plan === 'premium') ? 'block' : 'none';
  }
  
  modal.classList.add('show');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Update payment summary after modal opens
  setTimeout(() => {
    updatePaymentSummary(membershipAmount, 'membership');
  }, 100);
}

function closeMembershipModal() {
  const modal = document.getElementById('membershipModal');
  if (!modal) return;
  
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  const form = document.getElementById('membershipForm');
  if (form) form.reset();
  
  // Reset payment details
  document.querySelectorAll('[id$="-details"]').forEach(detail => {
    detail.classList.remove('active');
  });
}

// ==================== EVENT MODAL FUNCTIONS ====================
function openEventModal(eventKey) {
  selectedEventKey = eventKey;
  selectedEventType = EVENT_NAMES[eventKey] || eventKey;
  
  const modal = document.getElementById('eventModal');
  if (!modal) return;
  
  const selectedEventElement = document.getElementById('selectedEvent');
  if (selectedEventElement) {
    selectedEventElement.textContent = selectedEventType;
  }
  
  eventAmount = PRICES.events[eventKey] || 0;
  console.log(`🎉 Opening Event: ${selectedEventType} (${eventKey}) - ₹${eventAmount}`);
  
  modal.classList.add('show');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    updatePaymentSummary(eventAmount, 'event');  // ✅ Changed prefix
  }, 100);
}


function closeEventModal() {
  const modal = document.getElementById('eventModal');
  if (!modal) return;
  
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  const form = document.getElementById('eventForm');
  if (form) form.reset();
  
  // Reset payment details
  document.querySelectorAll('[id$="-details"]').forEach(detail => {
    detail.classList.remove('active');
  });
}

// ==================== TOUR MODAL FUNCTIONS ====================
function openTourModal(tourKey) {
  selectedTourKey = tourKey;
  selectedTourType = TOUR_NAMES[tourKey] || tourKey;
  
  const modal = document.getElementById('tourModal');
  if (!modal) return;
  
  const selectedTourElement = document.getElementById('selectedTour');
  if (selectedTourElement) {
    selectedTourElement.textContent = selectedTourType;
  }
  
  tourPricePerPerson = PRICES.tours[tourKey] || 0;
  console.log(`🦁 Opening Tour: ${selectedTourType} (${tourKey}) - ₹${tourPricePerPerson}/person`);
  
  modal.classList.add('show');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    updatePaymentSummary(tourPricePerPerson, 'tour');  // ✅ Changed prefix
  }, 100);
}


function closeTourModal() {
  const modal = document.getElementById('tourModal');
  if (!modal) return;
  
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  const form = document.getElementById('tourForm');
  if (form) form.reset();
  
  // Reset payment details
  document.querySelectorAll('[id$="-details"]').forEach(detail => {
    detail.classList.remove('active');
  });
}

// ==================== SERVICE NAVIGATION ====================
document.querySelectorAll('.service-nav-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.service-nav-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerOffset = 140;
      const elementPosition = targetSection.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Update active nav on scroll
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('.section[id]');
  const navButtons = document.querySelectorAll('.service-nav-btn');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('href') === `#${current}`) {
      btn.classList.add('active');
    }
  });
});

// ==================== SEASON TAB FUNCTIONALITY ====================
document.querySelectorAll('.season-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const season = this.getAttribute('data-season');
    
    document.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.season-content').forEach(c => c.classList.remove('active'));
    
    this.classList.add('active');
    const seasonContent = document.getElementById(season);
    if (seasonContent) {
      seasonContent.classList.add('active');
    }
  });
});

// ==================== CLOSE MODAL FUNCTIONALITY ====================
document.querySelectorAll(".close-modal").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    const modal = this.closest(".modal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  });
});

window.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    event.target.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function() {
    const modal = this.closest('.modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});

// ==================== PAYMENT METHOD TOGGLE ====================
function setupPaymentMethodToggle() {
    // For all payment method radios
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment details in this form
            const form = this.closest('form');
            if (form) {
                form.querySelectorAll('.payment-details').forEach(detail => {
                    detail.classList.remove('active');
                });
                
                // Show selected payment details
                const selectedMethod = this.value;
                const detailsSection = form.querySelector(`#${selectedMethod}-details`);
                if (detailsSection) {
                    detailsSection.classList.add('active');
                    console.log(`💳 Payment method selected: ${selectedMethod}`);
                }
            }
        });
    });
}

// ==================== CARD FORMATTING ====================
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

function formatCardExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// Apply card formatting
function setupCardFormatting() {
    document.querySelectorAll('input[id*="cardNumber"]').forEach(input => {
        input.addEventListener('input', function() {
            formatCardNumber(this);
        });
    });

    document.querySelectorAll('input[id*="cardExpiry"]').forEach(input => {
        input.addEventListener('input', function() {
            formatCardExpiry(this);
        });
    });

    document.querySelectorAll('input[id*="cardCvv"]').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 3);
        });
    });
}

// ==================== UPI & WALLET SELECTION ====================
function setupUpiAndWalletSelection() {
    document.querySelectorAll('.upi-app').forEach(app => {
        app.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.upi-app').forEach(a => {
                a.style.border = '2px solid transparent';
                a.style.background = '';
            });
            
            this.style.border = '2px solid var(--primary-color)';
            this.style.background = 'rgba(45, 134, 89, 0.1)';
        });
    });

    document.querySelectorAll('.wallet-option').forEach(wallet => {
        wallet.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.wallet-option').forEach(w => {
                w.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
}

// ==================== REAL-TIME QUANTITY UPDATE ====================
function setupQuantityUpdates() {
    // Event guests update
    const eventGuestsInputs = document.querySelectorAll('#eventForm input[name="guests"]');
    eventGuestsInputs.forEach(input => {
        input.addEventListener('input', function() {
            const guests = parseInt(this.value) || 1;
            const totalAmount = eventAmount * guests;
            updatePaymentSummary(totalAmount, 'event');  // ✅ Added prefix
        });
    });

    // Tour participants update
    const tourParticipantsInputs = document.querySelectorAll('#tourForm input[name="participants"]');
    tourParticipantsInputs.forEach(input => {
        input.addEventListener('input', function() {
            const participants = parseInt(this.value) || 1;
            const totalAmount = tourPricePerPerson * participants;
            updatePaymentSummary(totalAmount, 'tour');  // ✅ Added prefix
        });
    });
}


// ==================== MEMBERSHIP FORM SUBMISSION ====================
const membershipForm = document.getElementById("membershipForm");
if (membershipForm) {
  membershipForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check payment method
    const paymentMethod = this.querySelector('input[name="paymentMethod"]:checked');
    
    if (!paymentMethod) {
        alert('❌ Please select a payment method');
        return;
    }

    const termsCheckbox = this.querySelector('input[type="checkbox"][name="terms"]');
    if (!termsCheckbox || !termsCheckbox.checked) {
      alert("❌ You must accept Terms & Conditions");
      return;
    }

    // Calculate final amount
    const finalAmount = membershipAmount + (membershipAmount * GST_RATE);

    const formData = {
      membershipPlan: selectedMembershipPlan,
      price: membershipAmount,
      totalAmount: parseFloat(finalAmount.toFixed(2)),
      firstName: this.querySelector('input[name="firstName"]')?.value,
      lastName: this.querySelector('input[name="lastName"]')?.value,
      email: this.querySelector('input[name="email"]')?.value,
      phone: this.querySelector('input[name="phone"]')?.value,
      address: this.querySelector('input[name="address"]')?.value,
      city: this.querySelector('input[name="city"]')?.value,
      zipCode: this.querySelector('input[name="zip"]')?.value,
      paymentMethod: paymentMethod.value,
      termsAccepted: true
    };

    try {
      console.log('📤 Submitting membership:', formData);
      
      const res = await fetch(MEMBERSHIP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Membership failed");

      closeMembershipModal();
      alert(`✅ Payment Successful!\n\nMembership: ${selectedMembershipPlan}\nAmount Paid: ₹${finalAmount.toFixed(2)}\nReference: ${data.membershipId || 'Confirmed'}\n\nConfirmation sent to your email!`);
      this.reset();

    } catch (err) {
      console.error('❌ Membership error:', err);
      alert('❌ ' + err.message);
    }
  });
}

// ==================== EVENT FORM SUBMISSION ====================
// ==================== EVENT FORM SUBMISSION WITH DEBUG ====================
const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log('🔍 Form submission started');

    // Check payment method
    const paymentMethod = eventForm.querySelector('input[name="paymentMethod"]:checked');
    
    if (!paymentMethod) {
        alert('❌ Please select a payment method');
        return;
    }

    const termsCheckbox = eventForm.querySelector('input[type="checkbox"][name="terms"]');
    if (!termsCheckbox || !termsCheckbox.checked) {
      alert("❌ You must accept Terms & Conditions");
      return;
    }

    // Get all form values
    const guests = parseInt(eventForm.querySelector('input[name="guests"]')?.value) || 1;
    const baseAmount = eventAmount * guests;
    const finalAmount = baseAmount + (baseAmount * GST_RATE);

    const formData = {
      eventName: selectedEventType,
      eventType: selectedEventKey,
      eventDate: eventForm.querySelector('input[name="eventDate"]')?.value,
      preferredTime: eventForm.querySelector('select[name="eventTime"]')?.value,
      guests: guests,
      contactName: eventForm.querySelector('input[name="contactName"]')?.value,
      email: eventForm.querySelector('input[name="email"]')?.value,
      phone: eventForm.querySelector('input[name="phone"]')?.value,
      specialRequests: eventForm.querySelector('textarea[name="specialRequests"]')?.value || '',
      baseAmount: eventAmount,
      totalAmount: parseFloat(finalAmount.toFixed(2)),
      paymentMethod: paymentMethod.value,
      termsAccepted: true
    };

    // ✅ DETAILED DEBUG LOGGING
    console.log('📋 Form Data Being Sent:');
    console.log('─────────────────────────────────');
    Object.entries(formData).forEach(([key, value]) => {
      const type = typeof value;
      const isEmpty = !value || value === '' || value === 0;
      console.log(`${key}: ${JSON.stringify(value)} [${type}] ${isEmpty ? '❌ EMPTY' : '✅'}`);
    });
    console.log('─────────────────────────────────');

    // Check for empty required fields
    const requiredFields = [
      'eventName', 'eventType', 'eventDate', 'preferredTime', 
      'guests', 'contactName', 'email', 'phone', 'paymentMethod'
    ];
    
    const emptyFields = requiredFields.filter(field => !formData[field] || formData[field] === '');
    
    if (emptyFields.length > 0) {
      console.error('❌ Empty required fields:', emptyFields);
      alert(`❌ Please fill in the following fields:\n${emptyFields.join(', ')}`);
      return;
    }

    console.log('✅ All required fields present, sending to backend...');

    try {
      console.log(`📤 Sending POST request to ${EVENTS_API}`);
      
      const res = await fetch(EVENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', res.status);

      const data = await res.json();
      console.log('📥 Response data:', data);
      
      if (!res.ok) {
        console.error('❌ Backend error response:', data);
        throw new Error(data.error || data.message || "Booking failed");
      }

      closeEventModal();
      alert(`✅ Payment Successful!\n\nEvent: ${selectedEventType}\nGuests: ${guests}\nAmount Paid: ₹${finalAmount.toFixed(2)}\nReference: ${data.booking?.bookingReference || 'Confirmed'}\n\nConfirmation sent to your email!`);
      eventForm.reset();
      
    } catch (err) {
      console.error('❌ Event error:', err);
      alert('❌ ' + err.message);
    }
  });
}


// ==================== TOUR FORM SUBMISSION ====================
const tourForm = document.getElementById('tourForm');
if (tourForm) {
    tourForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check payment method
        const paymentMethod = this.querySelector('input[name="paymentMethod"]:checked');
        
        if (!paymentMethod) {
            alert('❌ Please select a payment method');
            return;
        }
        
        const termsCheckbox = this.querySelector('input[type="checkbox"][name="terms"]');
        if (!termsCheckbox || !termsCheckbox.checked) {
          alert("❌ You must accept Terms & Conditions");
          return;
        }
        
        const participants = parseInt(this.querySelector('input[name="participants"]')?.value) || 1;
        const baseAmount = tourPricePerPerson * participants;
        const finalAmount = baseAmount + (baseAmount * GST_RATE);
        
        const formData = {
            tourName: selectedTourType,
            tourDate: this.querySelector('input[name="tourDate"]')?.value,
            tourTime: this.querySelector('select[name="tourTime"]')?.value,
            participants: participants,
            fullName: this.querySelector('input[name="fullName"]')?.value,
            email: this.querySelector('input[name="email"]')?.value,
            phone: this.querySelector('input[name="phone"]')?.value,
            language: this.querySelector('select[name="language"]')?.value,
            pricePerPerson: tourPricePerPerson,
            totalAmount: parseFloat(finalAmount.toFixed(2)),
            paymentMethod: paymentMethod.value,
            termsAccepted: true
        };
        
        try {
            console.log('📤 Submitting tour booking:', formData);
            
            const res = await fetch(TOURS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Tour booking failed');
            
            closeTourModal();
            alert(`✅ Payment Successful!\n\nTour: ${selectedTourType}\nParticipants: ${participants}\nAmount Paid: ₹${finalAmount.toFixed(2)}\nReference: ${data.booking?.bookingReference || 'Confirmed'}\n\nConfirmation sent to your email!`);
            this.reset();
            
        } catch (err) {
            console.error('❌ Tour error:', err);
            alert('❌ ' + err.message);
        }
    });
}

// ==================== SET MINIMUM DATE ====================
const today = new Date().toISOString().split("T")[0];
document.querySelectorAll('input[type="date"]').forEach(input => {
    input.setAttribute('min', today);
});

// ==================== ANIMATION ON SCROLL ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.membership-card, .event-card, .tour-card, .hours-card, .accessibility-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// ==================== INITIALIZE ON DOM LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // Setup all payment features
    setupPaymentMethodToggle();
    setupCardFormatting();
    setupUpiAndWalletSelection();
    setupQuantityUpdates();
    
    console.log('✅ All payment features initialized!');
});

// ==================== CONSOLE LOG ====================
console.log('%c🦁 Zoo Planet Services Loaded!', 'color: #2d8659; font-size: 16px; font-weight: bold;');
console.log('%c💳 Payment System Active', 'color: #2d8659; font-size: 14px; font-weight: bold;');
console.log('%c✅ Features: Pre-set prices | GST calculation | Payment methods | Real-time updates', 'color: #666;');
console.log('%cBackend API: http://localhost:4000', 'color: #666; font-weight: bold;');