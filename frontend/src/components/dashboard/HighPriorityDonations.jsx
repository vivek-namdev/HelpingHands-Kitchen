import { AlertTriangle, Clock3, MapPin, Package } from "lucide-react";
import { Link } from "react-router-dom";

const HighPriorityDonations = ({ donations }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
            <AlertTriangle size={18} className="text-orange-500" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">High Priority</h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Expiring within 3 hours
            </p>
          </div>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 px-5">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Package size={23} className="text-green-500" />
          </div>

          <p className="text-sm font-medium text-gray-700 mt-3">
            No urgent donations
          </p>

          <p className="text-xs text-gray-400 mt-1 text-center">
            Great! Nothing is expiring soon.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {donations.map((donation) => {
            const expiry = new Date(donation.Expiry_Time);

            return (
              <div
                key={donation.Donation_ID}
                className="border border-orange-200 bg-orange-50/30
                           rounded-xl p-4
                           hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wide">
                      <AlertTriangle size={11} />
                      High Priority
                    </span>

                    <h3 className="font-semibold text-gray-900 mt-2">
                      {donation.Food_Category}
                    </h3>

                    <p className="text-xs text-gray-400 mt-0.5">
                      {donation.Donation_ID}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-orange-600">
                      {donation.Quantity_KG}
                    </p>

                    <p className="text-[10px] text-gray-500">KG</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={13} />
                    {donation.Location}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium">
                    <Clock3 size={13} />
                    Expires{" "}
                    {expiry.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <Link
                  to="/donations"
                  className="mt-4 w-full flex items-center justify-center
                             px-3 py-2 rounded-lg
                             bg-orange-500 text-white
                             text-xs font-semibold
                             hover:bg-orange-600
                             transition"
                >
                  Claim Now
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HighPriorityDonations;
