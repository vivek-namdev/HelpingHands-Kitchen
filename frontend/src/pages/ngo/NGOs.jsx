import { useEffect, useMemo, useState } from "react";
import { Building2, Search, RefreshCw } from "lucide-react";
// import NGOTable from "../../components/ngos/NGOTable";
import NGOTable from "../../components/ngos/NGOTable.jsx";
import { getNGOs } from "../../services/api";

const NGOs = () => {
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNGOs();

      console.log("NGO API Response:", response);

      setNgos(response.ngos || response.data || []);
    } catch (err) {
      console.error("NGO fetch error:", err);

      setError(err.message || "Failed to load NGOs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const filteredNGOs = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return ngos;

    return ngos.filter(
      (ngo) =>
        ngo.NGO_Name?.toLowerCase().includes(value) ||
        ngo.City?.toLowerCase().includes(value),
    );
  }, [ngos, search]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Building2 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">NGOs</h1>

              <p className="text-sm text-gray-500">
                Manage organizations receiving food donations.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchNGOs}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-600"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg shadow-gray-200/30 backdrop-blur-xl">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by NGO name or city..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
        </div>
      ) : (
        <NGOTable ngos={filteredNGOs} />
      )}

      {!loading && (
        <p className="text-sm text-gray-500">
          Showing {filteredNGOs.length} of {ngos.length} NGOs
        </p>
      )}
    </div>
  );
};

export default NGOs;
