const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    Donation_ID: {
      type: String,
      unique: true,
      required: true,
    },

    Donor_ID: {
      type: String,
      required: true,
    },

    Food_Category: {
      type: String,
      required: true,
    },

    Quantity_KG: {
      type: Number,
      required: true,
      min: 0,
    },

    Location: {
      type: String,
      required: true,
    },

    Latitude: {
      type: Number,
      default: null,
    },

    Longitude: {
      type: Number,
      default: null,
    },

    Available_From: {
      type: Date,
      required: true,
    },

    Expiry_Time: {
      type: Date,
      required: true,
    },

    Pickup_Instructions: {
      type: String,
      default: "",
    },

    Status: {
      type: String,
      enum: ["Available", "Claimed", "Picked Up", "Delivered", "Expired"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Donation", donationSchema);
