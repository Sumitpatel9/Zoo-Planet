const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Check if MONGO_URI exists
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.log("\n💡 Troubleshooting:");
        console.log("1. Check if .env file exists with MONGO_URI");
        console.log("2. Verify MongoDB is running: sudo systemctl status mongodb");
        console.log("3. Check connection string format\n");
        process.exit(1);
    }
};

module.exports = connectDB;
