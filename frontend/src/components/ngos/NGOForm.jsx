import { useState } from "react";

import {
  Building2,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Send,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

import { createNGO, getMe } from "../../services/api.js";

import MapPicker from "../common/MapPicker.jsx";

const initialForm = {
  NGO_Name: "",
  City: "",
  Location: "",
  Capacity: "",
  Service_Area: "",
  Contact: "",
};

const NGOForm = ({ onSuccess, onError }) => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState(initialForm);

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    onError?.("");
  };

  // =====================================================
  // CONTACT CHANGE
  // Maximum 10 digits
  // =====================================================

  const handleContactChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((previous) => ({
      ...previous,
      Contact: value,
    }));

    onError?.("");
  };

  // =====================================================
  // MAP LOCATION
  // =====================================================

  const handleLocationSelect = (result) => {
    setFormData((previous) => ({
      ...previous,
      Location: result.address,
    }));

    onError?.("");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // -----------------------------------------------------
    // NGO NAME
    // -----------------------------------------------------

    if (!formData.NGO_Name.trim()) {
      onError?.("Please enter NGO name.");
      return;
    }

    // -----------------------------------------------------
    // CITY
    // -----------------------------------------------------

    if (!formData.City.trim()) {
      onError?.("Please enter city.");
      return;
    }

    // -----------------------------------------------------
    // LOCATION
    // -----------------------------------------------------

    if (!formData.Location.trim()) {
      onError?.("Please select a location on the map.");
      return;
    }

    // -----------------------------------------------------
    // CAPACITY
    // -----------------------------------------------------

    if (!formData.Capacity || Number(formData.Capacity) <= 0) {
      onError?.("Please enter a valid capacity.");
      return;
    }

    // -----------------------------------------------------
    // SERVICE AREA
    // -----------------------------------------------------

    if (!formData.Service_Area.trim()) {
      onError?.("Please enter service area.");
      return;
    }

    // -----------------------------------------------------
    // CONTACT
    // -----------------------------------------------------

    if (formData.Contact.length !== 10) {
      onError?.("Contact number must be exactly 10 digits.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createNGO({
        NGO_Name: formData.NGO_Name.trim(),

        City: formData.City.trim(),

        Location: formData.Location.trim(),

        Capacity: Number(formData.Capacity),

        Service_Area: formData.Service_Area.trim(),

        Contact: formData.Contact,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to create NGO profile.");
      }

      // ===================================================
      // CREATED NGO
      // ===================================================

      const ngo = response?.data || response?.ngo || response;

      const ngoId = ngo?.NGO_ID;

      if (!ngoId) {
        throw new Error("NGO was created but NGO ID was not returned.");
      }

      // ===================================================
      // UPDATE USER IMMEDIATELY
      // ===================================================

      if (user) {
        updateUser({
          ...user,
          profileId: ngoId,
        });
      }

      // ===================================================
      // CONFIRM USER FROM BACKEND
      // ===================================================

      try {
        const meData = await getMe();

        if (meData?.user) {
          updateUser(meData.user);
        }
      } catch (refreshError) {
        console.error("Failed to refresh user:", refreshError.message);
      }

      // ===================================================
      // RESET
      // ===================================================

      setFormData(initialForm);

      // ===================================================
      // SUCCESS
      // ===================================================

      onSuccess?.(`NGO registered successfully! Your ID: ${ngoId}`);
    } catch (error) {
      console.error("NGO registration error:", error);

      onError?.(error.message || "Unable to create NGO profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* ==================================================
            NGO NAME
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            NGO Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Building2
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="NGO_Name"
              value={formData.NGO_Name}
              onChange={handleChange}
              placeholder="Enter NGO name"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
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
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
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
              <Navigation size={14} className="shrink-0 text-blue-500" />

              <span>{formData.Location}</span>
            </div>
          )}
        </div>

        {/* ==================================================
            CAPACITY
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Capacity
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <Users
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="number"
              name="Capacity"
              min="0"
              value={formData.Capacity}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* ==================================================
            SERVICE AREA
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Service Area
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            type="text"
            name="Service_Area"
            value={formData.Service_Area}
            onChange={handleChange}
            placeholder="e.g. Noida, Greater Noida"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
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
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Enter exactly 10 digits.
          </p>
        </div>
      </div>

      {/* ==================================================
          LINKED NGO INFO
      ================================================== */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Building2 size={19} className="mt-0.5 shrink-0 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Your NGO profile
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              After registration, your NGO ID will automatically be linked to
              your HelpingHands Kitchen account.
            </p>

            {user?.profileId && (
              <p className="mt-2 text-xs font-semibold text-blue-700">
                Linked NGO ID: {user.profileId}
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
          className="flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Send size={18} />
              Register NGO
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default NGOForm;
