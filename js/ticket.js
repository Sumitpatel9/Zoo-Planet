// // Set minimum date to today
// document.getElementById('visit-date').min = new Date().toISOString().split('T')[0];

// // Ticket prices
// const ticketPrices = {
//     adult: 24.99,
//     child: 14.99,
//     senior: 19.99,
//     family: 69.99,
//     student: 18.99,
//     group: 12.99
// };

// let selectedTickets = {};

// // Age validation function
// function calculateAge(birthDate) {
//     const today = new Date();
//     const birth = new Date(birthDate);
//     let age = today.getFullYear() - birth.getFullYear();
//     const monthDiff = today.getMonth() - birth.getMonth();

//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//         age--;
//     }

//     return age;
// }

// // Validate ticket eligibility
// function validateTicketEligibility() {
//     const birthDate = document.getElementById('birth-date')?.value;
//     const studentId = document.getElementById('student-id')?.value;

//     let errors = [];

//     // Check child tickets
//     if (selectedTickets.child > 0) {
//         if (!birthDate) {
//             errors.push('Birth date is required for child tickets.');
//         } else {
//             const age = calculateAge(birthDate);
//             if (age >= 18) {
//                 errors.push('Child tickets are only valid for visitors under 18 years old.');
//             }
//         }
//     }

//     // Check senior tickets
//     if (selectedTickets.senior > 0) {
//         if (!birthDate) {
//             errors.push('Birth date is required for senior tickets.');
//         } else {
//             const age = calculateAge(birthDate);
//             if (age < 60) {
//                 errors.push('Senior tickets are only valid for visitors 60 years and older.');
//             }
//         }
//     }

//     // Check student tickets
//     if (selectedTickets.student > 0) {
//         if (!studentId || studentId.trim() === '') {
//             errors.push('Valid student ID is required for student tickets.');
//         }
//         if (!birthDate) {
//             errors.push('Birth date is required for student tickets.');
//         } else {
//             const age = calculateAge(birthDate);
//             if (age < 16 || age > 30) {
//                 errors.push('Student tickets are valid for ages 16-30 with valid student ID.');
//             }
//         }
//     }

//     return errors;
// }

// // Validate payment method details
// function validatePaymentMethod() {
//     const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
//     let errors = [];

//     if (!paymentMethod) {
//         errors.push('Please select a payment method.');
//         return errors;
//     }

//     switch (paymentMethod) {
//         case 'credit':
//             const cardNumber = document.getElementById('card-number')?.value?.replace(/\s/g, '');
//             const expiryDate = document.getElementById('expiry')?.value;
//             const cvv = document.getElementById('cvv')?.value;
//             const cardName = document.getElementById('card-name')?.value;

//             if (!cardNumber || cardNumber.length < 16) {
//                 errors.push('Please enter a valid 16-digit card number.');
//             }
//             if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
//                 errors.push('Please enter a valid expiry date (MM/YY).');
//             }
//             //  else {
//             //     // Check if card is not expired
//             //     const [month, year] = expiryDate.split('/');
//             //     const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
//             //     const today = new Date();
//             //     if (expiry < today) {
//             //         errors.push('Card has expired. Please use a valid card.');
//             //     }
//             // }
//             if (!cvv || cvv.length < 3) {
//                 errors.push('Please enter a valid CVV (3-4 digits).');
//             }
//             // if (!cardName || cardName.trim() === '') {
//             //     errors.push('Please enter the cardholder name.');
//             // }
//             break;

//         case 'upi':
//             const upiMethod = document.querySelector('input[name="upi-method"]:checked')?.value;
//             if (!upiMethod) {
//                 errors.push('Please select UPI payment method (QR or UPI ID).');
//             } else if (upiMethod === 'id') {
//                 const upiId = document.getElementById('upi-id')?.value;
//                 if (!upiId || !upiId.includes('@')) {
//                     errors.push('Please enter a valid UPI ID (e.g., user@paytm).');
//                 }
//             }
//             break;

//         case 'paypal':
//             const paypalEmail = document.getElementById('paypal-email')?.value;
//             // if (!paypalEmail || !paypalEmail.includes('@')) {
//             //     errors.push('Please enter a valid PayPal email address.');
//             // }
//             break;
//     }

//     return errors;
// }

// // Show/hide additional fields based on selected tickets
// function toggleAdditionalFields() {
//     const needsBirthDate = selectedTickets.child > 0 || selectedTickets.senior > 0 || selectedTickets.student > 0;
//     const needsStudentId = selectedTickets.student > 0;

//     // Create birth date field if it doesn't exist
//     let birthDateField = document.getElementById('birth-date-field');
//     if (!birthDateField && needsBirthDate) {
//         createBirthDateField();
//         birthDateField = document.getElementById('birth-date-field');
//     }

//     // Create student ID field if it doesn't exist
//     let studentIdField = document.getElementById('student-id-field');
//     if (!studentIdField && needsStudentId) {
//         createStudentIdField();
//         studentIdField = document.getElementById('student-id-field');
//     }

//     // Show/hide birth date field
//     if (birthDateField) {
//         birthDateField.style.display = needsBirthDate ? 'block' : 'none';
//         const birthDateInput = document.getElementById('birth-date');
//         if (birthDateInput) {
//             birthDateInput.required = needsBirthDate;
//         }
//     }

//     // Show/hide student ID field
//     if (studentIdField) {
//         studentIdField.style.display = needsStudentId ? 'block' : 'none';
//         const studentIdInput = document.getElementById('student-id');
//         if (studentIdInput) {
//             studentIdInput.required = needsStudentId;
//         }
//     }
// }

// // Create birth date field dynamically
// function createBirthDateField() {
//     const form = document.getElementById('ticket-form');
//     const phoneField = document.getElementById('phone').parentNode;

//     const birthDateDiv = document.createElement('div');
//     birthDateDiv.className = 'form-group';
//     birthDateDiv.id = 'birth-date-field';
//     birthDateDiv.style.display = 'none';

//     birthDateDiv.innerHTML = `
//         <label for="birth-date">
//             <i class="fas fa-birthday-cake"></i>
//             Birth Date <span class="required">*</span>
//             <small>(Required for Child/Senior/Student tickets)</small>
//         </label>
//         <input type="date" id="birth-date" name="birth-date" max="${new Date().toISOString().split('T')[0]}">
//     `;

//     // Insert after phone field
//     phoneField.insertAdjacentElement('afterend', birthDateDiv);
// }

// // Create student ID field dynamically
// function createStudentIdField() {
//     const form = document.getElementById('ticket-form');
//     const birthDateField = document.getElementById('birth-date-field');
//     const insertAfter = birthDateField || document.getElementById('phone').parentNode;

//     const studentIdDiv = document.createElement('div');
//     studentIdDiv.className = 'form-group';
//     studentIdDiv.id = 'student-id-field';
//     studentIdDiv.style.display = 'none';

//     studentIdDiv.innerHTML = `
//         <label for="student-id">
//             <i class="fas fa-id-card"></i>
//             Student ID <span class="required">*</span>
//             <small>(Required for Student tickets)</small>
//         </label>
//         <input type="text" id="student-id" name="student-id" placeholder="Enter your valid student ID" maxlength="20">
//     `;

//     // Insert after birth date field or phone field
//     insertAfter.insertAdjacentElement('afterend', studentIdDiv);
// }

// // Ticket selection functionality
// document.querySelectorAll('.select-ticket').forEach(btn => {
//     btn.addEventListener('click', function () {
//         const type = this.dataset.type;

//         if (selectedTickets[type]) {
//             selectedTickets[type]++;
//         } else {
//             selectedTickets[type] = 1;
//         }

//         updateTicketSelection();
//         toggleAdditionalFields();

//         // Animate the selected ticket card
//         const card = this.closest('.ticket-card');
//         card.style.transform = 'scale(1.05)';
//         setTimeout(() => {
//             card.style.transform = '';
//         }, 300);
//     });
// });

// function updateTicketSelection() {
//     const container = document.getElementById('selected-tickets');
//     container.innerHTML = '';

//     let total = 0;

//     for (const [type, quantity] of Object.entries(selectedTickets)) {
//         const price = ticketPrices[type];
//         const subtotal = price * quantity;
//         total += subtotal;

//         const ticketDiv = document.createElement('div');
//         ticketDiv.className = 'selected-ticket';
//         ticketDiv.innerHTML = `
//             <div>
//                 <span>${type.charAt(0).toUpperCase() + type.slice(1)} x${quantity}</span>
//                 <div class="ticket-actions">
//                     <button class="remove-ticket" data-type="${type}" title="Remove one">
//                         <i class="fas fa-minus-circle"></i>
//                     </button>
//                     <button class="discard-ticket" data-type="${type}" title="Discard all">
//                         <i class="fas fa-trash-alt"></i>
//                     </button>
//                 </div>
//             </div>
//             <span>₹${subtotal.toFixed(2)}</span>
//         `;

//         container.appendChild(ticketDiv);
//     }

//     // Add event listeners to remove buttons
//     document.querySelectorAll('.remove-ticket').forEach(btn => {
//         btn.addEventListener('click', function () {
//             const type = this.dataset.type;

//             if (selectedTickets[type] > 1) {
//                 selectedTickets[type]--;
//             } else {
//                 delete selectedTickets[type];
//             }

//             updateTicketSelection();
//             toggleAdditionalFields();
//         });
//     });

//     // Add event listeners to discard buttons
//     document.querySelectorAll('.discard-ticket').forEach(btn => {
//         btn.addEventListener('click', function () {
//             const type = this.dataset.type;
//             delete selectedTickets[type];
//             updateTicketSelection();
//             toggleAdditionalFields();
//         });
//     });

//     document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;

//     // Add "Clear All" button if there are tickets
//     if (Object.keys(selectedTickets).length > 0) {
//         const clearAllDiv = document.createElement('div');
//         clearAllDiv.className = 'clear-all';
//         clearAllDiv.innerHTML = `
//             <button class="btn clear-all-btn">
//                 <i class="fas fa-times-circle"></i> Discard All Tickets
//             </button>
//         `;
//         container.appendChild(clearAllDiv);

//         document.querySelector('.clear-all-btn').addEventListener('click', function () {
//             selectedTickets = {};
//             updateTicketSelection();
//             toggleAdditionalFields();
//         });
//     }
// }

// // Payment method selection
// document.querySelectorAll('input[name="payment"]').forEach(radio => {
//     radio.addEventListener('change', function () {
//         // Hide all payment details
//         document.querySelectorAll('.payment-details').forEach(detail => {
//             detail.classList.remove('active');
//         });

//         // Show selected payment details
//         document.getElementById(`${this.value}-details`).classList.add('active');
//     });
// });

// // UPI method selection
// document.querySelectorAll('input[name="upi-method"]').forEach(radio => {
//     radio.addEventListener('change', function () {
//         document.querySelector('.upi-qr').classList.toggle('active', this.value === 'qr');
//         document.querySelector('.upi-id').classList.toggle('active', this.value === 'id');
//     });
// });

// // Format card number input
// document.getElementById('card-number')?.addEventListener('input', function (e) {
//     let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
//     this.value = value.replace(/(\d{4})/g, '$1 ').trim();

//     // Limit to 16 digits
//     if (value.length > 16) {
//         this.value = this.value.substring(0, 19); // 16 digits + 3 spaces
//     }
// });

// // Format expiry date input
// document.getElementById('expiry')?.addEventListener('input', function (e) {
//     let value = this.value.replace(/\D/g, '');
//     if (value.length >= 2) {
//         value = value.substring(0, 2) + '/' + value.substring(2, 4);
//     }
//     this.value = value;
// });

// // Validate CVV input
// document.getElementById('cvv')?.addEventListener('input', function (e) {
//     this.value = this.value.replace(/\D/g, '').substring(0, 4);
// });

// // Validate UPI ID format
// document.getElementById('upi-id')?.addEventListener('input', function (e) {
//     const value = this.value.toLowerCase();
//     this.value = value;
// });

// // Generate a random booking reference
// function generateBookingReference() {
//     const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
//     const numbers = '0123456789';
//     let ref = 'WAZ-';

//     // Add 3 random letters
//     for (let i = 0; i < 3; i++) {
//         ref += letters.charAt(Math.floor(Math.random() * letters.length));
//     }

//     // Add 4 random numbers
//     for (let i = 0; i < 4; i++) {
//         ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
//     }

//     return ref;
// }

// // Format date for display
// function formatDisplayDate(dateString) {
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
// }

// // Show confirmation modal with all details
// function showConfirmationModal(formData) {
//     const modal = document.getElementById('confirmation-modal');
//     const today = new Date().toISOString().split('T')[0];

//     // Set booking reference
//     document.getElementById('booking-reference').textContent = generateBookingReference();

//     // Set visitor info
//     document.getElementById('conf-name').textContent = formData.name;
//     document.getElementById('conf-email').textContent = formData.email;
//     document.getElementById('conf-phone').textContent = formData.phone;

//     // Set visit info
//     document.getElementById('conf-visit-date').textContent = formatDisplayDate(formData.visitDate);
//     document.getElementById('conf-booking-date').textContent = formatDisplayDate(today);
//     document.getElementById('conf-payment-method').textContent =
//         formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1);

//     // Set ticket items
//     const ticketItemsContainer = document.getElementById('conf-ticket-items');
//     ticketItemsContainer.innerHTML = '';

//     let total = 0;
//     for (const [type, quantity] of Object.entries(selectedTickets)) {
//         const price = ticketPrices[type];
//         const subtotal = price * quantity;
//         total += subtotal;

//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
//             <td>${quantity}</td>
//             <td>₹${price.toFixed(2)}</td>
//             <td>₹${subtotal.toFixed(2)}</td>
//         `;
//         ticketItemsContainer.appendChild(row);
//     }

//     // Set total amount
//     document.getElementById('conf-total-amount').textContent = `₹${total.toFixed(2)}`;

//     // Generate QR code (using a simple API for demo purposes)
//     const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
//         `Booking Ref: ${document.getElementById('booking-reference').textContent}\n` +
//         `Name: ${formData.name}\n` +
//         `Date: ${formData.visitDate}\n` +
//         `Tickets: ${Object.keys(selectedTickets).length} types, ${Object.values(selectedTickets).reduce((a, b) => a + b, 0)} total`
//     )}`;

//     document.getElementById('ticket-qr-code').innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;

//     // Show modal
//     modal.style.display = 'flex';
//     document.body.style.overflow = 'hidden';
// }

// // Close modal
// function closeConfirmationModal() {
//     const modal = document.getElementById('confirmation-modal');
//     modal.style.display = 'none';
//     document.body.style.overflow = 'auto';
// }

// // Download ticket as PNG
// function downloadTicket() {
//     // In a real implementation, you would use a library like html2canvas
//     alert('In a real implementation, this would download the ticket as a PNG image.');
// }

// // Print ticket
// function printTicket() {
//     window.print();
// }

// // Event listeners for modal buttons
// document.addEventListener('DOMContentLoaded', function() {
//     // Close modal when clicking X, close button, or outside modal
//     document.querySelector('.close-modal')?.addEventListener('click', closeConfirmationModal);
//     document.querySelector('.close-btn')?.addEventListener('click', closeConfirmationModal);
//     document.getElementById('confirmation-modal')?.addEventListener('click', function(e) {
//         if (e.target === this) {
//             closeConfirmationModal();
//         }
//     });

//     // Download and print buttons
//     document.querySelector('.download-ticket')?.addEventListener('click', downloadTicket);
//     document.querySelector('.print-ticket')?.addEventListener('click', printTicket);

//     // Initialize the form - ensure dynamic fields are ready
//     console.log('Form initialized - dynamic fields will appear when tickets are selected');
// });

// // Enhanced form submission with comprehensive validation
// document.getElementById('ticket-form').addEventListener('submit', function (e) {
//     e.preventDefault();

//     const name = document.getElementById('full-name').value;
//     const email = document.getElementById('email').value;
//     const phone = document.getElementById('phone').value;
//     const visitDate = document.getElementById('visit-date').value;
//     const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

//     // Basic validations
//     if (Object.keys(selectedTickets).length === 0) {
//         alert('Please select at least one ticket type.');
//         return;
//     }

//     // Validate ticket eligibility (age/student ID)
//     const eligibilityErrors = validateTicketEligibility();
//     if (eligibilityErrors.length > 0) {
//         alert('Ticket Validation Errors:\n\n' + eligibilityErrors.join('\n'));
//         return;
//     }

//     // Validate payment method details
//     const paymentErrors = validatePaymentMethod();
//     if (paymentErrors.length > 0) {
//         alert('Payment Validation Errors:\n\n' + paymentErrors.join('\n'));
//         return;
//     }

//     // If all validations pass, show confirmation modal
//     showConfirmationModal({
//         name,
//         email,
//         phone,
//         visitDate,
//         paymentMethod
//     });
// });

////----------------------------------------------------------------
////----------------------------------------------------------------
////----------------------------------------------------------------
////----------------------------------------------------------------
/// ticket.js - FIXED: backend integration + robust modal FINAL CODE
////----------------------------------------------------------------
////----------------------------------------------------------------
////----------------------------------------------------------------
////----------------------------------------------------------------

const API_BASE = "http://localhost:4000"; // change to your backend URL when deployed

// Set minimum visit date to today
const visitDateInput = document.getElementById("visit-date");
if (visitDateInput) {
  visitDateInput.min = new Date().toISOString().split("T")[0];
}

// Stores price for each ticket type
const ticketPrices = {
  adult: 24.99,
  child: 14.99,
  senior: 19.99,
  family: 69.99,
  student: 18.99,
  group: 12.99,
};

//This object stores user selection
/*{
  adult: 2,
  child: 1
}*/
let selectedTickets = {};

// Utility / Validation Helpers
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function validateTicketEligibility() {
  const birthDate = document.getElementById("birth-date")?.value;
  const studentId = document.getElementById("student-id")?.value;
  let errors = [];

  if (selectedTickets.child > 0) {
    if (!birthDate) {
      errors.push("Birth date is required for child tickets.");
    } else {
      const age = calculateAge(birthDate);
      if (age >= 18)
        errors.push(
          "Child tickets are only valid for visitors under 18 years old."
        );
    }
  }

  if (selectedTickets.senior > 0) {
    if (!birthDate) {
      errors.push("Birth date is required for senior tickets.");
    } else {
      const age = calculateAge(birthDate);
      if (age < 60)
        errors.push(
          "Senior tickets are only valid for visitors 60 years and older."
        );
    }
  }

  if (selectedTickets.student > 0) {
    if (!studentId || studentId.trim() === "")
      errors.push("Valid student ID is required for student tickets.");
    if (!birthDate) {
      errors.push("Birth date is required for student tickets.");
    } else {
      const age = calculateAge(birthDate);
      if (age < 16 || age > 30)
        errors.push(
          "Student tickets are valid for ages 16-30 with valid student ID."
        );
    }
  }

  return errors;
}

function validatePaymentMethod() {
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  )?.value;
  let errors = [];
  if (!paymentMethod) {
    errors.push("Please select a payment method.");
    return errors;
  }

  switch (paymentMethod) {
    case "credit": {
      const cardNumber = document
        .getElementById("card-number")
        ?.value?.replace(/\s/g, "");
      const expiryDate = document.getElementById("expiry")?.value;
      const cvv = document.getElementById("cvv")?.value;
      if (!cardNumber || cardNumber.length < 16)
        errors.push("Please enter a valid 16-digit card number.");
      if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/))
        errors.push("Please enter a valid expiry date (MM/YY).");
      if (!cvv || cvv.length < 3)
        errors.push("Please enter a valid CVV (3-4 digits).");
      break;
    }
    case "upi": {
      const upiMethod = document.querySelector(
        'input[name="upi-method"]:checked'
      )?.value;
      if (!upiMethod) {
        errors.push("Please select UPI payment method (QR or UPI ID).");
      } else if (upiMethod === "id") {
        const upiId = document.getElementById("upi-id")?.value;
        if (!upiId || !upiId.includes("@"))
          errors.push("Please enter a valid UPI ID (e.g., user@bank).");
      }
      break;
    }
    case "paypal":
      // optional
      break;
    case "cash":
      break;
    default:
      break;
  }

  return errors;
}

// Dynamic fields for birth/student
function toggleAdditionalFields() {
  const needsBirthDate =
    selectedTickets.child > 0 ||
    selectedTickets.senior > 0 ||
    selectedTickets.student > 0;
  const needsStudentId = selectedTickets.student > 0;

  let birthDateField = document.getElementById("birth-date-field");
  if (!birthDateField && needsBirthDate) createBirthDateField();

  let studentIdField = document.getElementById("student-id-field");
  if (!studentIdField && needsStudentId) createStudentIdField();

  birthDateField = document.getElementById("birth-date-field");
  studentIdField = document.getElementById("student-id-field");

  if (birthDateField) {
    birthDateField.style.display = needsBirthDate ? "block" : "none";
    const birthDateInput = document.getElementById("birth-date");
    if (birthDateInput) birthDateInput.required = needsBirthDate;
  }
  if (studentIdField) {
    studentIdField.style.display = needsStudentId ? "block" : "none";
    const studentIdInput = document.getElementById("student-id");
    if (studentIdInput) studentIdInput.required = needsStudentId;
  }
}

function createBirthDateField() {
  const phoneField = document.getElementById("phone")?.parentNode;
  if (!phoneField) return;

  const birthDateDiv = document.createElement("div");
  birthDateDiv.className = "form-group";
  birthDateDiv.id = "birth-date-field";
  birthDateDiv.style.display = "none";
  birthDateDiv.innerHTML = `
    <label for="birth-date">
      <i class="fas fa-birthday-cake"></i>
      Birth Date <span class="required">*</span>
      <small>(Required for Child/Senior/Student tickets)</small>
    </label>
    <input type="date" id="birth-date" name="birth-date" max="${
      new Date().toISOString().split("T")[0]
    }">
  `;
  phoneField.insertAdjacentElement("afterend", birthDateDiv);
}

function createStudentIdField() {
  const birthDateField = document.getElementById("birth-date-field");
  const insertAfter =
    birthDateField || document.getElementById("phone")?.parentNode;
  if (!insertAfter) return;

  const studentIdDiv = document.createElement("div");
  studentIdDiv.className = "form-group";
  studentIdDiv.id = "student-id-field";
  studentIdDiv.style.display = "none";
  studentIdDiv.innerHTML = `
    <label for="student-id">
      <i class="fas fa-id-card"></i>
      Student ID <span class="required">*</span>
      <small>(Required for Student tickets)</small>
    </label>
    <input type="text" id="student-id" name="student-id" placeholder="Enter your valid student ID" maxlength="20">
  `;
  insertAfter.insertAdjacentElement("afterend", studentIdDiv);
}

// Ticket selection UI logic
document.querySelectorAll(".select-ticket").forEach((btn) => {
  btn.addEventListener("click", function () {
    const type = this.dataset.type;
    if (selectedTickets[type]) selectedTickets[type]++;
    else selectedTickets[type] = 1;
    updateTicketSelection();
    toggleAdditionalFields();

    const card = this.closest(".ticket-card");
    if (card) {
      card.style.transform = "scale(1.05)";
      setTimeout(() => (card.style.transform = ""), 300);
    }
  });
});

function updateTicketSelection() {
  const container = document.getElementById("selected-tickets");
  if (!container) return;
  container.innerHTML = "";

  let total = 0;
  for (const [type, quantity] of Object.entries(selectedTickets)) {
    const price = ticketPrices[type] || 0;
    const subtotal = price * quantity;
    total += subtotal;

    const ticketDiv = document.createElement("div");
    ticketDiv.className = "selected-ticket";
    ticketDiv.innerHTML = `
      <div>
        <span>${
          type.charAt(0).toUpperCase() + type.slice(1)
        } x${quantity}</span>
        <div class="ticket-actions">
          <button class="remove-ticket" data-type="${type}" title="Remove one">
            <i class="fas fa-minus-circle"></i>
          </button>
          <button class="discard-ticket" data-type="${type}" title="Discard all">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <span>₹${subtotal.toFixed(2)}</span>
    `;
    container.appendChild(ticketDiv);
  }

  // remove / discard actions
  container.querySelectorAll(".remove-ticket").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.dataset.type;
      if (selectedTickets[type] > 1) selectedTickets[type]--;
      else delete selectedTickets[type];
      updateTicketSelection();
      toggleAdditionalFields();
    });
  });
  container.querySelectorAll(".discard-ticket").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.dataset.type;
      delete selectedTickets[type];
      updateTicketSelection();
      toggleAdditionalFields();
    });
  });

  if (Object.keys(selectedTickets).length > 0) {
    const clearAllDiv = document.createElement("div");
    clearAllDiv.className = "clear-all";
    clearAllDiv.innerHTML = `
      <button class="btn clear-all-btn">
        <i class="fas fa-times-circle"></i> Discard All Tickets
      </button>
    `;
    container.appendChild(clearAllDiv);
    document
      .querySelector(".clear-all-btn")
      ?.addEventListener("click", function () {
        selectedTickets = {};
        updateTicketSelection();
        toggleAdditionalFields();
      });
  }

  const totalEl = document.getElementById("total-amount");
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

// Payment UI handlers
document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    document
      .querySelectorAll(".payment-details")
      .forEach((detail) => detail.classList.remove("active"));
    const el = document.getElementById(`${this.value}-details`);
    if (el) el.classList.add("active");
  });
});

// UPI method toggles
document.querySelectorAll('input[name="upi-method"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    document
      .querySelector(".upi-qr")
      ?.classList.toggle("active", this.value === "qr");
    document
      .querySelector(".upi-id")
      ?.classList.toggle("active", this.value === "id");
  });
});

// Card formatting
document.getElementById("card-number")?.addEventListener("input", function () {
  let value = this.value.replace(/\s/g, "").replace(/\D/g, "");
  this.value = value.replace(/(\d{4})/g, "₹1 ").trim();
  if (value.length > 16) this.value = this.value.substring(0, 19);
});

document.getElementById("expiry")?.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");
  if (value.length >= 2)
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  this.value = value;
});

document.getElementById("cvv")?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").substring(0, 4);
});

document.getElementById("upi-id")?.addEventListener("input", function () {
  this.value = this.value.toLowerCase();
});

// UI: booking ref, modal, QR, download/print
function generateBookingReference() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "0123456789";
  let ref = "WAZ-";
  for (let i = 0; i < 3; i++)
    ref += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 4; i++)
    ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return ref;
}

function formatDisplayDate(dateString) {
  try {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  } catch {
    return dateString;
  }
}

// ================= CONFIRMATION MODAL =================
function showConfirmationModal(formData, bookingRef, createdAt, totalAmount) {
  const modal = document.getElementById("confirmation-modal");
  if (!modal) return;

  document.getElementById("booking-reference").textContent = bookingRef;

  document.getElementById("conf-name").textContent = formData.name;
  document.getElementById("conf-email").textContent = formData.email;
  document.getElementById("conf-phone").textContent = formData.phone;

  document.getElementById("conf-visit-date").textContent = formatDisplayDate(
    formData.visitDate
  );

  document.getElementById("conf-booking-date").textContent =
    formatDisplayDate(createdAt);

  document.getElementById("conf-payment-method").textContent =
    formData.paymentMethod.charAt(0).toUpperCase() +
    formData.paymentMethod.slice(1);

  const ticketItemsContainer = document.getElementById("conf-ticket-items");
  ticketItemsContainer.innerHTML = "";

  for (const [type, quantity] of Object.entries(selectedTickets)) {
    const price = ticketPrices[type];
    const subtotal = price * quantity;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
      <td>${quantity}</td>
      <td>₹${price.toFixed(2)}</td>
      <td>₹${subtotal.toFixed(2)}</td>
    `;
    ticketItemsContainer.appendChild(row);
  }

  document.getElementById(
    "conf-total-amount"
  ).textContent = `₹${totalAmount.toFixed(2)}`;

  const qrData = `Booking Ref: ${bookingRef}
Name: ${formData.name}
Date: ${formData.visitDate}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrData
  )}`;
  document.getElementById(
    "ticket-qr-code"
  ).innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

//Download ticket
function downloadTicket() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  let y = 20;

  // ===== HEADER =====
  pdf.setFontSize(18);
  pdf.text("Wildlife Adventure Zoo - Ticket", 105, y, { align: "center" });
  y += 10;

  pdf.setLineWidth(0.5);
  pdf.line(20, y, 190, y);
  y += 8;

  // ===== BOOKING DETAILS =====
  pdf.setFontSize(11);
  pdf.text(`Booking Reference: ${document.getElementById("booking-reference").textContent}`, 20, y); y += 7;
  pdf.text(`Name: ${document.getElementById("conf-name").textContent}`, 20, y); y += 7;
  pdf.text(`Email: ${document.getElementById("conf-email").textContent}`, 20, y); y += 7;
  pdf.text(`Phone: ${document.getElementById("conf-phone").textContent}`, 20, y); y += 7;
  pdf.text(`Visit Date: ${document.getElementById("conf-visit-date").textContent}`, 20, y); y += 7;
  pdf.text(`Payment Method: ${document.getElementById("conf-payment-method").textContent}`, 20, y);
  y += 10;

  // ===== TABLE HEADER =====
  pdf.setFontSize(12);
  pdf.text("Tickets Booked", 20, y);
  y += 8;

  pdf.setFontSize(11);
  pdf.text("Type", 20, y);
  pdf.text("Qty", 70, y);
  pdf.text("Price", 100, y);
  pdf.text("Subtotal", 150, y);
  y += 4;

  pdf.line(20, y, 190, y);
  y += 6;

  // ===== TABLE DATA =====
  let total = 0;

  for (const [type, qty] of Object.entries(selectedTickets)) {
    const price = Number(ticketPrices[type]);
    const subtotal = price * qty;
    total += subtotal;

    pdf.text(type.toUpperCase(), 20, y);
    pdf.text(String(qty), 70, y);
    pdf.text(`INR ${price.toFixed(2)}`, 100, y);
    pdf.text(`INR ${subtotal.toFixed(2)}`, 150, y);

    y += 7;

    if (y > 260) {
      pdf.addPage();
      y = 20;
    }
  }

  // ===== TOTAL =====
  y += 4;
  pdf.line(20, y, 190, y);
  y += 8;

  pdf.setFontSize(13);
  pdf.text(`Total Amount: INR ${total.toFixed(2)}`, 140, y);

  // ===== QR CODE =====
  const qrData = `
Booking Ref: ${document.getElementById("booking-reference").textContent}
Name: ${document.getElementById("conf-name").textContent}
Visit Date: ${document.getElementById("conf-visit-date").textContent}
`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  const qrImg = new Image();
  qrImg.crossOrigin = "anonymous";
  qrImg.src = qrUrl;

  qrImg.onload = function () {
    pdf.addImage(qrImg, "PNG", 20, y + 10, 40, 40);

    // ===== FOOTER =====
    pdf.setFontSize(9);
    pdf.text(
      "Please carry this ticket and a valid ID. Tickets are non-refundable.",
      105,
      285,
      { align: "center" }
    );

    pdf.save("Zoo_Ticket.pdf");
  };
}


//Print Ticket
function printTicket() {
  window.print();
}

document
  .querySelector(".close-modal")
  ?.addEventListener("click", closeConfirmationModal);
document
  .querySelector(".close-btn")
  ?.addEventListener("click", closeConfirmationModal);
document
  .querySelector(".download-ticket")
  ?.addEventListener("click", downloadTicket);
document.querySelector(".print-ticket")?.addEventListener("click", printTicket);

document
  .getElementById("confirmation-modal")
  ?.addEventListener("click", function (e) {
    if (e.target === this) closeConfirmationModal();
  });

// Attach modal & control listeners immediately (script placed at end of body)

// (function attachModalListeners() {
//   // close buttons: stop propagation & close
//   document.querySelectorAll(".close-modal, .close-btn").forEach((btn) => {
//     btn?.addEventListener("click", function (e) {
//       e.stopPropagation();
//       closeConfirmationModal();
//     });
//   });

//   // download / print: stop propagation
//   document
//     .querySelectorAll(".download-ticket, .print-ticket")
//     .forEach((btn) => {
//       btn?.addEventListener("click", function (e) {
//         e.stopPropagation();
//         if (this.classList.contains("download-ticket")) downloadTicket();
//         else if (this.classList.contains("print-ticket")) printTicket();
//       });
//     });

//   /**
//    * UPDATED: Removed pointer-events check here, as the temporary 'none' state is gone.
//    * The modal will now stay open unless the backdrop or close button is clicked.
//    */
//   const modalEl = document.getElementById("confirmation-modal");
//   if (modalEl) {
//     modalEl.addEventListener("click", function (e) {
//       // if click occurred on backdrop (modal container) — close
//       if (e.target === this) {
//         closeConfirmationModal();
//       }
//     });
//   }
// })();

// Main submit handler: sends to backend

document
  .getElementById("ticket-form")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const visitDate = document.getElementById("visit-date").value;
    const paymentMethod =
      document.querySelector('input[name="payment"]:checked')?.value || "card";
    const notes = document.getElementById("notes")?.value || "";

    if (Object.keys(selectedTickets).length === 0) {
      alert("Please select at least one ticket type.");
      return;
    }
    if (!name || !email || !phone || !visitDate) {
      alert("Please fill in name, email, phone and visit date.");
      return;
    }

    const eligibilityErrors = validateTicketEligibility();
    if (eligibilityErrors.length > 0) {
      alert("Ticket Validation Errors:\n\n" + eligibilityErrors.join("\n"));
      return;
    }

    const paymentErrors = validatePaymentMethod();
    if (paymentErrors.length > 0) {
      alert("Payment Validation Errors:\n\n" + paymentErrors.join("\n"));
      return;
    }

    // Build payloads: one POST per ticket type
    // 1️⃣ Convert selectedTickets into tickets array
    const tickets = Object.entries(selectedTickets).map(([type, qty]) => ({
      type: type,
      qty: qty,
      price: ticketPrices[type],
    }));

    // 2️⃣ Build ONE payload
    const payload = {
      fullName: name,
      email: email,
      mobile: phone,
      visitDate: visitDate, // IMPORTANT
      paymentMethod: paymentMethod,
      tickets: tickets, // IMPORTANT
      notes: notes,
    };

    // 3️⃣ Send ONE request to backend
    const res = await fetch(`${API_BASE}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Booking failed");
    }

    // Calculate total
    let total = 0;
    for (const [type, qty] of Object.entries(selectedTickets)) {
      total += ticketPrices[type] * qty;
    }

    // OPEN CONFIRMATION MODAL
    showConfirmationModal(
      {
        name,
        email,
        phone,
        visitDate,
        paymentMethod,
      },
      result.bookingRef,
      result.createdAt,
      total
    );

    // Reset form
    selectedTickets = {};
    updateTicketSelection();
    this.reset();
  });
