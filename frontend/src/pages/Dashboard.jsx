import { useCallback, useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Users,
  UtensilsCrossed,
  PackageCheck,
  Building2,
  ClipboardList,
  Truck,
  RefreshCw,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock3,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

import {
  getDonors,
  getDonations,
  getAvailableDonations,
  getNGOs,
  getClaims,
  createClaim,
} from "../services/api.js";

import StatCard from "../components/dashboard/StatCard.jsx";
import RecentDonations from "../components/dashboard/RecentDonations.jsx";
import HighPriorityDonations from "../components/dashboard/HighPriorityDonations.jsx";
import RecentClaims from "../components/dashboard/RecentClaims.jsx";
import ClaimStatusTimeline from "../components/claims/ClaimStatusTimeline.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  // ======================================================
  // ADMIN STATE
  // ======================================================

  const [donors, setDonors] = useState([]);
  const [adminDonations, setAdminDonations] = useState([]);
  const [adminAvailableDonations, setAdminAvailableDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [adminClaims, setAdminClaims] = useState([]);

  // ======================================================
  // DONOR / NGO STATE
  // ======================================================

  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);

  // ======================================================
  // COMMON STATE
  // ======================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [claimingDonationId, setClaimingDonationId] = useState(null);

  // ======================================================
  // HELPERS
  // ======================================================

  const extractArray = (response, possibleKeys = []) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    for (const key of possibleKeys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    return [];
  };

  const getProfileId = () => {
    return (
      user?.profileId ||
      user?.Donor_ID ||
      user?.donorId ||
      user?.NGO_ID ||
      user?.ngoId ||
      null
    );
  };

  // ======================================================
  // ADMIN DASHBOARD DATA
  // ======================================================

  const fetchAdminDashboard = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [
        donorsResponse,
        donationsResponse,
        availableResponse,
        ngosResponse,
        claimsResponse,
      ] = await Promise.all([
        getDonors(),
        getDonations(),
        getAvailableDonations(),
        getNGOs(),
        getClaims(),
      ]);

      const donorList = extractArray(donorsResponse, ["donors"]);

      const donationList = extractArray(donationsResponse, ["donations"]);

      const availableList = extractArray(availableResponse, ["donations"]);

      const ngoList = extractArray(ngosResponse, ["ngos"]);

      const claimList = extractArray(claimsResponse, ["claims"]);

      setDonors(donorList);
      setAdminDonations(donationList);
      setAdminAvailableDonations(availableList);
      setNgos(ngoList);
      setAdminClaims(claimList);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);

      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ======================================================
  // DONOR DASHBOARD DATA
  // ======================================================

  const fetchDonorDashboard = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const donationsResponse = await getDonations();

      const donationList = extractArray(donationsResponse, ["donations"]);

      setDonations(donationList);
    } catch (err) {
      console.error("Donor dashboard fetch error:", err);

      setError(err.message || "Unable to load donor dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ======================================================
  // NGO DASHBOARD DATA
  // ======================================================

  const fetchNGODashboard = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [donationsResponse, claimsResponse] = await Promise.all([
        getDonations(),
        getClaims(),
      ]);

      const donationList = extractArray(donationsResponse, ["donations"]);

      const claimList = extractArray(claimsResponse, ["claims"]);

      setDonations(donationList);

      setClaims(claimList);
    } catch (err) {
      console.error("NGO dashboard fetch error:", err);

      setError(err.message || "Unable to load NGO dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ======================================================
  // ROLE BASED FETCH
  // ======================================================

  useEffect(() => {
    if (!role) {
      setLoading(false);
      return;
    }

    if (role === "admin") {
      fetchAdminDashboard(true);
      return;
    }

    if (role === "donor") {
      fetchDonorDashboard(true);
      return;
    }

    if (role === "ngo") {
      fetchNGODashboard(true);
      return;
    }

    setLoading(false);
  }, [role, fetchAdminDashboard, fetchDonorDashboard, fetchNGODashboard]);

  // ======================================================
  // ADMIN AUTO REFRESH EVERY 30 SECONDS
  // ======================================================

  useEffect(() => {
    if (role !== "admin") {
      return undefined;
    }

    const interval = setInterval(() => {
      fetchAdminDashboard(false);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [role, fetchAdminDashboard]);

  // ======================================================
  // ADMIN CALCULATIONS
  // ======================================================

  const adminSuccessfulDeliveries = adminClaims.filter(
    (claim) => claim.Delivery_Status === "Delivered",
  ).length;

  const adminRecentDonations = [...adminDonations]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const now = Date.now();

  const threeHoursFromNow = now + 3 * 60 * 60 * 1000;

  const adminHighPriorityDonations = adminAvailableDonations
    .filter((donation) => {
      const expiry = new Date(donation.Expiry_Time).getTime();

      return expiry > now && expiry <= threeHoursFromNow;
    })
    .sort((a, b) => new Date(a.Expiry_Time) - new Date(b.Expiry_Time));

  const adminRecentClaims = [...adminClaims]
    .sort(
      (a, b) =>
        new Date(b.Claim_Date || b.createdAt || 0) -
        new Date(a.Claim_Date || a.createdAt || 0),
    )
    .slice(0, 5);

  const adminStats = [
    {
      title: "Total Donors",
      value: donors.length,
      icon: Users,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "bg-green-500",
    },
    {
      title: "Total Donations",
      value: adminDonations.length,
      icon: UtensilsCrossed,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "bg-green-500",
    },
    {
      title: "Available Donations",
      value: adminAvailableDonations.length,
      icon: PackageCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
    },
    {
      title: "Total NGOs",
      value: ngos.length,
      icon: Building2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
    },
    {
      title: "Total Claims",
      value: adminClaims.length,
      icon: ClipboardList,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      accent: "bg-purple-500",
    },
    {
      title: "Successful Deliveries",
      value: adminSuccessfulDeliveries,
      icon: Truck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "bg-green-500",
    },
  ];

  // ======================================================
  // DONOR CALCULATIONS
  // ======================================================

  const donorId = getProfileId();

  const myDonations = useMemo(() => {
    if (!donorId) {
      return [];
    }

    return donations.filter((donation) => donation.Donor_ID === donorId);
  }, [donations, donorId]);

  const donorAvailable = myDonations.filter(
    (donation) => donation.Status === "Available",
  ).length;

  const donorClaimed = myDonations.filter(
    (donation) => donation.Status === "Claimed",
  ).length;

  const donorDelivered = myDonations.filter(
    (donation) => donation.Status === "Delivered",
  ).length;

  const donorRecentDonations = [...myDonations]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const donorHighPriorityDonations = myDonations
    .filter((donation) => {
      const expiry = new Date(donation.Expiry_Time).getTime();

      return (
        donation.Status === "Available" &&
        expiry > now &&
        expiry <= threeHoursFromNow
      );
    })
    .sort((a, b) => new Date(a.Expiry_Time) - new Date(b.Expiry_Time));

  const donorStats = [
    {
      title: "My Total Donations",
      value: myDonations.length,
      icon: UtensilsCrossed,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "bg-green-500",
    },
    {
      title: "Available",
      value: donorAvailable,
      icon: PackageCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "bg-green-500",
    },
    {
      title: "Claimed",
      value: donorClaimed,
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
    },
    {
      title: "Delivered",
      value: donorDelivered,
      icon: Truck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: "bg-green-500",
    },
  ];

  // ======================================================
  // NGO CALCULATIONS
  // ======================================================

  const availableDonations = donations.filter(
    (donation) => donation.Status === "Available",
  );

  const ngoId = getProfileId();

  const myClaims = useMemo(() => {
    if (!ngoId) {
      return [];
    }

    return claims.filter((claim) => claim.NGO_ID === ngoId);
  }, [claims, ngoId]);

  const pendingPickups = myClaims.filter(
    (claim) =>
      claim.Pickup_Status === "Pending" || claim.Pickup_Status === "Scheduled",
  ).length;

  const ngoDelivered = myClaims.filter(
    (claim) => claim.Delivery_Status === "Delivered",
  ).length;

  const recentNGOClaims = [...myClaims]
    .sort(
      (a, b) =>
        new Date(b.Claim_Date || b.createdAt || 0) -
        new Date(a.Claim_Date || a.createdAt || 0),
    )
    .slice(0, 5);

  const topAvailableDonations = availableDonations.slice(0, 5);

  // ======================================================
  // CLAIM DONATION
  // ======================================================

  const handleClaimDonation = async (donation) => {
    if (!ngoId) {
      setError(
        "Your NGO profile is not linked to your account yet. Please complete your NGO registration.",
      );

      return;
    }

    try {
      setClaimingDonationId(donation.Donation_ID);

      setError("");

      await createClaim({
        Donation_ID: donation.Donation_ID,

        NGO_ID: ngoId,

        Claim_Date: new Date().toISOString(),
      });

      await fetchNGODashboard(false);
    } catch (err) {
      console.error("Claim donation error:", err);

      setError(err.message || "Failed to claim donation");
    } finally {
      setClaimingDonationId(null);
    }
  };

  // ======================================================
  // COMMON REFRESH
  // ======================================================

  const handleRefresh = () => {
    if (role === "admin") {
      fetchAdminDashboard(false);
    }

    if (role === "donor") {
      fetchDonorDashboard(false);
    }

    if (role === "ngo") {
      fetchNGODashboard(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

          <p className="text-sm text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  const ErrorMessage = () => {
    if (!error) {
      return null;
    }

    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        <AlertCircle size={19} />

        <div>
          <p className="text-sm font-semibold">
            Dashboard data could not be loaded
          </p>

          <p className="mt-0.5 text-xs">{error}</p>
        </div>

        <button
          type="button"
          onClick={() => setError("")}
          className="ml-auto rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
        >
          <XCircle size={18} />
        </button>
      </div>
    );
  };

  // ======================================================
  // ADMIN VIEW
  // ======================================================

  if (role === "admin") {
    return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />

              <span className="text-sm font-semibold text-purple-600">
                Live Overview
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome to HelpingHands Kitchen
            </h1>

            <p className="mt-1 text-slate-500">
              Monitor food donations and deliveries in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <ErrorMessage />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminStats.map((stat) => (
            <StatCard key={stat.title} {...stat} loading={loading} />
          ))}
        </div>

        {/* Recent Donations + High Priority */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentDonations donations={adminRecentDonations} />

          <HighPriorityDonations donations={adminHighPriorityDonations} />
        </div>

        {/* Recent Claims */}
        <RecentClaims claims={adminRecentClaims} />

        {/* Auto Refresh */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-400">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                refreshing ? "animate-pulse bg-purple-500" : "bg-slate-400"
              }`}
            />
            Auto-refreshing every 30 seconds
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // DONOR VIEW
  // ======================================================

  if (role === "donor") {
    return (
      <div className="space-y-6 pb-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-green-500 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative">
            <p className="text-sm font-medium text-green-100">
              Donor Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name || "Donor"}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-green-100">
              Track your food donations and see how your contributions are
              helping people in need.
            </p>
          </div>
        </section>

        <ErrorMessage />

        {/* Profile Warning */}
        {!donorId && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">Donor profile not linked</p>

                <p className="mt-1 text-xs">
                  Your account does not currently have a Donor ID linked to it,
                  so your personal donation statistics cannot be displayed yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {donorStats.map((stat) => (
            <StatCard key={stat.title} {...stat} loading={loading} />
          ))}
        </div>

        {/* Quick Action */}
        <div className="flex flex-col gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Have more food to donate?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new donation and help connect surplus food with people
              who need it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/donation/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
          >
            <Plus size={18} />
            Create New Donation
          </button>
        </div>

        {/* Recent My Donations */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-bold text-slate-900">Recent My Donations</h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest food donations
              </p>
            </div>

            <Link
              to="/donations"
              className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {donorRecentDonations.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-14">
              <PackageCheck size={32} className="text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500">
                No donations found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your recent donations will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Donation ID
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Food Category
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {donorRecentDonations.map((donation) => (
                    <tr
                      key={donation.Donation_ID}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {donation.Donation_ID}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {donation.Food_Category}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {donation.Quantity_KG} KG
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            donation.Status === "Available"
                              ? "bg-green-50 text-green-700"
                              : donation.Status === "Claimed"
                                ? "bg-blue-50 text-blue-700"
                                : donation.Status === "Picked Up"
                                  ? "bg-orange-50 text-orange-700"
                                  : donation.Status === "Delivered"
                                    ? "bg-purple-50 text-purple-700"
                                    : "bg-red-50 text-red-700"
                          }`}
                        >
                          {donation.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* High Priority */}
        <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <Clock3 size={19} className="text-orange-500" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                High Priority Donations
              </h2>

              <p className="text-xs text-slate-500">
                Your donations expiring within 3 hours
              </p>
            </div>
          </div>

          {donorHighPriorityDonations.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">
              <p className="text-sm font-medium text-slate-600">
                No urgent donations
              </p>

              <p className="mt-1 text-xs text-slate-400">
                None of your available donations expire within the next 3 hours.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {donorHighPriorityDonations.map((donation) => (
                <div
                  key={donation.Donation_ID}
                  className="rounded-xl border-2 border-orange-200 bg-orange-50/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-900">
                        {donation.Food_Category}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {donation.Donation_ID}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-bold text-orange-600">
                        {donation.Quantity_KG} KG
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-orange-600">
                        <Clock3 size={13} />
                        Expires{" "}
                        {new Date(donation.Expiry_Time).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-green-300 hover:text-green-600 disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // NGO VIEW
  // ======================================================

  if (role === "ngo") {
    return (
      <div className="space-y-6 pb-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative">
            <p className="text-sm font-medium text-blue-100">NGO Dashboard</p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name || "NGO"}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Find available food donations, claim them, and track your pickups
              and deliveries.
            </p>
          </div>
        </section>

        <ErrorMessage />

        {/* Profile Warning */}
        {!ngoId && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">NGO profile not linked</p>

                <p className="mt-1 text-xs">
                  Your account does not currently have an NGO ID linked to it.
                  You can view donations, but claiming requires a linked NGO
                  profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Available Donations"
            value={availableDonations.length}
            icon={PackageCheck}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            accent="bg-green-500"
            loading={loading}
          />

          <StatCard
            title="My Claims"
            value={myClaims.length}
            icon={ClipboardList}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accent="bg-blue-500"
            loading={loading}
          />

          <StatCard
            title="Pending Pickups"
            value={pendingPickups}
            icon={Truck}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            accent="bg-orange-500"
            loading={loading}
          />

          <StatCard
            title="Delivered"
            value={ngoDelivered}
            icon={CheckCircle2}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            accent="bg-green-500"
            loading={loading}
          />
        </div>

        {/* Quick Action */}
        <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Looking for more food?</h2>

            <p className="mt-1 text-sm text-slate-500">
              Browse all currently available food donations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/donations")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            View All Available
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Available Donations */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Available Donations</h2>

              <p className="mt-1 text-xs text-slate-500">
                Food currently available for your NGO to claim
              </p>
            </div>

            <Link
              to="/donations"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {topAvailableDonations.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-10 text-center">
              <PackageCheck size={35} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No donations available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                New donations will appear here when donors add them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {topAvailableDonations.map((donation) => (
                <div
                  key={donation.Donation_ID}
                  className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {donation.Donation_ID}
                      </p>

                      <h3 className="mt-1 font-bold text-slate-900">
                        {donation.Food_Category}
                      </h3>
                    </div>

                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      Available
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-400">Quantity</p>

                      <p className="mt-1 font-bold text-slate-800">
                        {donation.Quantity_KG} KG
                      </p>
                    </div>

                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-400">Location</p>

                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <MapPin size={13} className="text-blue-600" />

                        <span className="truncate">{donation.Location}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleClaimDonation(donation)}
                    disabled={
                      claimingDonationId === donation.Donation_ID || !ngoId
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {claimingDonationId === donation.Donation_ID ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Claim Donation
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Recent Claims */}
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-bold text-slate-900">My Recent Claims</h2>

              <p className="mt-1 text-xs text-slate-500">
                Track your claimed donations
              </p>
            </div>

            <Link
              to="/claims"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentNGOClaims.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-14">
              <ClipboardList size={32} className="text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500">
                No claims found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your claims will appear here after you claim a donation.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentNGOClaims.map((claim) => (
                <div key={claim.Claim_ID} className="overflow-x-auto px-5 py-5">
                  <div className="mb-4 flex min-w-[600px] items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Claim ID
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {claim.Claim_ID}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Donation: {claim.Donation_ID}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Claim Date</p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {claim.Claim_Date
                          ? new Date(claim.Claim_Date).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[600px]">
                    <ClaimStatusTimeline claim={claim} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Refresh */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // FALLBACK
  // ======================================================

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle size={35} className="mx-auto text-orange-500" />

        <h2 className="mt-3 font-bold text-slate-900">
          Unable to determine your role
        </h2>

        <p className="mt-1 text-sm text-slate-500">Please log in again.</p>

        <button
          type="button"
          onClick={() => navigate("/login/donor")}
          className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
