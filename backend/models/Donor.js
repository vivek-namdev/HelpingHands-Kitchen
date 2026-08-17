const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    Donor_ID: {
      type: String,
      unique: true,
      required: true,
      match: /^DNR\d{6}$/,
    },

    Donor_Name: {
      type: String,
      required: true,
      trim: true,
    },

    Donor_Type: {
      type: String,
      required: true,
      trim: true,
    },

    City: {
      type: String,
      required: true,
      trim: true,
    },

    Location: {
      type: String,
      required: true,
      trim: true,
    },

    Contact: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Donor", donorSchema);
