const express = require("express");

const { reverseGeocode } = require("../controllers/locationController.js");

const router = express.Router();

router.get("/reverse", reverseGeocode);

module.exports = router;
