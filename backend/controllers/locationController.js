const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?lat=${encodeURIComponent(latitude)}` +
      `&lon=${encodeURIComponent(longitude)}` +
      `&format=jsonv2` +
      `&addressdetails=1` +
      `&accept-language=en`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "HelpingHands Kitchen/1.0 (Food redistribution application)",
      },
    });

    if (!response.ok) {
      const text = await response.text();

      console.error("Nominatim response:", response.status, text);

      return res.status(502).json({
        success: false,
        message: "Unable to fetch address from map service.",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      address:
        data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      latitude,
      longitude,
      raw: data,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch location information.",
      error: error.message,
    });
  }
};

module.exports = {
  reverseGeocode,
};
