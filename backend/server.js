const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/authRoutes");

const donorRoutes = require("./routes/donorRoutes");
const donationRoutes = require("./routes/donationRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const claimRoutes = require("./routes/claimRoutes");
const daOutputRoutes = require("./routes/daOutputRoutes");
const locationRoutes = require("./routes/locationRoutes.js");
// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const { protect, allowRoles } = require("./middleware/authMiddleware");

// ======================================================
// APP
// ======================================================

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Food Rescue Platform API is running",
  });
});

// ======================================================
// AUTH ROUTES
// ======================================================
// PUBLIC
// No JWT required for register/login.
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

// ======================================================
// DONOR ROUTES
// ======================================================
// Allowed:
// donor
// admin
// ======================================================

app.use("/api/donors", protect, allowRoles("donor", "admin"), donorRoutes);

// ======================================================
// DONATION ROUTES
// ======================================================
// Allowed:
// donor
// ngo
// admin
// ======================================================

app.use(
  "/api/donations",
  protect,
  allowRoles("donor", "ngo", "admin"),
  donationRoutes,
);

// ======================================================
// NGO ROUTES
// ======================================================
// Allowed:
// ngo
// admin
// ======================================================

app.use("/api/ngos", protect, allowRoles("ngo", "admin"), ngoRoutes);

// ======================================================
// CLAIM ROUTES
// ======================================================
// Allowed:
// ngo
// admin
// ======================================================

app.use("/api/claims", protect, allowRoles("ngo", "admin"), claimRoutes);

// ======================================================
// DA OUTPUT ROUTES
// ======================================================
// Allowed:
// admin ONLY
// ======================================================

app.use("/api/da-output", protect, allowRoles("admin"), daOutputRoutes);

// ======================================================
// INVALID JSON ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  next(err);
});

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================================
// MONGODB CONNECTION
// ======================================================

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    process.exit(1);
  }
};

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
