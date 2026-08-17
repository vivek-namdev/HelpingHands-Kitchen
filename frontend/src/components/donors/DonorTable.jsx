import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DonorTable = ({ donors, loading, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const donorTypes = [
    "All",
    "Restaurant",
    "Hotel",
    "Event",
    "Individual",
    "Other",
  ];

  const filteredDonors = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return donors.filter((donor) => {
      const matchesSearch =
        !searchValue ||
        donor.Donor_Name?.toLowerCase().includes(searchValue) ||
        donor.City?.toLowerCase().includes(searchValue) ||
        donor.Location?.toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All" || donor.Donor_Type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [donors, search, typeFilter]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Users size={18} />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Recently Registered Donors
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {filteredDonors.length} donor
              {filteredDonors.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-green-200 hover:text-green-600 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor name, city or location..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            />
          </div>

          {/* Type */}
          <div className="relative">
            <Filter
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm font-medium text-slate-600 outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
            >
              {donorTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Donor Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
              <RefreshCw size={22} className="animate-spin text-green-500" />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-600">
              Loading donors...
            </p>
          </div>
        </div>
      ) : filteredDonors.length === 0 ? (
        /* Empty */
        <div className="flex min-h-[300px] items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={25} />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">No donors found</h3>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Donor ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Donor Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  City
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDonors.map((donor) => (
                <tr
                  key={donor._id || donor.Donor_ID}
                  className="group transition hover:bg-green-50/40"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                      {donor.Donor_ID}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      {donor.Donor_Name}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {donor.Donor_Type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={15} className="text-green-500" />
                      {donor.City}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="max-w-[280px] truncate text-sm text-slate-500">
                      {donor.Location}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!loading && filteredDonors.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-400">
            Showing {filteredDonors.length} of {donors.length} donors
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-300"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-green-500 px-2 text-xs font-bold text-white">
              1
            </span>

            <button
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-300"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorTable;
