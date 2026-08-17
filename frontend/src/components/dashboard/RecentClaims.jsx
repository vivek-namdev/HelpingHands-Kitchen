import { ArrowRight, CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";

const RecentClaims = ({ claims }) => {
  const getPickupClass = (status) => {
    if (status === "Picked Up") {
      return "bg-orange-50 text-orange-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  const getDeliveryClass = (status) => {
    if (status === "Delivered") {
      return "bg-green-50 text-green-700";
    }

    return "bg-blue-50 text-blue-700";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Recent Claims</h2>

          <p className="text-xs text-gray-500 mt-1">Latest donation claims</p>
        </div>

        <Link
          to="/claims"
          className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
        >
          View All
          <ArrowRight size={15} />
        </Link>
      </div>

      {claims.length === 0 ? (
        <div className="py-14 flex flex-col items-center">
          <Clock3 size={30} className="text-gray-300" />

          <p className="text-sm text-gray-500 mt-3">No claims found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase text-gray-500">
                  Claim ID
                </th>

                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase text-gray-500">
                  Donation
                </th>

                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase text-gray-500">
                  NGO
                </th>

                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase text-gray-500">
                  Pickup
                </th>

                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase text-gray-500">
                  Delivery
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {claims.map((claim) => (
                <tr
                  key={claim.Claim_ID}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-sm text-gray-900">
                      {claim.Claim_ID}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {claim.Donation_ID}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {claim.NGO_ID}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getPickupClass(
                        claim.Pickup_Status,
                      )}`}
                    >
                      <PackageCheck size={12} />
                      {claim.Pickup_Status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getDeliveryClass(
                        claim.Delivery_Status,
                      )}`}
                    >
                      {claim.Delivery_Status === "Delivered" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock3 size={12} />
                      )}

                      {claim.Delivery_Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentClaims;
