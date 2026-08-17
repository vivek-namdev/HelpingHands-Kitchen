import { Building2, MapPin, Phone, Users } from "lucide-react";

const NGOTable = ({ ngos }) => {
  if (!ngos.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Building2 size={40} className="mx-auto mb-4 text-gray-300" />

        <h3 className="font-semibold text-gray-700">No NGOs found</h3>

        <p className="mt-1 text-sm text-gray-400">
          Try changing your search or register a new NGO.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                NGO ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                NGO Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                City
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Capacity
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Service Area
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Contact
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {ngos.map((ngo) => (
              <tr key={ngo.NGO_ID} className="transition hover:bg-green-50/40">
                <td className="px-6 py-4">
                  <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    {ngo.NGO_ID}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Building2 size={17} />
                    </div>

                    <span className="font-semibold text-gray-800">
                      {ngo.NGO_Name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={15} />
                    {ngo.City}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-medium text-gray-700">
                    <Users size={15} className="text-green-600" />
                    {ngo.Capacity} KG
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">{ngo.Service_Area}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={15} />
                    {ngo.Contact}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NGOTable;
