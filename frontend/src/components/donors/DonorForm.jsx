import { useEffect, useState } from "react";

import {
  Building2,
  CalendarClock,
  FileText,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Send,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

import { createDonor, getMe } from "../../services/api.js";

import MapPicker from "../common/MapPicker.jsx";

const initialForm = {
  Donor_Name: "",
  Donor_Type: "",
  City: "",
  Location: "",
  Contact: "",
};

const donorTypes = [
  "Restaurant",
  "Hotel",
  "Individual",
  "Catering",
  "Event",
  "Business",
  "Other",
];

const DonorForm = ({ onSuccess, onError }) => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState(initialForm);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    onError?.("");
  };

  const handleContactChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((previous) => ({
      ...previous,
      Contact: value,
    }));

    onError?.("");
  };

  const handleLocationSelect = (result) => {
    setFormData((previous) => ({
      ...previous,
      Location: result.address,
    }));

    onError?.("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.Donor_Name.trim()) {
      onError?.("Please enter donor name.");
      return;
    }

    if (!formData.Donor_Type) {
      onError?.("Please select donor type.");
      return;
    }

    if (!formData.City.trim()) {
      onError?.("Please enter city.");
      return;
    }

    if (!formData.Location.trim()) {
      onError?.("Please select a location on the map.");
      return;
    }

    if (formData.Contact.length !== 10) {
      onError?.("Contact number must be exactly 10 digits.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createDonor({
        Donor_Name: formData.Donor_Name.trim(),

        Donor_Type: formData.Donor_Type,

        City: formData.City.trim(),

        Location: formData.Location.trim(),

        Contact: formData.Contact,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to create donor profile.");
      }

      const donor = response?.data || response?.donor || response;

      const donorId = donor?.Donor_ID;

      if (!donorId) {
        throw new Error("Donor was created but Donor ID was not returned.");
      }

      // ==================================================
      // UPDATE AUTH CONTEXT IMMEDIATELY
      // ==================================================

      if (user) {
        updateUser({
          ...user,
          profileId: donorId,
        });
      }

      // ==================================================
      // CONFIRM FROM BACKEND
      // ==================================================

      try {
        const meData = await getMe();

        if (meData?.user) {
          updateUser(meData.user);
        }
      } catch (refreshError) {
        console.error("Failed to refresh user:", refreshError.message);
      }

      // ==================================================
      // RESET
      // ==================================================

      setFormData(initialForm);

      onSuccess?.(`Donor registered successfully! Your ID: ${donorId}`);
    } catch (error) {
      console.error("Donor registration error:", error);

      onError?.(error.message || "Unable to create donor profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* ==================================================
            DONOR NAME
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Donor Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Building2
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="Donor_Name"
              value={formData.Donor_Name}
              onChange={handleChange}
              placeholder="Enter donor name"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>
        </div>

        {/* ==================================================
            DONOR TYPE
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Donor Type
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            name="Donor_Type"
            value={formData.Donor_Type}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          >
            <option value="">Select donor type</option>

            {donorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* ==================================================
            CITY
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            City
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <MapPin
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleChange}
              placeholder="e.g. Noida"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>
        </div>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Contact Number
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="tel"
              name="Contact"
              value={formData.Contact}
              onChange={handleContactChange}
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10 digit number"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Enter exactly 10 digits.
          </p>
        </div>

        {/* ==================================================
            LOCATION
        ================================================== */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Location
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
      </div>

      {/* ==================================================
          INFO CARD
      ================================================== */}

      <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <CalendarClock size={19} className="mt-0.5 shrink-0 text-green-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Your donor profile
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Once registration is completed, your Donor ID will be
              automatically linked to your HelpingHands Kitchen account.
            </p>

            {user?.profileId && (
              <p className="mt-2 text-xs font-semibold text-green-700">
                Linked Donor ID: {user.profileId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          SUBMIT
      ================================================== */}

      <div className="flex justify-end border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Send size={18} />
              Register Donor
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DonorForm;
