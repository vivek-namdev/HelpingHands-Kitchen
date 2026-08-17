import { useState } from "react";

import { AlertCircle, Building2, CheckCircle2, Loader2, X } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

import { createClaim, getMe } from "../../services/api.js";

const ClaimModal = ({ donation, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const [refreshingUser, setRefreshingUser] = useState(false);

  const [error, setError] = useState("");

  const ngoId = user?.profileId || null;

  // =====================================================
  // REFRESH NGO PROFILE
  // =====================================================

  const refreshUserProfile = async () => {
    try {
      setRefreshingUser(true);

      const meData = await getMe();

      if (meData?.user) {
        updateUser(meData.user);

        return meData.user.profileId || null;
      }

      return null;
    } catch (refreshError) {
      console.error("Failed to refresh NGO profile:", refreshError);

      return null;
    } finally {
      setRefreshingUser(false);
    }
  };

  // =====================================================
  // CLAIM
  // =====================================================

  const handleClaim = async () => {
    if (!donation?.Donation_ID) {
      setError("Donation ID is missing.");
      return;
    }

    try {
      setSubmitting(true);

      setError("");

      let currentNgoId = user?.profileId || null;

      // Refresh user only when the
      // profile ID is not currently available.
      if (!currentNgoId) {
        currentNgoId = await refreshUserProfile();
      }

      if (!currentNgoId) {
        setError(
          "Please complete your NGO Registration before claiming donations.",
        );

        return;
      }

      const response = await createClaim({
        Donation_ID: donation.Donation_ID,

        NGO_ID: currentNgoId,

        Claim_Date: new Date().toISOString(),
      });

      const claim = response?.data || response?.claim || response;

      const claimId = claim?.Claim_ID || "Created successfully";

      onSuccess?.(`Donation claimed successfully! Claim ID: ${claimId}`);
    } catch (err) {
      console.error("Claim error:", err);

      setError(err.message || "Failed to claim donation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!donation) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              HelpingHands Kitchen
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Claim Donation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Claim this donation for your NGO.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            DONATION INFORMATION
        ================================================= */}

        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-green-600">
                  Donation ID
                </p>

                <p className="font-bold text-slate-900">
                  {donation.Donation_ID}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Food</p>

                <p className="text-sm font-semibold text-slate-800">
                  {donation.Food_Category}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Quantity</p>

                <p className="text-sm font-semibold text-slate-800">
                  {donation.Quantity_KG} KG
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            NGO PROFILE
        ================================================= */}

        {ngoId ? (
          <div className="px-6 py-5">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Claiming as
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Building2 size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "NGO User"}
                </p>

                <p className="text-xs font-medium text-blue-600">{ngoId}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
              <AlertCircle size={30} className="text-orange-500" />
            </div>

            <p className="mt-3 font-semibold text-slate-900">
              NGO profile not linked
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Please complete your NGO Registration before claiming donations.
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mx-6 mb-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting || refreshingUser}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleClaim}
            disabled={!ngoId || submitting || refreshingUser}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/15 transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting || refreshingUser ? (
              <>
                <Loader2 size={17} className="animate-spin" />

                {refreshingUser ? "Checking profile..." : "Claiming..."}
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Confirm Claim
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
