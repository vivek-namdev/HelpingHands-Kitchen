import { useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import NGOForm from "../components/ngos/NGOForm";

const NGORegister = () => {
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Building2 size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Register NGO</h1>

            <p className="text-sm text-gray-500">
              Register an NGO to receive surplus food donations.
            </p>
          </div>
        </div>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700 shadow-sm">
          <CheckCircle2 size={22} />

          <div>
            <p className="font-semibold">Registration Successful</p>
            <p className="text-sm">{successMessage}</p>
          </div>

          <button
            onClick={() => setSuccessMessage("")}
            className="ml-auto text-sm font-medium hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="max-w-4xl rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl md:p-8">
        <NGOForm onSuccess={setSuccessMessage} />
      </div>
    </div>
  );
};

export default NGORegister;
