import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE_URL = "http://localhost:5000/api";

const INDIA_CENTER = [20.5937, 78.9629];

const MapCenterController = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      return;
    }

    map.flyTo(position, 16, {
      duration: 1.2,
    });
  }, [position, map]);

  return null;
};

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect(event.latlng);
    },
  });

  return null;
};

const MapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const [address, setAddress] = useState("");

  const [detecting, setDetecting] = useState(true);

  const [fetchingAddress, setFetchingAddress] = useState(false);

  const [error, setError] = useState("");

  const fetchAddress = async (lat, lng) => {
    try {
      setFetchingAddress(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/location/reverse?lat=${encodeURIComponent(
          lat,
        )}&lon=${encodeURIComponent(lng)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch address.");
      }

      const selectedAddress =
        data.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      setAddress(selectedAddress);

      onLocationSelect({
        address: selectedAddress,
        lat,
        lng,
      });
    } catch (err) {
      console.error("Address fetch error:", err);

      const fallbackAddress = `Latitude ${lat.toFixed(
        6,
      )}, Longitude ${lng.toFixed(6)}`;

      setAddress(fallbackAddress);

      setError(
        "Address lookup failed, but the selected coordinates were detected.",
      );

      onLocationSelect({
        address: fallbackAddress,
        lat,
        lng,
      });
    } finally {
      setFetchingAddress(false);
    }
  };

  const selectLocation = async ({ lat, lng }) => {
    setPosition([lat, lng]);

    await fetchAddress(lat, lng);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setDetecting(false);

      setError("Geolocation is not supported by your browser.");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const lat = location.coords.latitude;

        const lng = location.coords.longitude;

        setDetecting(false);

        await selectLocation({
          lat,
          lng,
        });
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);

        setDetecting(false);

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(
            "Location permission was denied. Click the map manually to select a location.",
          );
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError(
            "Current location is unavailable. Click the map manually to select a location.",
          );
        } else {
          setError(
            "Could not determine your current location. Click the map manually to select a location.",
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400">
        Click anywhere on the map to select location
      </p>

      <div className="relative overflow-hidden rounded-xl border border-gray-200">
        <MapContainer
          center={INDIA_CENTER}
          zoom={5}
          scrollWheelZoom
          className="h-[280px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenterController position={position} />

          <MapClickHandler onSelect={selectLocation} />

          {position && (
            <Marker position={position}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Selected Location</p>

                  <p className="mt-1 text-gray-600">
                    {address || "Loading address..."}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {detecting && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-lg">
              Detecting your current location...
            </div>
          </div>
        )}
      </div>

      {fetchingAddress && (
        <p className="text-sm text-gray-500">Fetching your address...</p>
      )}

      {!fetchingAddress && address && (
        <p className="text-sm font-medium text-green-600">
          Selected: {address}
        </p>
      )}

      {error && (
        <div className="rounded-xl bg-orange-50 px-4 py-3 text-xs text-orange-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default MapPicker;
