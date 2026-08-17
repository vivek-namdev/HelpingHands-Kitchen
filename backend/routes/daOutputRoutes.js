const express = require("express");
const router = express.Router();
const getSheets = require("../config/googleSheets");

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// GET /api/da-output
router.get("/", async (req, res) => {
  try {
    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "DA_Output!A1:Z1000",
    });

    const [headers, ...rows] = response.data.values || [];

    const data = rows.map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])),
    );

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch DA output",
      error: error.message,
    });
  }
});

module.exports = router;
