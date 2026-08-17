const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    NGO_ID: {
      type: String,
      unique: true,
      required: true,
      match: /^NGO\d{6}$/,
    },

    NGO_Name: {
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

    Capacity: {
      type: Number,
      required: true,
      min: 0,
    },

    Service_Area: {
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

module.exports = mongoose.model("NGO", ngoSchema);
