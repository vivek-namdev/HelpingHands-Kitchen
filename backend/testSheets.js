require("dotenv").config();
const getSheets = require("./config/googleSheets.js");

const test = async () => {
  try {
    // handles both export styles
    const sheetsClient =
      typeof getSheets === "function"
        ? await getSheets()
        : await getSheets.default();

    const res = await sheetsClient.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    console.log("✅ Connected! Sheet name:", res.data.properties.title);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
};

test();
