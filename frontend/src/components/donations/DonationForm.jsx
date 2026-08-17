import { useEffect, useState } from "react";

import {
  Building2,
  CalendarClock,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Scale,
  Send,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

import { createDonation, getDonors } from "../../services/api.js";

import MapPicker from "../common/MapPicker.jsx";

// ======================================================
// CURRENT LOCAL DATE + TIME
// ======================================================

const getCurrentDateTimeLocal = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");

  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ======================================================
// INITIAL FORM
// ======================================================

const getInitialForm = (donorId = "") => ({
  Donor_ID: donorId,

  Food_Category: "",

  Quantity_KG: "",

  Location: "",

  Latitude: null,

  Longitude: null,

  Available_From: getCurrentDateTimeLocal(),

  Expiry_Hours: "",

  Pickup_Instructions: "",
});

// ======================================================
// FOOD CATEGORIES
// ======================================================

const foodCategories = [
  "Cooked Meals",
  "Raw Vegetables",
  "Fruits",
  "Bakery",
  "Dairy",
  "Other",
];

// ======================================================
// COMPONENT
// ======================================================

const DonationForm = ({ onSuccess, onError }) => {
  const { user } = useAuth();

  const isDonor = user?.role === "donor";

  const isAdmin = user?.role === "admin";

  const donorProfileId = user?.profileId || "";

  const [formData, setFormData] = useState(() =>
    getInitialForm(isDonor ? donorProfileId : ""),
  );

  const [donors, setDonors] = useState([]);

  const [loadingDonors, setLoadingDonors] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [expiryPreview, setExpiryPreview] = useState("");

  // ======================================================
  // KEEP DONOR ID IN SYNC
  // ======================================================

  useEffect(() => {
    if (isDonor) {
      setFormData((previous) => ({
        ...previous,
        Donor_ID: donorProfileId,
      }));
    }
  }, [isDonor, donorProfileId]);

  // ======================================================
  // FETCH DONORS
  // ONLY ADMIN NEEDS THIS
  // ======================================================

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const fetchDonors = async () => {
      try {
        setLoadingDonors(true);

        const response = await getDonors();

        const donorList = response?.donors || response?.data || response;

        setDonors(Array.isArray(donorList) ? donorList : []);
      } catch (error) {
        console.error("Fetch donors error:", error);

        onError?.(error.message || "Unable to load donors.");
      } finally {
        setLoadingDonors(false);
      }
    };

    fetchDonors();
  }, [isAdmin, onError]);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // MAP LOCATION
  // ======================================================

  const handleLocationSelect = (result) => {
    setFormData((previous) => ({
      ...previous,
      Location: result.address,

      Latitude: result.lat,

      Longitude: result.lng,
    }));
  };

  // ======================================================
  // EXPIRY PREVIEW
  // ======================================================

  useEffect(() => {
    if (
      !formData.Available_From ||
      !formData.Expiry_Hours ||
      Number(formData.Expiry_Hours) <= 0
    ) {
      setExpiryPreview("");

      return;
    }

    const availableFrom = new Date(formData.Available_From);

    if (Number.isNaN(availableFrom.getTime())) {
      setExpiryPreview("");

      return;
    }

    const expiryTime = new Date(
      availableFrom.getTime() + Number(formData.Expiry_Hours) * 60 * 60 * 1000,
    );

    setExpiryPreview(
      expiryTime.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    );
  }, [formData.Available_From, formData.Expiry_Hours]);

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------
    // DONOR ID
    // --------------------------------------------------

    if (!formData.Donor_ID) {
      if (isDonor) {
        onError?.(
          "Please complete your Donor Registration before creating a donation.",
        );
      } else {
        onError?.("Please select a donor.");
      }

      return;
    }

    // --------------------------------------------------
    // FOOD CATEGORY
    // --------------------------------------------------

    if (!formData.Food_Category) {
      onError?.("Please select a food category.");

      return;
    }

    // --------------------------------------------------
    // QUANTITY
    // --------------------------------------------------

    if (!formData.Quantity_KG || Number(formData.Quantity_KG) <= 0) {
      onError?.("Please enter a valid quantity.");

      return;
    }

    // --------------------------------------------------
    // LOCATION
    // --------------------------------------------------

    if (!formData.Location || !formData.Location.trim()) {
      onError?.("Please select a pickup location on the map.");

      return;
    }

    // --------------------------------------------------
    // COORDINATES
    // --------------------------------------------------

    if (
      formData.Latitude === null ||
      formData.Latitude === undefined ||
      formData.Longitude === null ||
      formData.Longitude === undefined
    ) {
      onError?.("Please select a location on the map.");

      return;
    }

    // --------------------------------------------------
    // AVAILABLE FROM
    // --------------------------------------------------

    if (!formData.Available_From) {
      onError?.("Please select when the food is available.");

      return;
    }

    const availableFrom = new Date(formData.Available_From);

    if (Number.isNaN(availableFrom.getTime())) {
      onError?.("Please select a valid date and time.");

      return;
    }

    if (availableFrom.getTime() < Date.now()) {
      onError?.("Available From cannot be in the past.");

      return;
    }

    // --------------------------------------------------
    // EXPIRY
    // --------------------------------------------------

    if (!formData.Expiry_Hours || Number(formData.Expiry_Hours) <= 0) {
      onError?.("Please enter a valid expiry duration.");

      return;
    }

    try {
      setSubmitting(true);

      const expiryTime = new Date(
        availableFrom.getTime() +
          Number(formData.Expiry_Hours) * 60 * 60 * 1000,
      );

      // Donor can ONLY use their own profileId.
      // Admin can use the selected donor.

      const finalDonorId = isDonor ? user?.profileId : formData.Donor_ID;

      if (!finalDonorId) {
        throw new Error(
          "Please complete your Donor Registration before creating a donation.",
        );
      }

      const payload = {
        Donor_ID: finalDonorId,

        Food_Category: formData.Food_Category,

        Quantity_KG: Number(formData.Quantity_KG),

        Location: formData.Location.trim(),

        Latitude: Number(formData.Latitude),

        Longitude: Number(formData.Longitude),

        Available_From: availableFrom.toISOString(),

        Expiry_Time: expiryTime.toISOString(),

        Pickup_Instructions: formData.Pickup_Instructions.trim(),
      };

      console.log("Creating donation:", payload);

      const response = await createDonation(payload);

      const donation = response?.donation || response?.data || response;

      const donationId = donation?.Donation_ID || "Created successfully";

      // Keep donor's profile ID after reset.
      setFormData(getInitialForm(isDonor ? user?.profileId || "" : ""));

      setExpiryPreview("");

      onSuccess?.(`Donation created successfully! Donation ID: ${donationId}`);
    } catch (error) {
      console.error("Create donation error:", error);

      onError?.(error.message || "Unable to create donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* =================================================
            DONOR
        ================================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Donor
            <span className="ml-1 text-red-500">*</span>
          </label>

          {isDonor ? (
            <>
              <div className="relative">
                <Building2
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <div className="flex h-12 w-full items-center rounded-xl border border-green-200 bg-green-50 pl-11 pr-4 text-sm font-semibold text-green-700">
                  {user?.name
                    ? `${user.name} (${user.profileId || "No Donor ID"})`
                    : "Complete donor registration first"}
                </div>
              </div>

              {!user?.profileId && (
                <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                  Please complete your Donor Registration before creating a
                  donation.
                  <a
                    href="/donor/register"
                    className="ml-1 font-semibold underline"
                  >
                    Complete Registration
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <Building2
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                name="Donor_ID"
                value={formData.Donor_ID}
                onChange={handleChange}
                disabled={loadingDonors}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {loadingDonors
                    ? "Loading donors..."
                    : donors.length === 0
                      ? "No donors registered"
                      : "Select donor"}
                </option>

                {donors.map((donor) => (
                  <option
                    key={donor.Donor_ID || donor._id}
                    value={donor.Donor_ID}
                  >
                    {donor.Donor_Name} ({donor.Donor_ID})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* =================================================
            FOOD CATEGORY
        ================================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Food Category
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Package
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-500"
            />

            <select
              name="Food_Category"
              value={formData.Food_Category}
              onChange={handleChange}
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            >
              <option value="">Select food category</option>

              {foodCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =================================================
            QUANTITY
        ================================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Quantity (KG)
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Scale
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="number"
              name="Quantity_KG"
              min="0"
              step="0.1"
              value={formData.Quantity_KG}
              onChange={handleChange}
              placeholder="e.g. 25"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>
        </div>

        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Location
            <span className="ml-1 text-red-500">*</span>
          </label>

          <MapPicker onLocationSelect={handleLocationSelect} />

          {formData.Location && (
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <Navigation size={14} className="shrink-0 text-green-500" />

              <span>{formData.Location}</span>
            </div>
          )}
        </div>

        {/* =================================================
            AVAILABLE FROM
        ================================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Available From
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <CalendarClock
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="datetime-local"
              name="Available_From"
              value={formData.Available_From}
              min={getCurrentDateTimeLocal()}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Current date and time is selected by default.
          </p>
        </div>

        {/* =================================================
            EXPIRY
        ================================================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Expiry Duration (Hours)
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Clock3
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="number"
              name="Expiry_Hours"
              min="1"
              step="1"
              value={formData.Expiry_Hours}
              onChange={handleChange}
              placeholder="e.g. 6"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>

          {expiryPreview && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600">
              <Clock3 size={13} />
              Expires at: {expiryPreview}
            </p>
          )}
        </div>

        {/* =================================================
            PICKUP INSTRUCTIONS
        ================================================= */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Instructions
          </label>

          <div className="relative">
            <FileText
              size={18}
              className="pointer-events-none absolute left-4 top-4 text-slate-400"
            />

            <textarea
              name="Pickup_Instructions"
              value={formData.Pickup_Instructions}
              onChange={handleChange}
              rows={4}
              placeholder="Add instructions for the NGO or pickup partner..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>
        </div>
      </div>

      {/* =================================================
          SUBMIT
      ================================================= */}

      <div className="mt-7 flex justify-end border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={submitting || (isDonor && !user?.profileId)}
          className="flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Send size={18} />
              Create Donation
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DonationForm;
