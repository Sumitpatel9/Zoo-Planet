const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// app.get("/api/tickets", (req, res) => {
//   res.json({ status: "Zoo Booking API running" });
// });

app.use("/api/tickets", require("./routes/bookingRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
