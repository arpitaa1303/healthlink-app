const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/healthlink";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Support Request Schema
const supportRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);

// Volunteer Schema
const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  skills: { type: String, required: true },
  availability: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to HealthLink API" });
});

// Submit Support Request
app.post("/api/support", async (req, res) => {
  try {
    const { name, email, phone, category, message } = req.body;

    // Validation
    if (!name || !email || !phone || !category || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const supportRequest = new SupportRequest({
      name,
      email,
      phone,
      category,
      message,
    });

    await supportRequest.save();
    console.log("✅ New Support Request:", supportRequest);

    res.status(201).json({
      success: true,
      message: "Support request submitted successfully",
      data: supportRequest,
    });
  } catch (error) {
    console.error("Error submitting support request:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Register Volunteer
app.post("/api/volunteer", async (req, res) => {
  try {
    const { fullName, skills, availability, location } = req.body;

    // Validation
    if (!fullName || !skills || !availability || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const volunteer = new Volunteer({
      fullName,
      skills,
      availability,
      location,
    });

    await volunteer.save();
    console.log("✅ New Volunteer Registration:", volunteer);

    res.status(201).json({
      success: true,
      message: "Volunteer registration successful",
      data: volunteer,
    });
  } catch (error) {
    console.error("Error registering volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Get all support requests (Admin route)
app.get("/api/support", async (req, res) => {
  try {
    const requests = await SupportRequest.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching support requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Get all volunteers (Admin route)
app.get("/api/volunteer", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
