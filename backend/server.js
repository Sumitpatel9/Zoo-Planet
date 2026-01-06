const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ==================== LOAD ENVIRONMENT VARIABLES ====================
dotenv.config();

// ==================== CONNECT TO DATABASE ====================
connectDB();

// ==================== INITIALIZE EXPRESS ====================
const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-frontend-domain.com' 
        : '*',
    credentials: true
}));
app.use(helmet());

// ==================== ROOT ROUTE ====================
app.get("/", (req, res) => {
    res.json({ 
        status: "✅ Zoo Planet API Running",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            tickets: "/api/tickets",
            search: "/api/tickets/search",
            contact: "/api/contact",
            events: "/api/events",
            tours: "/api/tours",
            memberships: "/api/memberships"
        }
    });
});

// ==================== API ROUTES ====================
app.use("/api/tickets", require("./routes/bookingRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/tours", require("./routes/tourRoutes"));
app.use("/api/memberships", require("./routes/membershipRoutes"));

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK",
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
    res.status(404).json({ 
        error: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(err.status || 500).json({ 
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log(`🚀 Server started successfully!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);
    console.log("=".repeat(50) + "\n");
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// ==================== HANDLE UNCAUGHT ERRORS ====================
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION:', err);
    server.close(() => process.exit(1));
});
