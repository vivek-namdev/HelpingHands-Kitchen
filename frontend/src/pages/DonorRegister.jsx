import { useCallback, useEffect, useState } from "react";
import { UserPlus, Users, ShieldCheck, HeartHandshake } from "lucide-react";

import DonorForm from "../components/donors/DonorForm";
import DonorTable from "../components/donors/DonorTable";
import Toast from "../components/common/Toast";
import { getDonors, createDonor } from "../services/api";
const DonorRegister = () => {
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const fetchDonors = useCallback(async () => {
    try {
      setLoadingDonors(true);

      const response = await getDonors();

      // Supports:
      // { donors: [...] }
      // { data: [...] }
      // [...]
      const donorList = response.donors || response.data || response;

      setDonors(Array.isArray(donorList) ? donorList : []);
    } catch (error) {
      console.error("Fetching donors failed:", error);

      showToast("error", error.message || "Unable to fetch registered donors.");
    } finally {
      setLoadingDonors(false);
    }
  }, []);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const handleSuccess = (message) => {
    showToast("success", message);

    // Refresh table immediately after registration.
    fetchDonors();
  };

  const handleError = (message) => {
    showToast("error", message);
  };

  return (
    <div className="relative mx-auto max-w-7xl space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Page introduction */}
      <section className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 via-white to-orange-50 p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-orange-200/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
              <UserPlus size={14} />
              Donor Management
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bring more food to
              <span className="text-green-600"> people who need it.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Register restaurants, hotels, event organizers, individuals, and
              other food donors to build a stronger food rescue network.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-white bg-white/80 p-3 text-center shadow-sm backdrop-blur-sm sm:p-4">
              <UserPlus size={19} className="mx-auto text-green-500" />

              <p className="mt-2 text-lg font-black text-slate-900">
                {donors.length}
              </p>

              <p className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                Donors
              </p>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-3 text-center shadow-sm backdrop-blur-sm sm:p-4">
              <HeartHandshake size={19} className="mx-auto text-orange-500" />

              <p className="mt-2 text-lg font-black text-slate-900">Active</p>

              <p className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                Network
              </p>
            </div>

            <div className="rounded-2xl border border-white bg-white/80 p-3 text-center shadow-sm backdrop-blur-sm sm:p-4">
              <ShieldCheck size={19} className="mx-auto text-blue-500" />

              <p className="mt-2 text-lg font-black text-slate-900">Safe</p>

              <p className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                Platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <UserPlus size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">Register New Donor</h2>

            <p className="mt-0.5 text-xs text-slate-400">
              All fields marked with * are required
            </p>
          </div>
        </div>

        <DonorForm onSuccess={handleSuccess} onError={handleError} />
      </section>

      {/* Donor list */}
      <DonorTable
        donors={donors}
        loading={loadingDonors}
        onRefresh={fetchDonors}
      />
    </div>
  );
};

export default DonorRegister;
