// pages/DAOutput.jsx
import { useEffect, useState } from "react";

export default function DAOutput() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/da-output")
      .then((r) => r.json())
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading DA results...</p>;
  if (!data.length)
    return <p className="p-6 text-gray-500">No DA output yet.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">DA Output</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm bg-white">
          <thead className="bg-green-600 text-white">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2">
                    {row[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
