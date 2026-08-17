import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { getClaims, updateClaim } from "../services/api";
import { updateDonationStatus } from "../services/api";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // FETCH CLAIMS
  // =========================
  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getClaims();

      // Your backend returns:
      // { success: true, count: ..., data: [...] }

      setClaims(response.data || []);
    } catch (err) {
      console.error("Fetch claims error:", err);

      setError(err.message || "Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredClaims = useMemo(() => {
    if (filter === "All") {
      return claims;
    }

    if (filter === "Pending") {
      return claims.filter(
        (claim) =>
          claim.Pickup_Status === "Pending" &&
          claim.Delivery_Status === "Pending",
      );
    }

    if (filter === "Picked Up") {
      return claims.filter(
        (claim) =>
          claim.Pickup_Status === "Picked Up" &&
          claim.Delivery_Status !== "Delivered",
      );
    }

    if (filter === "Delivered") {
      return claims.filter((claim) => claim.Delivery_Status === "Delivered");
    }

    return claims;
  }, [claims, filter]);

  // =========================
  // MARK PICKED UP
  // =========================
  const handlePickedUp = async (claim) => {
    try {
      setUpdatingId(claim.Claim_ID);
      setError("");

      const response = await updateClaim(claim.Claim_ID, {
        Pickup_Status: "Picked Up",
      });

      const updatedClaim = response.data;

      // Update UI instantly
      setClaims((prevClaims) =>
        prevClaims.map((item) =>
          item.Claim_ID === claim.Claim_ID ? updatedClaim : item,
        ),
      );

      // Update donation status
      await updateDonationStatus(claim.Donation_ID, "Picked Up");
    } catch (err) {
      console.error("Mark picked up error:", err);

      setError(err.message || "Failed to mark donation as picked up.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // MARK DELIVERED
  // =========================
  const handleDelivered = async (claim) => {
    try {
      setUpdatingId(claim.Claim_ID);
      setError("");

      const response = await updateClaim(claim.Claim_ID, {
        Delivery_Status: "Delivered",
      });

      const updatedClaim = response.data;

      // Update UI instantly
      setClaims((prevClaims) =>
        prevClaims.map((item) =>
          item.Claim_ID === claim.Claim_ID ? updatedClaim : item,
        ),
      );

      // Update donation
      await updateDonationStatus(claim.Donation_ID, "Delivered");
    } catch (err) {
      console.error("Mark delivered error:", err);

      setError(err.message || "Failed to mark donation as delivered.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // SUMMARY
  // =========================
  const totalClaims = claims.length;

  const pendingClaims = claims.filter(
    (claim) =>
      claim.Pickup_Status === "Pending" && claim.Delivery_Status === "Pending",
  ).length;

  const pickedUpClaims = claims.filter(
    (claim) =>
      claim.Pickup_Status === "Picked Up" &&
      claim.Delivery_Status !== "Delivered",
  ).length;

  const deliveredClaims = claims.filter(
    (claim) => claim.Delivery_Status === "Delivered",
  ).length;

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
              <Truck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Claims Tracking
              </h1>

              <p className="text-sm text-gray-500">
                Track food pickups and deliveries from claim to completion.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchClaims}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-600"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total */}
        <SummaryCard
          icon={PackageCheck}
          label="Total Claims"
          value={totalClaims}
          iconClass="bg-green-100 text-green-600"
        />

        {/* Pending */}
        <SummaryCard
          icon={Clock3}
          label="Pending"
          value={pendingClaims}
          iconClass="bg-orange-100 text-orange-600"
        />

        {/* Picked Up */}
        <SummaryCard
          icon={Truck}
          label="Picked Up"
          value={pickedUpClaims}
          iconClass="bg-blue-100 text-blue-600"
        />

        {/* Delivered */}
        <SummaryCard
          icon={CheckCircle2}
          label="Delivered"
          value={deliveredClaims}
          iconClass="bg-gray-100 text-gray-600"
        />
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Picked Up", "Delivered"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/30">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <PackageCheck size={30} className="text-gray-400" />
            </div>

            <h3 className="font-semibold text-gray-700">No claims found</h3>

            <p className="mt-1 text-sm text-gray-400">
              Claims will appear here when an NGO claims a donation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Claim
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Donation
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    NGO
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Claim Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Progress
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredClaims.map((claim) => {
                  const isPickedUp = claim.Pickup_Status === "Picked Up";

                  const isDelivered = claim.Delivery_Status === "Delivered";

                  const isUpdating = updatingId === claim.Claim_ID;

                  return (
                    <tr
                      key={claim.Claim_ID}
                      className="transition hover:bg-gray-50/80"
                    >
                      {/* Claim ID */}
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-700">
                          {claim.Claim_ID}
                        </span>
                      </td>

                      {/* Donation */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-800">
                          {claim.Donation_ID}
                        </span>
                      </td>

                      {/* NGO */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-800">
                          {claim.NGO_ID}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(claim.Claim_Date)}
                      </td>

                      {/* Timeline */}
                      <td className="px-6 py-5">
                        <Timeline
                          isPickedUp={isPickedUp}
                          isDelivered={isDelivered}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                            <CheckCircle2 size={13} />
                            Completed
                          </span>
                        ) : isPickedUp ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <Truck size={13} />
                            Picked Up
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">
                            <Clock3 size={13} />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        {isDelivered ? (
                          <span className="text-sm font-medium text-gray-400">
                            —
                          </span>
                        ) : !isPickedUp ? (
                          <button
                            disabled={isUpdating}
                            onClick={() => handlePickedUp(claim)}
                            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <PackageCheck size={14} />
                                Mark Picked Up
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleDelivered(claim)}
                            className="flex items-center gap-2 rounded-xl bg-green-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} />
                                Mark Delivered
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filteredClaims.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {filteredClaims.length} of {claims.length} claims
        </p>
      )}
    </div>
  );
};

// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({ icon: Icon, label, value, iconClass }) => {
  return (
    <div className="group rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-gray-200/30 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>

        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
};

// =====================================================
// TIMELINE
// =====================================================

const Timeline = ({ isPickedUp, isDelivered }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Claimed */}
      <div className="flex items-center gap-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={15} />
        </div>

        <span className="text-xs font-medium text-green-700">Claimed</span>
      </div>

      <div
        className={`h-0.5 w-8 ${isPickedUp ? "bg-green-500" : "bg-gray-200"}`}
      />

      {/* Picked Up */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            isPickedUp
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <PackageCheck size={15} />
        </div>

        <span
          className={`text-xs font-medium ${
            isPickedUp ? "text-green-700" : "text-gray-400"
          }`}
        >
          Picked Up
        </span>
      </div>

      <div
        className={`h-0.5 w-8 ${isDelivered ? "bg-green-500" : "bg-gray-200"}`}
      />

      {/* Delivered */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            isDelivered
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <Truck size={15} />
        </div>

        <span
          className={`text-xs font-medium ${
            isDelivered ? "text-green-700" : "text-gray-400"
          }`}
        >
          Delivered
        </span>
      </div>
    </div>
  );
};

export default Claims;
