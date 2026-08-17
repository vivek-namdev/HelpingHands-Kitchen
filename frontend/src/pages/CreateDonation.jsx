import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PackagePlus, X } from "lucide-react";

import DonationForm from "../components/donations/DonationForm.jsx";

const CreateDonation = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setSuccessMessage("");

    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
          <PackagePlus size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Donation</h1>

          <p className="text-sm text-gray-500">
            Share surplus food with NGOs that need it.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={20} />

          <span className="font-medium">{successMessage}</span>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <X size={20} />

          <span className="font-medium">{errorMessage}</span>

          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-white/70 bg-white p-6 shadow-lg shadow-gray-200/30 sm:p-8">
        <DonationForm onSuccess={handleSuccess} onError={handleError} />
      </div>

      <Link
        to="/donations"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
      >
        <ArrowLeft size={16} />
        Back to Donations
      </Link>
    </div>
  );
};

export default CreateDonation;
