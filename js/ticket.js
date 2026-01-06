// ==================== ZOO PLANET - TICKET BOOKING SYSTEM ====================
// Enhanced version with improved UI/UX and backend integration

const API_BASE = window.location.hostname === 'localhost'
    ? "http://localhost:4000"
    : "https://zoo-planet-backend.onrender.com"; 

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    console.log('🎫 Zoo Planet Ticket System Loaded');
});

function initializePage() {
    // Set minimum visit date to today
    const visitDateInput = document.getElementById("visit-date");
    if (visitDateInput) {
        const today = new Date().toISOString().split("T")[0];
        visitDateInput.min = today;
        
        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        visitDateInput.value = tomorrow.toISOString().split("T")[0];
    }
    
    // Initialize event listeners
    attachEventListeners();
}

// ==================== TICKET PRICES ====================
const ticketPrices = {
    adult: 24.99,
    child: 14.99,
    senior: 19.99,
    family: 69.99,
    student: 18.99,
    group: 12.99,
};

// Selected tickets storage
let selectedTickets = {};

// ==================== UTILITY FUNCTIONS ====================
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

function generateBookingReference() {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const numbers = "0123456789";
    let ref = "WAZ-";
    for (let i = 0; i < 3; i++) {
        ref += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
        ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return ref;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==================== VALIDATION FUNCTIONS ====================
function validateTicketEligibility() {
    const birthDate = document.getElementById("birth-date")?.value;
    const studentId = document.getElementById("student-id")?.value;
    let errors = [];

    if (selectedTickets.child > 0) {
        if (!birthDate) {
            errors.push("Birth date is required for child tickets.");
        } else {
            const age = calculateAge(birthDate);
            if (age >= 13) {
                errors.push("Child tickets are only valid for visitors under 13 years old.");
            }
        }
    }

    if (selectedTickets.senior > 0) {
        if (!birthDate) {
            errors.push("Birth date is required for senior tickets.");
        } else {
            const age = calculateAge(birthDate);
            if (age < 65) {
                errors.push("Senior tickets are only valid for visitors 65 years and older.");
            }
        }
    }

    if (selectedTickets.student > 0) {
        if (!studentId || studentId.trim() === "") {
            errors.push("Valid student ID is required for student tickets.");
        }
        if (!birthDate) {
            errors.push("Birth date is required for student tickets.");
        } else {
            const age = calculateAge(birthDate);
            if (age < 16 || age > 30) {
                errors.push("Student tickets are valid for ages 16-30 with valid student ID.");
            }
        }
    }

    return errors;
}

function validatePaymentMethod() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    let errors = [];
    
    if (!paymentMethod) {
        errors.push("Please select a payment method.");
        return errors;
    }

    switch (paymentMethod) {
        case "credit": {
            const cardNumber = document.getElementById("card-number")?.value?.replace(/\s/g, "");
            const expiryDate = document.getElementById("expiry")?.value;
            const cvv = document.getElementById("cvv")?.value;
            
            if (!cardNumber || cardNumber.length < 16) {
                errors.push("Please enter a valid 16-digit card number.");
            }
            if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
                errors.push("Please enter a valid expiry date (MM/YY).");
            }
            if (!cvv || cvv.length < 3) {
                errors.push("Please enter a valid CVV (3-4 digits).");
            }
            break;
        }
        case "upi": {
            const upiMethod = document.querySelector('input[name="upi-method"]:checked')?.value;
            if (!upiMethod) {
                errors.push("Please select UPI payment method (QR or UPI ID).");
            } else if (upiMethod === "id") {
                const upiId = document.getElementById("upi-id")?.value;
                if (!upiId || !upiId.includes("@")) {
                    errors.push("Please enter a valid UPI ID (e.g., user@bank).");
                }
            }
            break;
        }
    }

    return errors;
}

// ==================== DYNAMIC FIELDS (BIRTH DATE, STUDENT ID) ====================
function toggleAdditionalFields() {
    const needsBirthDate = selectedTickets.child > 0 || selectedTickets.senior > 0 || selectedTickets.student > 0;
    const needsStudentId = selectedTickets.student > 0;

    let birthDateField = document.getElementById("birth-date-field");
    if (!birthDateField && needsBirthDate) {
        createBirthDateField();
    }

    let studentIdField = document.getElementById("student-id-field");
    if (!studentIdField && needsStudentId) {
        createStudentIdField();
    }

    birthDateField = document.getElementById("birth-date-field");
    studentIdField = document.getElementById("student-id-field");

    if (birthDateField) {
        birthDateField.style.display = needsBirthDate ? "block" : "none";
        const birthDateInput = document.getElementById("birth-date");
        if (birthDateInput) {
            birthDateInput.required = needsBirthDate;
        }
    }
    
    if (studentIdField) {
        studentIdField.style.display = needsStudentId ? "block" : "none";
        const studentIdInput = document.getElementById("student-id");
        if (studentIdInput) {
            studentIdInput.required = needsStudentId;
        }
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
        <input type="date" id="birth-date" name="birth-date" max="${new Date().toISOString().split("T")[0]}">
    `;
    phoneField.insertAdjacentElement("afterend", birthDateDiv);
}

function createStudentIdField() {
    const birthDateField = document.getElementById("birth-date-field");
    const insertAfter = birthDateField || document.getElementById("phone")?.parentNode;
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

// ==================== TICKET SELECTION ====================
function attachEventListeners() {
    // Ticket selection buttons
    document.querySelectorAll(".select-ticket").forEach((btn) => {
        btn.addEventListener("click", function() {
            const type = this.dataset.type;
            if (selectedTickets[type]) {
                selectedTickets[type]++;
            } else {
                selectedTickets[type] = 1;
            }
            updateTicketSelection();
            toggleAdditionalFields();

            // Visual feedback
            const card = this.closest(".ticket-card");
            if (card) {
                card.style.transform = "scale(1.05)";
                setTimeout(() => {
                    card.style.transform = "";
                }, 300);
            }
            
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} ticket added!`, 'success');
        });
    });

    // Payment method toggles
    document.querySelectorAll('input[name="payment"]').forEach((radio) => {
        radio.addEventListener("change", function() {
            document.querySelectorAll(".payment-details").forEach((detail) => {
                detail.classList.remove("active");
            });
            const el = document.getElementById(`${this.value}-details`);
            if (el) {
                el.classList.add("active");
            }
        });
    });

    // UPI method toggles
    document.querySelectorAll('input[name="upi-method"]').forEach((radio) => {
        radio.addEventListener("change", function() {
            document.querySelector(".upi-qr")?.classList.toggle("active", this.value === "qr");
            document.querySelector(".upi-id")?.classList.toggle("active", this.value === "id");
        });
    });

    // Search type change
    document.querySelectorAll('input[name="searchType"]').forEach((radio) => {
        radio.addEventListener("change", function() {
            const input = document.getElementById("search-value");
            input.placeholder = this.value === "ref" ? "Enter booking reference" : "Enter mobile number";
            input.value = "";
        });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", function() {
            let value = this.value.replace(/\s/g, "").replace(/\D/g, "");
            this.value = value.replace(/(\d{4})/g, '$1 ').trim();
            if (value.length > 16) {
                this.value = this.value.substring(0, 19);
            }
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
        expiryInput.addEventListener("input", function() {
            let value = this.value.replace(/\D/g, "");
            if (value.length >= 2) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4);
            }
            this.value = value;
        });
    }

    // CVV formatting
    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
        cvvInput.addEventListener("input", function() {
            this.value = this.value.replace(/\D/g, "").substring(0, 4);
        });
    }

    // UPI ID formatting
    const upiIdInput = document.getElementById("upi-id");
    if (upiIdInput) {
        upiIdInput.addEventListener("input", function() {
            this.value = this.value.toLowerCase();
        });
    }

    // Modal close handlers
    document.querySelectorAll(".close-modal, .close-btn").forEach((btn) => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            closeConfirmationModal();
        });
    });

    // Modal overlay click
    document.getElementById("confirmation-modal")?.addEventListener("click", function(e) {
        if (e.target === this) {
            closeConfirmationModal();
        }
    });

    // Download & Print
    document.querySelector(".download-ticket")?.addEventListener("click", downloadTicket);
    document.querySelector(".print-ticket")?.addEventListener("click", printTicket);

    // Form submission
    const ticketForm = document.getElementById("ticket-form");
    if (ticketForm) {
        ticketForm.addEventListener("submit", handleFormSubmit);
    }
}

function updateTicketSelection() {
    const container = document.getElementById("selected-tickets");
    if (!container) return;
    
    container.innerHTML = "";

    if (Object.keys(selectedTickets).length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                <i class="fas fa-info-circle"></i>
                No tickets selected yet
            </p>
        `;
        updateTotal(0);
        return;
    }

    let total = 0;
    
    for (const [type, quantity] of Object.entries(selectedTickets)) {
        const price = ticketPrices[type] || 0;
        const subtotal = price * quantity;
        total += subtotal;

        const ticketDiv = document.createElement("div");
        ticketDiv.className = "selected-ticket";
        ticketDiv.innerHTML = `
            <div>
                <span>${type.charAt(0).toUpperCase() + type.slice(1)} x${quantity}</span>
                <div class="ticket-actions">
                    <button class="remove-ticket" data-type="${type}" title="Remove one" type="button">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                    <button class="discard-ticket" data-type="${type}" title="Discard all" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <span>₹${subtotal.toFixed(2)}</span>
        `;
        container.appendChild(ticketDiv);
    }

    // Attach remove/discard handlers
    container.querySelectorAll(".remove-ticket").forEach((btn) => {
        btn.addEventListener("click", function() {
            const type = this.dataset.type;
            if (selectedTickets[type] > 1) {
                selectedTickets[type]--;
            } else {
                delete selectedTickets[type];
            }
            updateTicketSelection();
            toggleAdditionalFields();
        });
    });

    container.querySelectorAll(".discard-ticket").forEach((btn) => {
        btn.addEventListener("click", function() {
            const type = this.dataset.type;
            delete selectedTickets[type];
            updateTicketSelection();
            toggleAdditionalFields();
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} tickets removed`, 'info');
        });
    });

    // Clear all button
    if (Object.keys(selectedTickets).length > 0) {
        const clearAllDiv = document.createElement("div");
        clearAllDiv.className = "clear-all";
        clearAllDiv.innerHTML = `
            <button class="btn clear-all-btn" type="button">
                <i class="fas fa-times-circle"></i> Clear All Tickets
            </button>
        `;
        container.appendChild(clearAllDiv);
        
        document.querySelector(".clear-all-btn")?.addEventListener("click", function() {
            if (confirm('Are you sure you want to clear all tickets?')) {
                selectedTickets = {};
                updateTicketSelection();
                toggleAdditionalFields();
                showNotification('All tickets cleared', 'info');
            }
        });
    }

    updateTotal(total);
}

function updateTotal(total) {
    const subtotalEl = document.getElementById("subtotal-amount");
    const totalEl = document.getElementById("total-amount");
    
    if (subtotalEl) subtotalEl.textContent = `₹${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

// ==================== FORM SUBMISSION ====================
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const visitDate = document.getElementById("visit-date").value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || "card";

    // Validation
    if (Object.keys(selectedTickets).length === 0) {
        showNotification("Please select at least one ticket type.", 'error');
        return;
    }

    if (!name || !email || !phone || !visitDate) {
        showNotification("Please fill in all required fields.", 'error');
        return;
    }

    const eligibilityErrors = validateTicketEligibility();
    if (eligibilityErrors.length > 0) {
        showNotification(eligibilityErrors.join('\n'), 'error');
        return;
    }

    const paymentErrors = validatePaymentMethod();
    if (paymentErrors.length > 0) {
        showNotification(paymentErrors.join('\n'), 'error');
        return;
    }

    // Show loading
    const submitBtn = document.querySelector('.submit-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    submitBtn.disabled = true;
    loadingSpinner.style.display = 'block';

    try {
        // Build tickets array
        const tickets = Object.entries(selectedTickets).map(([type, qty]) => ({
            type: type,
            qty: qty,
            price: ticketPrices[type],
        }));

        // Build payload
        const payload = {
            fullName: name,
            email: email,
            mobile: phone,
            visitDate: visitDate,
            paymentMethod: paymentMethod,
            tickets: tickets,
            notes: document.getElementById("notes")?.value || "",
        };

        // Send to backend
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

        // Show success modal
        showConfirmationModal(
            { name, email, phone, visitDate, paymentMethod },
            result.bookingRef,
            result.createdAt,
            total
        );

        // Reset form
        selectedTickets = {};
        updateTicketSelection();
        document.getElementById("ticket-form").reset();
        toggleAdditionalFields();

    } catch (error) {
        console.error('Booking error:', error);
        showNotification(error.message || 'Booking failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        loadingSpinner.style.display = 'none';
    }
}

// ==================== CONFIRMATION MODAL ====================
function showConfirmationModal(formData, bookingRef, createdAt, totalAmount) {
    const modal = document.getElementById("confirmation-modal");
    if (!modal) return;

    document.getElementById("booking-reference").textContent = bookingRef;
    document.getElementById("conf-name").textContent = formData.name;
    document.getElementById("conf-email").textContent = formData.email;
    document.getElementById("conf-phone").textContent = formData.phone;
    document.getElementById("conf-visit-date").textContent = formatDisplayDate(formData.visitDate);
    document.getElementById("conf-booking-date").textContent = formatDisplayDate(createdAt);
    document.getElementById("conf-payment-method").textContent = 
        formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1);

    // Populate ticket items
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

    document.getElementById("conf-total-amount").textContent = `₹${totalAmount.toFixed(2)}`;

    // Generate QR code
    const qrData = `Booking Ref: ${bookingRef}\nName: ${formData.name}\nDate: ${formData.visitDate}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    document.getElementById("ticket-qr-code").innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeConfirmationModal() {
    const modal = document.getElementById("confirmation-modal");
    const listModal = document.getElementById("ticket-list-modal");
    
    if (modal) {
        modal.style.display = "none";
    }
    if (listModal) {
        listModal.style.display = "none";
    }
    
    document.body.style.overflow = "auto";
}

// ==================== VIEW TICKET ====================
async function viewTicket() {
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    const value = document.getElementById("search-value").value.trim();

    if (!value) {
        showNotification("Please enter a value", 'error');
        return;
    }

    let url = `${API_BASE}/api/tickets/search`;

    if (searchType === "ref") {
        url += `?bookingRef=${value}`;
    } else {
        if (value.length < 10) {
            showNotification("Enter valid mobile number", 'error');
            return;
        }
        url += `?mobile=${value}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            showNotification(data.error || "Ticket not found", 'error');
            return;
        }

        // Single ticket (booking reference)
        if (data.type === "single") {
            openTicketModal(data.booking);
            return;
        }

        // Multiple tickets (mobile number)
        showTicketList(data.bookings);
    } catch (err) {
        console.error('Search error:', err);
        showNotification("Server error. Please try again.", 'error');
    }
}

function showTicketList(bookings) {
    const listHtml = bookings.map((b, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${b.bookingRef}</td>
            <td>${formatDisplayDate(b.visitDate)}</td>
            <td>₹${b.totalAmount.toFixed(2)}</td>
            <td>
                <button onclick='openTicketModal(${JSON.stringify(b).replace(/'/g, "&#39;")})'>
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join("");

    const modal = document.getElementById("ticket-list-modal");
    document.getElementById("ticket-list-body").innerHTML = listHtml;

    modal.style.display = "flex";
}

function openTicketModal(booking) {
    selectedTickets = {};
    booking.tickets.forEach((t) => {
        selectedTickets[t.type] = t.qty;
    });

    showConfirmationModal(
        {
            name: booking.fullName,
            email: booking.email,
            phone: booking.mobile,
            visitDate: booking.visitDate,
            paymentMethod: booking.paymentMethod,
        },
        booking.bookingRef,
        booking.createdAt,
        booking.totalAmount
    );
    
    // Close list modal
    document.getElementById("ticket-list-modal").style.display = "none";
}

// ==================== DOWNLOAD TICKET ====================
function downloadTicket() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    let y = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(45, 134, 89);
    pdf.text("Zoo Planet - Ticket", 105, y, { align: "center" });
    y += 10;

    pdf.setLineWidth(0.5);
    pdf.setDrawColor(45, 134, 89);
    pdf.line(20, y, 190, y);
    y += 10;

    // Booking details
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Booking Reference: ${document.getElementById("booking-reference").textContent}`, 20, y);
    y += 7;
    pdf.text(`Name: ${document.getElementById("conf-name").textContent}`, 20, y);
    y += 7;
    pdf.text(`Email: ${document.getElementById("conf-email").textContent}`, 20, y);
    y += 7;
    pdf.text(`Phone: ${document.getElementById("conf-phone").textContent}`, 20, y);
    y += 7;
    pdf.text(`Visit Date: ${document.getElementById("conf-visit-date").textContent}`, 20, y);
    y += 7;
    pdf.text(`Payment: ${document.getElementById("conf-payment-method").textContent}`, 20, y);
    y += 12;

    // Table header
    pdf.setFontSize(12);
    pdf.setTextColor(45, 134, 89);
    pdf.text("Tickets Booked", 20, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Type", 20, y);
    pdf.text("Qty", 80, y);
    pdf.text("Price", 110, y);
    pdf.text("Subtotal", 150, y);
    y += 2;

    pdf.line(20, y, 190, y);
    y += 6;

    // Table data
    let total = 0;
    for (const [type, qty] of Object.entries(selectedTickets)) {
        const price = ticketPrices[type];
        const subtotal = price * qty;
        total += subtotal;

        pdf.text(type.toUpperCase(), 20, y);
        pdf.text(String(qty), 80, y);
        pdf.text(`₹${price.toFixed(2)}`, 110, y);
        pdf.text(`₹${subtotal.toFixed(2)}`, 150, y);
        y += 7;
    }

    // Total
    y += 4;
    pdf.line(20, y, 190, y);
    y += 8;
    pdf.setFontSize(13);
    pdf.setTextColor(45, 134, 89);
    pdf.text(`Total: ₹${total.toFixed(2)}`, 150, y);

    // QR Code
    const qrData = `Booking: ${document.getElementById("booking-reference").textContent}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrUrl;

    qrImg.onload = function() {
        pdf.addImage(qrImg, "PNG", 20, y + 10, 40, 40);

        // Footer
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Please bring valid ID and this booking reference.", 105, 285, { align: "center" });

        pdf.save(`Zoo_Ticket_${document.getElementById("booking-reference").textContent}.pdf`);
        showNotification('Ticket downloaded successfully!', 'success');
    };

    qrImg.onerror = function() {
        pdf.save(`Zoo_Ticket_${document.getElementById("booking-reference").textContent}.pdf`);
        showNotification('Ticket downloaded (without QR code)', 'info');
    };
}

// ==================== PRINT TICKET ====================
function printTicket() {
    window.print();
}

// ==================== CONSOLE LOG ====================
console.log('%c🎫 Zoo Planet Ticket System Ready!', 'color: #2d8659; font-size: 16px; font-weight: bold;');
console.log('%cBackend API: ' + API_BASE, 'color: #666; font-weight: bold;');
// ==================== END OF FILE ====================