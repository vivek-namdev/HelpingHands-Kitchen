const Donor = require("../models/Donor.js");
const User = require("../models/User.js");
const generateId = require("../utils/generateId.js");
const syncSheet = require("../utils/syncToSheets.js");

const syncDonors = async () => {
  const all = await Donor.find().sort({ createdAt: 1 });

  const rows = all.map((d) => [
    d.Donor_ID,
    d.Donor_Name,
    d.Donor_Type,
    d.City,
    d.Location,
    d.Contact,
    d.createdAt?.toISOString() ?? "",
  ]);

  await syncSheet("Donors", rows);
};

// GET /api/donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donors",
      error: error.message,
    });
  }
};

// GET /api/donors/:id
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findOne({
      Donor_ID: req.params.id,
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donor",
      error: error.message,
    });
  }
};

// POST /api/donors
const createDonor = async (req, res) => {
  try {
    const { Donor_Name, Donor_Type, City, Location, Contact } = req.body;

    if (!Donor_Name || !Donor_Type || !City || !Location || !Contact) {
      return res.status(400).json({
        success: false,
        message: "All donor fields are required",
      });
    }

    // Generate Donor ID
    const Donor_ID = await generateId("donor", "DNR", 500001);

    // Create donor profile
    const donor = await Donor.create({
      Donor_ID,
      Donor_Name,
      Donor_Type,
      City,
      Location,
      Contact,
    });

    // ==================================================
    // LINK DONOR PROFILE TO LOGGED-IN USER
    // ==================================================

    if (req.user?._id) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          profileId: donor.Donor_ID,
        },
        {
          returnDocument: "after",
        },
      );
    }

    // Sync donors to Google Sheets
    await syncDonors();

    return res.status(201).json({
      success: true,
      message: "Donor created successfully",
      data: donor,
    });
  } catch (error) {
    console.error("❌ createDonor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create donor",
      error: error.message,
    });
  }
};

// PUT /api/donors/:id
const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      {
        Donor_ID: req.params.id,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    await syncDonors();

    return res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      data: donor,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid donor data",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update donor",
      error: error.message,
    });
  }
};

// DELETE /api/donors/:id
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findOneAndDelete({
      Donor_ID: req.params.id,
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    await syncDonors();

    return res.status(200).json({
      success: true,
      message: "Donor deleted successfully",
      data: donor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete donor",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
};
