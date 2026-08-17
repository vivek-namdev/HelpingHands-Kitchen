const express = require("express");

const {
  getAllNGOs,
  getNGOById,
  createNGO,
  updateNGO,
  deleteNGO,
} = require("../controllers/ngoController");

const router = express.Router();

router.get("/", getAllNGOs);

router.get("/:id", getNGOById);

router.post("/", createNGO);

router.put("/:id", updateNGO);

router.delete("/:id", deleteNGO);

module.exports = router;
