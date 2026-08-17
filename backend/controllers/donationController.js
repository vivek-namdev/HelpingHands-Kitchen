const Donation = require("../models/Donation.js");
const Donor = require("../models/Donor.js");
const syncSheet = require("../utils/syncToSheets.js");

const syncDonations = async () => {
  const all = await Donation.find().sort({
    createdAt: 1,
  });

  const rows = all.map((d) => [
    d.Donation_ID,
    d.Donor_ID,
    d.Food_Category,
    d.Quantity_KG,
    d.Location,
    d.Expiry_Time,
    d.Status,
    d.createdAt?.toISOString() ?? "",
  ]);

  await syncSheet("Donations", rows);
};

const generateDonationId = async () => {
  const lastDonation = await Donation.findOne()
    .sort({ Donation_ID: -1 })
    .lean();

  if (!lastDonation) {
    return "DON600001";
  }

  const lastNumber = parseInt(lastDonation.Donation_ID.replace("DON", ""), 10);

  return `DON${lastNumber + 1}`;
};

// GET /api/donations
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error("Get donations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};

// GET /api/donations/:id
const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      Donation_ID: req.params.id,
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    return res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error("Get donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation",
    });
  }
};

// GET /api/donations/available
const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      Status: "Available",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error("Get available donations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available donations",
    });
  }
};

// POST /api/donations
const createDonation = async (req, res) => {
  try {
    const {
      Donor_ID,
      Food_Category,
      Quantity_KG,
      Location,
      Latitude,
      Longitude,
      Available_From,
      Expiry_Time,
      Pickup_Instructions,
    } = req.body;

    if (
      !Donor_ID ||
      !Food_Category ||
      Quantity_KG === undefined ||
      Quantity_KG === null ||
      !Location ||
      !Available_From ||
      !Expiry_Time
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const donor = await Donor.findOne({
      Donor_ID,
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    const donationId = await generateDonationId();

    const donation = await Donation.create({
      Donation_ID: donationId,
      Donor_ID,
      Food_Category,
      Quantity_KG,
      Location,
      Latitude:
        Latitude !== undefined && Latitude !== null ? Number(Latitude) : null,
      Longitude:
        Longitude !== undefined && Longitude !== null
          ? Number(Longitude)
          : null,
      Available_From,
      Expiry_Time,
      Pickup_Instructions,
      Status: "Available",
    });

    try {
      await syncDonations();
    } catch (error) {
      console.error("⚠️ Sheets sync failed:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "Donation created successfully",
      donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create donation",
      error: error.message,
    });
  }
};

// PUT /api/donations/:id
const updateDonation = async (req, res) => {
  try {
    const existingDonation = await Donation.findOne({
      Donation_ID: req.params.id,
    });

    if (!existingDonation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (
      req.user.role === "donor" &&
      existingDonation.Donor_ID !== req.user.profileId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own donations.",
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        Donation_ID: req.params.id,
      },
      {
        Status: req.body.Status,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    try {
      await syncDonations();
    } catch (error) {
      console.error("⚠️ Sheets sync failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      donation,
    });
  } catch (error) {
    console.error("Update donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update donation",
    });
  }
};

// DELETE /api/donations/:id
const deleteDonation = async (req, res) => {
  try {
    const existingDonation = await Donation.findOne({
      Donation_ID: req.params.id,
    });

    if (!existingDonation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (
      req.user.role === "donor" &&
      existingDonation.Donor_ID !== req.user.profileId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own donations.",
      });
    }

    const donation = await Donation.findOneAndDelete({
      Donation_ID: req.params.id,
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    try {
      await syncDonations();
    } catch (error) {
      console.error("⚠️ Sheets sync failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Donation deleted successfully",
    });
  } catch (error) {
    console.error("Delete donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete donation",
    });
  }
};

module.exports = {
  getDonations,
  getDonation,
  getAvailableDonations,
  createDonation,
  updateDonation,
  deleteDonation,
};
