import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const ClaimStatusTimeline = ({ claim }) => {
  const isPickedUp =
    claim.Pickup_Status === "Picked Up" ||
    claim.Delivery_Status === "Delivered";

  const isDelivered = claim.Delivery_Status === "Delivered";

  const steps = [
    {
      label: "Claimed",
      completed: true,
    },
    {
      label: "Picked Up",
      completed: isPickedUp,
    },
    {
      label: "Delivered",
      completed: isDelivered,
    },
  ];

  return (
    <div className="flex items-center gap-2 min-w-[280px]">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex items-center gap-1.5">
            {step.completed ? (
              <CheckCircle2 size={17} className="text-green-500" />
            ) : (
              <Circle size={17} className="text-gray-300" />
            )}

            <span
              className={`text-xs font-medium whitespace-nowrap ${
                step.completed ? "text-green-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <ArrowRight
              size={14}
              className={`mx-2 ${
                steps[index + 1].completed ? "text-green-400" : "text-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ClaimStatusTimeline;
