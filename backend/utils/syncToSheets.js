const getSheets = require("../config/googleSheets");

const HEADERS = {
  Donors: [
    "Donor_ID",
    "Donor_Name",
    "Donor_Type",
    "City",
    "Location",
    "Contact",
    "Created_At",
  ],
  Donations: [
    "Donation_ID",
    "Donor_ID",
    "Food_Category",
    "Quantity_KG",
    "Location",
    "Expiry_Time",
    "Status",
    "Created_At",
  ],
  NGOs: [
    "NGO_ID",
    "NGO_Name",
    "City",
    "Location",
    "Capacity",
    "Service_Area",
    "Contact",
    "Created_At",
  ],
  Claims: [
    "Claim_ID",
    "Donation_ID",
    "NGO_ID",
    "Claim_Date",
    "Pickup_Status",
    "Delivery_Status",
    "Created_At",
  ],
};

const syncSheet = async (tabName, rows) => {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID; // ✅ read at call time
  const sheets = await getSheets();
  const headers = HEADERS[tabName];
  const values = [headers, ...rows];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A1`,
    valueInputOption: "RAW",
    requestBody: { values },
  });
};

module.exports = syncSheet;
