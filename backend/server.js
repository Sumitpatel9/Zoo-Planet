// server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(express.json());
// For dev set origin to your frontend URL, e.g. http://localhost:5500
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Create a ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const {
      bookingDate,
      ticketType,
      fullName,
      email,
      mobile,
      paymentMethod,
      notes,
      qty
    } = req.body;

    // Basic validation
    if (!bookingDate || !ticketType || !fullName || !email || !mobile) {
      return res.status(400).json({ error: 'bookingDate, ticketType, fullName, email and mobile are required' });
    }

    const db = await readDB();

    const ticket = {
      id: uuidv4(),
      bookingDate,       // date of visit / booking date (string)
      ticketType,        // e.g. "adult", "child", "family"
      qty: typeof qty === 'number' ? qty : (parseInt(qty, 10) || 1),
      fullName,
      email,
      mobile,
      paymentMethod,     // e.g. "card", "upi", "cash"
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.tickets.push(ticket);
    await writeDB(db);

    // Return the stored ticket
    res.status(201).json(ticket);
  } catch (err) {
    console.error('Create ticket error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tickets (useful for admin or local testing)
app.get('/api/tickets', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.tickets || []);
  } catch (err) {
    console.error('Get tickets error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Ticket backend listening on port ${PORT}`);
});
