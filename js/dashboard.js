// ==================== DASHBOARD.JS - COMPLETE FIXED VERSION ====================

// ==================== CONFIGURATION ====================
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://zoo-planet-backend.onrender.com';

// const API_BASE = "http://localhost:4000"; // For development
console.log("🔗 Dashboard using API:", API_BASE);

// ==================== AUTH CHECK ====================
function checkAuth() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    alert("Please login to access dashboard");
    window.location.href = "login.html";
    return null;
  }

  try {
    return { token, user: JSON.parse(user) };
  } catch (e) {
    console.error("Error parsing user data:", e);
    localStorage.clear();
    window.location.href = "login.html";
    return null;
  }
}

const auth = checkAuth();
if (auth) {
  loadDashboardData();
}

// ==================== LOAD DASHBOARD DATA ====================
async function loadDashboardData() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("userName").textContent = user.name || "User";

    await Promise.all([
      loadTickets(),
      loadEvents(),
      loadAdoptions(),
      loadDonations(),
      loadProfile(),
    ]);
  } catch (error) {
    console.error("❌ Dashboard load error:", error);
  }
}

// ==================== LOAD TICKETS (MATCHES YOUR DATA) ====================
async function loadTickets() {
  const ticketsList = document.getElementById('ticketsList');
  const user = JSON.parse(localStorage.getItem('user')); // from login
  const userEmail = (user.email || '').toLowerCase();

  try {
    const res = await fetch(`${API_BASE}/api/tickets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // ADJUST ARRAY PATH – if your API returns { success, data: [...] }
    const tickets = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

    console.log('All tickets from API:', tickets);

    // FILTER BY EMAIL (your ticket has "email")
    const userTickets = tickets.filter(t => {
      const ticketEmail = (t.email || '').toLowerCase();
      return ticketEmail === userEmail;
    });

    console.log('Filtered tickets for', userEmail, userTickets);

    // UPDATE COUNT
    document.getElementById('totalTickets').textContent = userTickets.length;

    if (!userTickets.length) {
      ticketsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-ticket-alt"></i>
          <h3>No Tickets Yet</h3>
          <p>No tickets found for this email: ${user.email}</p>
          <a href="ticket.html" class="btn btn-primary">
            <i class="fas fa-plus"></i> Book Your First Ticket
          </a>
        </div>
      `;
      return;
    }

    // RENDER CARDS USING YOUR FIELDS
    ticketsList.innerHTML = userTickets
      .map(ticket => {
        const visitDate = ticket.visitDate
          ? new Date(ticket.visitDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Date not set';

        const amount = Number(ticket.totalAmount || 0);

        return `
          <div class="booking-card">
            <div class="booking-header">
              <div>
                <h3 class="booking-title">Zoo Visit - General</h3>
                <p class="booking-id">Ref: ${ticket.bookingRef || 'N/A'}</p>
              </div>
              <span class="booking-status confirmed">
                <i class="fas fa-check-circle"></i> Confirmed
              </span>
            </div>

            <div class="booking-details">
              <div class="detail-item">
                <i class="fas fa-user"></i>
                <span>${ticket.fullName || ''}</span>
              </div>

              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${visitDate}</span>
              </div>

              <div class="detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>₹${amount.toLocaleString()}</span>
              </div>

              <div class="detail-item">
                <i class="fas fa-credit-card"></i>
                <span>${ticket.paymentMethod || 'N/A'}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error('❌ Tickets error:', err);
    document.getElementById('totalTickets').textContent = '0';
    ticketsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error loading tickets</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}



// ==================== LOAD EVENTS ====================
async function loadEvents() {
  const eventsList = document.getElementById("eventsList");
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch(`${API_BASE}/api/events`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const events = data.events || data.data || data || [];

    const userEvents = events.filter(
      (e) =>
        e.email &&
        user.email &&
        e.email.toLowerCase() === user.email.toLowerCase()
    );

    document.getElementById("totalEvents").textContent = userEvents.length;

    if (userEvents.length === 0) {
      eventsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No Event Bookings</h3>
                    <p>You haven't booked any events yet</p>
                    <a href="service.html#events" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Browse Events
                    </a>
                </div>
            `;
      return;
    }

    eventsList.innerHTML = userEvents
      .map((event) => {
        const eventDate = event.eventDate
          ? new Date(event.eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Date not set";

        return `
                <div class="booking-card">
                    <div class="booking-header">
                        <div>
                            <h3 class="booking-title">${
                              event.eventType || "Event Booking"
                            }</h3>
                            <p class="booking-id">ID: ${
                              event._id
                                ? event._id.slice(-8).toUpperCase()
                                : "N/A"
                            }</p>
                        </div>
                        <span class="booking-status confirmed">
                            <i class="fas fa-check-circle"></i> Confirmed
                        </span>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${eventDate}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${event.guests || 0} Guests</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>₹${(
                              event.totalAmount || 0
                            ).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.error("❌ Events error:", error);
    document.getElementById("totalEvents").textContent = "0";
    eventsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar"></i>
                <h3>No Event Bookings</h3>
                <p>You haven't booked any events yet</p>
                <a href="service.html#events" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Browse Events
                </a>
            </div>
        `;
  }
}

// ==================== LOAD ADOPTIONS ====================
async function loadAdoptions() {
  const adoptionsList = document.getElementById("adoptionsList");
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch(`${API_BASE}/api/adoptions`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const adoptions = data.adoptions || data.data || data || [];

    const userAdoptions = adoptions.filter(
      (a) =>
        a.email &&
        user.email &&
        a.email.toLowerCase() === user.email.toLowerCase()
    );

    document.getElementById("totalAdoptions").textContent =
      userAdoptions.length;

    if (userAdoptions.length === 0) {
      adoptionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-paw"></i>
                    <h3>No Adoptions Yet</h3>
                    <p>You haven't adopted any animals yet</p>
                    <a href="donate.html" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Adopt an Animal
                    </a>
                </div>
            `;
      return;
    }

    adoptionsList.innerHTML = userAdoptions
      .map(
        (adoption) => `
            <div class="booking-card">
                <div class="booking-header">
                    <div>
                        <h3 class="booking-title">${
                          adoption.animalName || "Animal Adoption"
                        }</h3>
                        <p class="booking-id">ID: ${
                          adoption._id
                            ? adoption._id.slice(-8).toUpperCase()
                            : "N/A"
                        }</p>
                    </div>
                    <span class="booking-status confirmed">
                        <i class="fas fa-heart"></i> Active
                    </span>
                </div>
                <div class="booking-details">
                    <div class="detail-item">
                        <i class="fas fa-paw"></i>
                        <span>${adoption.animalType || "N/A"}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${adoption.duration || "N/A"}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-rupee-sign"></i>
                        <span>₹${(adoption.price || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("❌ Adoptions error:", error);
    document.getElementById("totalAdoptions").textContent = "0";
    adoptionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paw"></i>
                <h3>No Adoptions Yet</h3>
                <p>You haven't adopted any animals yet</p>
                <a href="donate.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Adopt an Animal
                </a>
            </div>
        `;
  }
}

// ==================== LOAD DONATIONS ====================
async function loadDonations() {
  const donationsList = document.getElementById("donationsList");
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await fetch(`${API_BASE}/api/donations`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const donations = data.donations || data.data || data || [];

    const userDonations = donations.filter(
      (d) =>
        d.email &&
        user.email &&
        d.email.toLowerCase() === user.email.toLowerCase()
    );

    const totalAmount = userDonations.reduce(
      (sum, d) => sum + (d.amount || 0),
      0
    );
    document.getElementById("totalDonations").textContent =
      "₹" + totalAmount.toLocaleString();

    if (userDonations.length === 0) {
      donationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>No Donations Yet</h3>
                    <p>Make your first donation to support wildlife conservation</p>
                    <a href="donate.html" class="btn btn-primary">
                        <i class="fas fa-hand-holding-heart"></i> Make a Donation
                    </a>
                </div>
            `;
      return;
    }

    donationsList.innerHTML = userDonations
      .map((donation) => {
        const donationDate = donation.createdAt
          ? new Date(donation.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Date not set";

        return `
                <div class="booking-card">
                    <div class="booking-header">
                        <div>
                            <h3 class="booking-title">${
                              donation.donationType || "General"
                            } Donation</h3>
                            <p class="booking-id">ID: ${
                              donation._id
                                ? donation._id.slice(-8).toUpperCase()
                                : "N/A"
                            }</p>
                        </div>
                        <span class="booking-status confirmed">
                            <i class="fas fa-check-circle"></i> Completed
                        </span>
                    </div>
                    <div class="booking-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${donationDate}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>₹${(
                              donation.amount || 0
                            ).toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-sync-alt"></i>
                            <span>${donation.frequency || "One-time"}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-credit-card"></i>
                            <span>${donation.paymentMethod || "N/A"}</span>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.error("❌ Donations error:", error);
    document.getElementById("totalDonations").textContent = "₹0";
    donationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>No Donations Yet</h3>
                <p>Make your first donation to support wildlife conservation</p>
                <a href="donate.html" class="btn btn-primary">
                    <i class="fas fa-hand-holding-heart"></i> Make a Donation
                </a>
            </div>
        `;
  }
}

// ==================== LOAD PROFILE ====================
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("profileName").value = user.name || "";
  document.getElementById("profileEmail").value = user.email || "";

  const memberSince = user.createdAt ? new Date(user.createdAt) : new Date();
  document.getElementById("memberSince").textContent =
    memberSince.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}

// ==================== TAB SWITCHING ====================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(targetTab).classList.add("active");
  });
});

// ==================== PROFILE UPDATE ====================
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("profileName").value.trim();

  if (!name) {
    alert("Please enter your name");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  user.name = name;
  localStorage.setItem("user", JSON.stringify(user));

  document.getElementById("userName").textContent = name;
  alert("✅ Profile updated successfully!");
});

// ==================== LOGOUT ====================
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  }
});

console.log("✅ Dashboard initialized successfully");
// ==================== DASHBOARD.JS - COMPLETE FIXED VERSION ====================
