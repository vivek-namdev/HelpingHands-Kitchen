import {
  MapPin,
  Weight,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const statusStyles = {
  Available: "bg-green-100 text-green-700 border-green-200",

  Claimed: "bg-blue-100 text-blue-700 border-blue-200",

  "Picked Up": "bg-orange-100 text-orange-700 border-orange-200",

  Delivered: "bg-blue-50 text-blue-700 border-blue-200",

  Expired: "bg-red-100 text-red-700 border-red-200",
};

const foodIcons = {
  "Cooked Meals": "🍱",
  "Raw Vegetables": "🥕",
  Fruits: "🍎",
  Bakery: "🥐",
  Dairy: "🥛",
  Other: "🍽️",
};

const DonationCard = ({ donation, onClaim }) => {
  const expiryTime = new Date(donation.Expiry_Time);

  const now = new Date();

  const hoursLeft = (expiryTime - now) / (1000 * 60 * 60);

  const isHighPriority =
    donation.Status === "Available" && hoursLeft > 0 && hoursLeft <= 3;

  const formatExpiry = () => {
    if (hoursLeft <= 0) {
      return "Expired";
    }

    if (hoursLeft < 1) {
      return `${Math.ceil(hoursLeft * 60)} minutes left`;
    }

    return `${Math.ceil(hoursLeft)} hours left`;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/60">
      {/* ==================================================
          PRIORITY
      ================================================== */}

      {isHighPriority && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
          <AlertTriangle size={13} />
          HIGH PRIORITY
        </div>
      )}

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl ring-1 ring-green-100">
            {foodIcons[donation.Food_Category] || "🍽️"}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Donation ID
            </p>

            <h3 className="font-bold text-slate-900">{donation.Donation_ID}</h3>
          </div>
        </div>

        {!isHighPriority && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              statusStyles[donation.Status] ||
              "border-slate-200 bg-slate-100 text-slate-600"
            }`}
          >
            {donation.Status}
          </span>
        )}
      </div>

      {/* ==================================================
          PRIORITY STATUS
      ================================================== */}

      {isHighPriority && (
        <div className="mt-4">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              statusStyles[donation.Status]
            }`}
          >
            {donation.Status}
          </span>
        </div>
      )}

      {/* ==================================================
          FOOD CATEGORY
      ================================================== */}

      <div className="mt-5">
        <p className="text-xs text-slate-400">Food Category</p>

        <p className="mt-1 font-semibold text-slate-800">
          {donation.Food_Category}
        </p>
      </div>

      {/* ==================================================
          INFORMATION
      ================================================== */}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Quantity */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Weight size={15} />

            <span className="text-xs">Quantity</span>
          </div>

          <p className="mt-1 font-semibold text-slate-800">
            {donation.Quantity_KG} KG
          </p>
        </div>

        {/* Expiry */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={15} />

            <span className="text-xs">Expiry</span>
          </div>

          <p
            className={`mt-1 font-semibold ${
              isHighPriority
                ? "text-orange-600"
                : hoursLeft <= 0
                  ? "text-red-600"
                  : "text-slate-800"
            }`}
          >
            {formatExpiry()}
          </p>
        </div>
      </div>

      {/* ==================================================
          LOCATION
      ================================================== */}

      <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
        <MapPin size={17} className="mt-0.5 shrink-0 text-blue-500" />

        <span className="leading-5">{donation.Location}</span>
      </div>

      {/* ==================================================
          CLAIM BUTTON
      ================================================== */}

      {donation.Status === "Available" && (
        <button
          type="button"
          onClick={() => onClaim(donation)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
        >
          <CheckCircle2 size={18} />
          Claim Donation
        </button>
      )}

      {/* ==================================================
          CLAIMED MESSAGE
      ================================================== */}

      {donation.Status === "Claimed" && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          <CheckCircle2 size={17} />
          Donation Claimed
        </div>
      )}
    </div>
  );
};

export default DonationCard;
