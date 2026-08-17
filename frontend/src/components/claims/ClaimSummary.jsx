import { ClipboardList, PackageCheck, Truck, Clock3 } from "lucide-react";

const ClaimSummary = ({ claims }) => {
  const total = claims.length;

  const pickedUp = claims.filter(
    (claim) => claim.Pickup_Status === "Picked Up",
  ).length;

  const delivered = claims.filter(
    (claim) => claim.Delivery_Status === "Delivered",
  ).length;

  const pending = claims.filter(
    (claim) => claim.Pickup_Status === "Pending",
  ).length;

  const stats = [
    {
      label: "Total Claims",
      value: total,
      icon: ClipboardList,
      iconClass: "text-blue-600 bg-blue-50",
    },
    {
      label: "Picked Up",
      value: pickedUp,
      icon: PackageCheck,
      iconClass: "text-orange-600 bg-orange-50",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: Truck,
      iconClass: "text-green-600 bg-green-50",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      iconClass: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5
                       hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconClass}`}
              >
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClaimSummary;
