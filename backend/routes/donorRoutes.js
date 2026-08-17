const express = require("express");

const {
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
} = require("../controllers/donorController");

const router = express.Router();

router.get("/", getAllDonors);

router.get("/:id", getDonorById);

router.post("/", createDonor);

router.put("/:id", updateDonor);

router.delete("/:id", deleteDonor);

module.exports = router;
