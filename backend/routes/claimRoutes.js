const express = require("express");

const {
  getAllClaims,
  getClaimById,
  createClaim,
  updateClaimStatus,
  deleteClaim,
} = require("../controllers/claimController");

const router = express.Router();

router.get("/", getAllClaims);

router.get("/:id", getClaimById);

router.post("/", createClaim);

router.put("/:id", updateClaimStatus);

router.delete("/:id", deleteClaim);

module.exports = router;
