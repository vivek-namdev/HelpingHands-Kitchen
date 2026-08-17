const NGO = require("../models/NGO.js");
const User = require("../models/User.js");
const generateId = require("../utils/generateId.js");
const syncSheet = require("../utils/syncToSheets.js");

const syncNGOs = async () => {
  const all = await NGO.find().sort({ createdAt: 1 });

  const rows = all.map((n) => [
    n.NGO_ID,
    n.NGO_Name,
    n.City,
    n.Location,
    n.Capacity,
    n.Service_Area,
    n.Contact,
    n.createdAt?.toISOString() ?? "",
  ]);

  await syncSheet("NGOs", rows);
};

// GET /api/ngos
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch NGOs",
      error: error.message,
    });
  }
};

// GET /api/ngos/:id
const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findOne({
      NGO_ID: req.params.id,
    });

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: ngo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch NGO",
      error: error.message,
    });
  }
};

// POST /api/ngos
const createNGO = async (req, res) => {
  try {
    const { NGO_Name, City, Location, Capacity, Service_Area, Contact } =
      req.body;

    if (
      !NGO_Name ||
      !City ||
      !Location ||
      Capacity === undefined ||
      !Service_Area ||
      !Contact
    ) {
      return res.status(400).json({
        success: false,
        message: "All NGO fields are required",
      });
    }

    if (Number(Capacity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity cannot be negative",
      });
    }

    const NGO_ID = await generateId("ngo", "NGO", 700001);

    const ngo = await NGO.create({
      NGO_ID,
      NGO_Name,
      City,
      Location,
      Capacity,
      Service_Area,
      Contact,
    });

    // Link the newly created NGO profile to the logged-in user
    if (req.user?._id) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          profileId: ngo.NGO_ID,
        },
        {
          new: true,
        },
      );
    }

    try {
      await syncNGOs();
    } catch (e) {
      console.error("⚠️ Sheets sync failed:", e.message);
    }

    return res.status(201).json({
      success: true,
      message: "NGO created successfully",
      data: ngo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create NGO",
      error: error.message,
    });
  }
};

// PUT /api/ngos/:id
const updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOneAndUpdate(
      {
        NGO_ID: req.params.id,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    try {
      await syncNGOs();
    } catch (e) {
      console.error("⚠️ Sheets sync failed:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "NGO updated successfully",
      data: ngo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid NGO data",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update NGO",
      error: error.message,
    });
  }
};

// DELETE /api/ngos/:id
const deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOneAndDelete({
      NGO_ID: req.params.id,
    });

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    try {
      await syncNGOs();
    } catch (e) {
      console.error("⚠️ Sheets sync failed:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "NGO deleted successfully",
      data: ngo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete NGO",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNGOs,
  getNGOById,
  createNGO,
  updateNGO,
  deleteNGO,
};
