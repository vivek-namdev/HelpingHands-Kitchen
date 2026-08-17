import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getClaims,
  updateClaim,
  updateDonationStatus,
} from "../../services/api.js";

import { useAuth } from "../../context/AuthContext.jsx";

import ClaimSummary from "../../components/claims/ClaimSummary.jsx";
import ClaimStatusTimeline from "../../components/claims/ClaimStatusTimeline.jsx";

const Claims = () => {
  const { user } = useAuth();

  const [claims, setClaims] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getClaims();

      setClaims(data.data || data.claims || []);
    } catch (err) {
      console.error("Fetch claims error:", err);

      setError(err.message || "Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filteredClaims = useMemo(() => {
    if (activeFilter === "All") {
      return claims;
    }

    if (activeFilter === "Pending") {
      return claims.filter((claim) => claim.Pickup_Status === "Pending");
    }

    if (activeFilter === "Picked Up") {
      return claims.filter(
        (claim) =>
          claim.Pickup_Status === "Picked Up" &&
          claim.Delivery_Status !== "Delivered",
      );
    }

    if (activeFilter === "Delivered") {
      return claims.filter((claim) => claim.Delivery_Status === "Delivered");
    }

    return claims;
  }, [claims, activeFilter]);

  // Mark donation as Picked Up / Delivered
  const handleStatusUpdate = async (claim, action) => {
    // Frontend guard
    const canUpdate =
      user?.role === "admin" || user?.profileId === claim.NGO_ID;

    if (!canUpdate) {
      setError("You can only update claims made by your NGO.");
      return;
    }

    try {
      setUpdatingId(claim.Claim_ID);
      setError("");

      if (action === "picked") {
        const data = await updateClaim(claim.Claim_ID, {
          Pickup_Status: "Picked Up",
        });

        const updatedClaim = data.data ||
          data.claim || {
            ...claim,
            Pickup_Status: "Picked Up",
          };

        setClaims((previousClaims) =>
          previousClaims.map((item) =>
            item.Claim_ID === claim.Claim_ID ? updatedClaim : item,
          ),
        );
      }

      if (action === "delivered") {
        const data = await updateClaim(claim.Claim_ID, {
          Delivery_Status: "Delivered",
        });

        await updateDonationStatus(claim.Donation_ID, "Delivered");

        const updatedClaim = data.data ||
          data.claim || {
            ...claim,
            Delivery_Status: "Delivered",
          };

        setClaims((previousClaims) =>
          previousClaims.map((item) =>
            item.Claim_ID === claim.Claim_ID
              ? {
                  ...item,
                  ...updatedClaim,
                  Delivery_Status: "Delivered",
                }
              : item,
          ),
        );
      }
    } catch (err) {
      console.error("Update claim error:", err);

      setError(err.message || "Failed to update claim");
    } finally {
      setUpdatingId(null);
    }
  };

  const filters = [
    {
      label: "All",
      icon: null,
    },
    {
      label: "Pending",
      icon: <AlertCircle size={15} />,
    },
    {
      label: "Picked Up",
      icon: <PackageCheck size={15} />,
    },
    {
      label: "Delivered",
      icon: <CheckCircle2 size={15} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-green-600">
            Donation Tracking
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Claims
          </h1>

          <p className="mt-1 text-gray-500">
            Track every donation from claim to delivery.
          </p>
        </div>

        <button
          onClick={fetchClaims}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <ClaimSummary claims={claims} />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} />

          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeFilter === filter.label
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-gray-900">Claim Tracking</h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredClaims.length} claim
            {filteredClaims.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="mt-4 text-sm text-gray-500">Loading claims...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <PackageCheck size={26} className="text-gray-400" />
            </div>

            <h3 className="font-semibold text-gray-900">No claims found</h3>

            <p className="mt-1 text-center text-sm text-gray-500">
              There are no claims matching this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Claim
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Donation
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    NGO
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Claim Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Timeline
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Pickup
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Delivery
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredClaims.map((claim) => {
                  const isUpdating = updatingId === claim.Claim_ID;

                  const isPending = claim.Pickup_Status === "Pending";

                  const isPickedUp = claim.Pickup_Status === "Picked Up";

                  const isDelivered = claim.Delivery_Status === "Delivered";

                  // Only this NGO or an admin may update this claim
                  const canUpdate =
                    user?.role === "admin" || user?.profileId === claim.NGO_ID;

                  return (
                    <tr
                      key={claim.Claim_ID}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      {/* Claim ID */}
                      <td className="px-6 py-5">
                        <span className="font-semibold text-gray-900">
                          {claim.Claim_ID}
                        </span>
                      </td>

                      {/* Donation ID */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                          {claim.Donation_ID}
                        </span>
                      </td>

                      {/* NGO ID */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {claim.NGO_ID}
                        </span>
                      </td>

                      {/* Claim Date */}
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-700">
                          {claim.Claim_Date
                            ? new Date(claim.Claim_Date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          {claim.Claim_Date
                            ? new Date(claim.Claim_Date).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="px-6 py-5">
                        <ClaimStatusTimeline claim={claim} />
                      </td>

                      {/* Pickup Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isPickedUp
                              ? "bg-orange-50 text-orange-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {claim.Pickup_Status}
                        </span>
                      </td>

                      {/* Delivery Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isDelivered
                              ? "bg-gray-100 text-gray-600"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {claim.Delivery_Status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        {!canUpdate ? (
                          <span className="text-xs font-medium text-gray-400">
                            View only
                          </span>
                        ) : isDelivered ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
                            <CheckCircle2 size={15} />
                            Completed
                          </span>
                        ) : isPending ? (
                          <button
                            onClick={() => handleStatusUpdate(claim, "picked")}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                              <PackageCheck size={15} />
                            )}
                            Mark Picked Up
                          </button>
                        ) : isPickedUp ? (
                          <button
                            onClick={() =>
                              handleStatusUpdate(claim, "delivered")
                            }
                            disabled={isUpdating}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                              <Truck size={15} />
                            )}
                            Mark Delivered
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;
