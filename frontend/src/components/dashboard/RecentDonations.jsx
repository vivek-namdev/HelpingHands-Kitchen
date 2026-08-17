import { ArrowRight, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";

const getStatusClass = (status) => {
  switch (status) {
    case "Available":
      return "bg-green-50 text-green-700";

    case "Claimed":
      return "bg-blue-50 text-blue-700";

    case "Picked Up":
      return "bg-orange-50 text-orange-700";

    case "Delivered":
      return "bg-gray-100 text-gray-600";

    case "Expired":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RecentDonations = ({ donations }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div>
          <h2 className="font-bold text-gray-900">Recent Donations</h2>

          <p className="text-xs text-gray-500 mt-1">Latest food donations</p>
        </div>

        <Link
          to="/donations"
          className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
        >
          View All
          <ArrowRight size={15} />
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 px-5">
          <PackageOpen size={30} className="text-gray-300" />

          <p className="text-sm text-gray-500 mt-3">No donations found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {donations.map((donation) => (
            <div
              key={donation.Donation_ID}
              className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900">
                  {donation.Food_Category}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {donation.Donation_ID}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="text-xs text-gray-500">
                    {donation.Quantity_KG} KG
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">
                  {donation.Location}
                </p>
              </div>

              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                  donation.Status,
                )}`}
              >
                {donation.Status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentDonations;
