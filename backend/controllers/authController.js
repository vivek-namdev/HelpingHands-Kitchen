const User = require("../models/User.js");
const generateToken = require("../utils/generateToken.js");

// ===============================
// REGISTER
// ===============================
const register = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required.",
      });
    }

    const allowedRoles = ["donor", "ngo", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    if (role === "admin") {
      if (!adminCode) {
        return res.status(400).json({
          success: false,
          message: "Admin code is required.",
        });
      }

      if (adminCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin code.",
        });
      }
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      profileId: null,
    });

    const token = generateToken(user._id, user.role);

    const userResponse = user.toObject();

    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
};

// ===============================
// LOGIN
// ===============================
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      role,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password or role.",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password or role.",
      });
    }

    const token = generateToken(user._id, user.role);

    const userResponse = user.toObject();

    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};

// ===============================
// GET CURRENT USER
// ===============================
// ===============================
// GET CURRENT USER
// ===============================
const getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ======================================================
    // AUTO-LINK EXISTING NGO PROFILE
    // ======================================================

    if (user.role === "ngo" && !user.profileId) {
      const NGO = require("../models/NGO.js");

      const matchingNGOs = await NGO.find({
        NGO_Name: user.name,
      }).select("NGO_ID NGO_Name");

      // Only auto-link when there is exactly one
      // NGO with the same name.
      if (matchingNGOs.length === 1) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            profileId: matchingNGOs[0].NGO_ID,
          },
          {
            new: true,
          },
        ).select("-password");

        console.log(
          `✅ NGO profile auto-linked: ${user.name} -> ${user.profileId}`,
        );
      }
    }

    // ======================================================
    // AUTO-LINK EXISTING DONOR PROFILE
    // ======================================================

    if (user.role === "donor" && !user.profileId) {
      const Donor = require("../models/Donor.js");

      const matchingDonors = await Donor.find({
        Donor_Name: user.name,
      }).select("Donor_ID Donor_Name");

      // Only auto-link when there is exactly one
      // donor with the same name.
      if (matchingDonors.length === 1) {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            profileId: matchingDonors[0].Donor_ID,
          },
          {
            new: true,
          },
        ).select("-password");

        console.log(
          `✅ Donor profile auto-linked: ${user.name} -> ${user.profileId}`,
        );
      }
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
      error: error.message,
    });
  }
};
module.exports = {
  register,
  login,
  getMe,
};
