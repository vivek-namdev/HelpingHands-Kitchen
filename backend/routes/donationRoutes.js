const express = require("express");

const {
  getDonations,
  getDonation,
  getAvailableDonations,
  createDonation,
  updateDonation,
  deleteDonation,
} = require("../controllers/donationController");

const router = express.Router();

router.get("/", getDonations);

router.get("/available", getAvailableDonations);

router.get("/:id", getDonation);

router.post("/", createDonation);

router.put("/:id", updateDonation);

router.delete("/:id", deleteDonation);

module.exports = router;
