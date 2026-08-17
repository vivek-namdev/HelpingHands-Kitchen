const Claim = require("../models/Claim.js");
const Donation = require("../models/Donation.js");
const NGO = require("../models/NGO.js");
const User = require("../models/User.js");

const generateId = require("../utils/generateId.js");
const syncSheet = require("../utils/syncToSheets.js");

const sendEmail = require("../utils/sendEmail.js");
const { donationClaimedEmail } = require("../utils/emailTemplates.js");

const syncClaims = async () => {
  const all = await Claim.find().sort({
    createdAt: 1,
  });

  const rows = all.map((c) => [
    c.Claim_ID,
    c.Donation_ID,
    c.NGO_ID,
    c.Claim_Date?.toISOString() ?? "",
    c.Pickup_Status,
    c.Delivery_Status,
    c.createdAt?.toISOString() ?? "",
  ]);

  await syncSheet("Claims", rows);
};

// GET /api/claims
const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    console.error("Get all claims error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch claims",
      error: error.message,
    });
  }
};

// GET /api/claims/:id
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findOne({
      Claim_ID: req.params.id,
    });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error("Get claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch claim",
      error: error.message,
    });
  }
};

// POST /api/claims
const createClaim = async (req, res) => {
  try {
    const { Donation_ID, NGO_ID, Claim_Date } = req.body;

    if (!Donation_ID || !NGO_ID) {
      return res.status(400).json({
        success: false,
        message: "Donation_ID and NGO_ID are required",
      });
    }

    const donation = await Donation.findOne({
      Donation_ID,
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (donation.Status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Only available donations can be claimed",
      });
    }

    const ngo = await NGO.findOne({
      NGO_ID,
    });
    if (req.user.role === "ngo" && NGO_ID !== req.user.profileId) {
      return res.status(403).json({
        success: false,
        message: "You can only claim donations using your own NGO profile.",
      });
    }
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    const existingClaim = await Claim.findOne({
      Donation_ID,
      Pickup_Status: {
        $ne: "Cancelled",
      },
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: "This donation has already been claimed",
      });
    }

    const Claim_ID = await generateId("claim", "CLM", 800001);

    const claim = await Claim.create({
      Claim_ID,
      Donation_ID,
      NGO_ID,
      Claim_Date: Claim_Date || new Date(),
      Pickup_Status: "Pending",
      Delivery_Status: "Pending",
    });

    // Mark donation as claimed
    donation.Status = "Claimed";

    await donation.save();

    // ======================================================
    // EMAIL NOTIFICATION TO DONOR
    // ======================================================

    try {
      // Find the User account linked to the donor profile.
      const donorUser = await User.findOne({
        profileId: donation.Donor_ID,
      });

      if (donorUser) {
        const emailContent = donationClaimedEmail({
          donorName: donorUser.name,
          donationId: donation.Donation_ID,
          foodCategory: donation.Food_Category,
          quantityKg: donation.Quantity_KG,
          ngoName: ngo.NGO_Name,
        });

        await sendEmail({
          to: donorUser.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log("✅ Claim notification email sent to:", donorUser.email);
      } else {
        console.log("⚠️ No User account found for donor:", donation.Donor_ID);
      }
    } catch (emailErr) {
      console.error("⚠️ Email notification failed:", emailErr.message);

      // IMPORTANT:
      // Do not fail the claim request because
      // the email failed.
    }

    // ======================================================
    // SYNC CLAIMS
    // ======================================================

    try {
      await syncClaims();
    } catch (e) {
      console.error("⚠️ Claims sync failed:", e.message);
    }

    // ======================================================
    // SYNC DONATIONS
    // ======================================================

    try {
      await syncSheet("Donations", await getDonationRows());
    } catch (e) {
      console.error("⚠️ Donations sync failed:", e.message);
    }

    return res.status(201).json({
      success: true,
      message: "Claim created successfully",
      data: claim,
    });
  } catch (error) {
    console.error("Create claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create claim",
      error: error.message,
    });
  }
};

// PUT /api/claims/:id
const updateClaimStatus = async (req, res) => {
  try {
    const { Pickup_Status, Delivery_Status } = req.body;

    if (!Pickup_Status && !Delivery_Status) {
      return res.status(400).json({
        success: false,
        message: "Pickup_Status or Delivery_Status is required",
      });
    }

    const allowedPickupStatuses = [
      "Pending",
      "Scheduled",
      "Picked Up",
      "Cancelled",
    ];

    const allowedDeliveryStatuses = [
      "Pending",
      "In Transit",
      "Delivered",
      "Cancelled",
    ];

    if (Pickup_Status && !allowedPickupStatuses.includes(Pickup_Status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pickup_Status",
      });
    }

    if (Delivery_Status && !allowedDeliveryStatuses.includes(Delivery_Status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Delivery_Status",
      });
    }

    const existingClaim = await Claim.findOne({
      Claim_ID: req.params.id,
    });
    if (
      req.user.role === "ngo" &&
      existingClaim.NGO_ID !== req.user.profileId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update claims made by your NGO.",
      });
    }

    if (!existingClaim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    const updateData = {};

    if (Pickup_Status) {
      updateData.Pickup_Status = Pickup_Status;
    }

    if (Delivery_Status) {
      updateData.Delivery_Status = Delivery_Status;
    }

    const claim = await Claim.findOneAndUpdate(
      {
        Claim_ID: req.params.id,
      },
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (Pickup_Status === "Picked Up") {
      await Donation.findOneAndUpdate(
        {
          Donation_ID: claim.Donation_ID,
        },
        {
          Status: "Picked Up",
        },
      );
    }

    if (Delivery_Status === "Delivered") {
      await Donation.findOneAndUpdate(
        {
          Donation_ID: claim.Donation_ID,
        },
        {
          Status: "Delivered",
        },
      );
    }

    // Sync claims
    try {
      await syncClaims();
    } catch (e) {
      console.error("⚠️ Claims sync failed:", e.message);
    }

    // Sync donations
    try {
      await syncSheet("Donations", await getDonationRows());
    } catch (e) {
      console.error("⚠️ Donations sync failed:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "Claim status updated successfully",
      data: claim,
    });
  } catch (error) {
    console.error("Update claim status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update claim status",
      error: error.message,
    });
  }
};

// DELETE /api/claims/:id
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findOneAndDelete({
      Claim_ID: req.params.id,
    });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    try {
      await syncClaims();
    } catch (e) {
      console.error("⚠️ Sheets sync failed:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "Claim deleted successfully",
    });
  } catch (error) {
    console.error("Delete claim error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete claim",
      error: error.message,
    });
  }
};

// ======================================================
// HELPER
// ======================================================

const getDonationRows = async () => {
  const all = await Donation.find().sort({
    createdAt: 1,
  });

  return all.map((d) => [
    d.Donation_ID,
    d.Donor_ID,
    d.Food_Category,
    d.Quantity_KG,
    d.Location,
    d.Expiry_Time,
    d.Status,
    d.createdAt?.toISOString() ?? "",
  ]);
};

module.exports = {
  getAllClaims,
  getClaimById,
  createClaim,
  updateClaimStatus,
  deleteClaim,
};
