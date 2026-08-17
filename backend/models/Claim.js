const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    Claim_ID: {
      type: String,
      required: true,
      unique: true,
    },

    Donation_ID: {
      type: String,
      required: true,
    },

    NGO_ID: {
      type: String,
      required: true,
    },

    Claim_Date: {
      type: Date,
      required: true,
    },

    Pickup_Status: {
      type: String,
      default: "Pending",
    },

    Delivery_Status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Claim", claimSchema);
