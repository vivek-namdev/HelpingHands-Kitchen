import { useEffect, useState } from "react";
import { RefreshCw, PackageOpen } from "lucide-react";
import DonationCard from "../components/donations/DonationCard.jsx";
import DonationFilters from "../components/donations/DonationFilters.jsx";
import ClaimModal from "../components/donations/ClaimModal.jsx";
import { getDonations } from "../services/api.js";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDonation, setSelectedDonation] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDonations();

      setDonations(response.donations || []);
    } catch (err) {
      setError(err.message || "Failed to fetch donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filteredDonations =
    filter === "All"
      ? donations
      : donations.filter((donation) => donation.Status === filter);

  const handleClaimSuccess = (message) => {
    setSelectedDonation(null);
    setSuccessMessage(message);

    // Refresh donations after claim
    fetchDonations();

    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <PackageOpen size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Food Donations
              </h1>

              <p className="text-sm text-gray-500">
                Browse and claim available surplus food.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchDonations}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-600"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
            ✓
          </div>

          <div>
            <p className="font-semibold">Claim Successful</p>

            <p className="text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <DonationFilters activeFilter={filter} onFilterChange={setFilter} />

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <PackageOpen size={45} className="mx-auto mb-4 text-gray-300" />

          <h3 className="font-semibold text-gray-700">No donations found</h3>

          <p className="mt-1 text-sm text-gray-400">
            There are no donations matching this filter.
          </p>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredDonations.map((donation) => (
              <DonationCard
                key={donation.Donation_ID}
                donation={donation}
                onClaim={setSelectedDonation}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Showing {filteredDonations.length} donation
            {filteredDonations.length !== 1 ? "s" : ""}
          </p>
        </>
      )}

      {/* Claim Modal */}
      {selectedDonation && (
        <ClaimModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  );
};

export default Donations;
