import { useState } from "react";

import { Filter, Search, RotateCcw, Utensils, MapPin } from "lucide-react";

const DonationFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    location: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    onFilterChange?.(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "",
      status: "",
      location: "",
    };

    setFilters(resetFilters);

    onFilterChange?.(resetFilters);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Filter size={18} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Filter Donations
            </h3>

            <p className="text-xs text-slate-400">Find the food you need</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search donation..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <Utensils
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          >
            <option value="">All Categories</option>

            <option value="Cooked Meals">Cooked Meals</option>

            <option value="Raw Vegetables">Raw Vegetables</option>

            <option value="Fruits">Fruits</option>

            <option value="Bakery">Bakery</option>

            <option value="Dairy">Dairy</option>

            <option value="Other">Other</option>
          </select>
        </div>

        {/* Status */}
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        >
          <option value="">All Statuses</option>

          <option value="Available">Available</option>

          <option value="Claimed">Claimed</option>

          <option value="Picked Up">Picked Up</option>

          <option value="Delivered">Delivered</option>

          <option value="Expired">Expired</option>
        </select>

        {/* Location */}
        <div className="relative">
          <MapPin
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500"
          />

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Filter by location"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>
    </div>
  );
};

export default DonationFilters;
