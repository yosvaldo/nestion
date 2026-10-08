import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { Plus, Search, Edit, Trash2, ArrowUpDown, Settings } from "lucide-react";
import { toast } from "sonner";

interface TenantProperty {
  id: string;
  name: string;
  city: string;
  category: { name: string };
  rooms: { id: string; name: string }[];
}

export default function TenantDashboardPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await api.get("/properties/my-properties", {
          params: { page, limit: 10, search, sortBy, sortOrder },
        });
        setProperties(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      } catch {
        toast.error("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [page, search, sortBy, sortOrder]);

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await api.delete(`/properties/${propertyToDelete}`);
      toast.success("Property deleted.");
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete));
      setPropertyToDelete(null);
    } catch {
      toast.error("Failed to delete property.");
    }
  };

  const handleSort = (col: "name" | "createdAt") => {
    if (sortBy === col) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortOrder("asc"); }
  };

  return (
    <>
      <SEO title="Tenant Dashboard | Nestion" description="Manage properties." />
      <main className="p-6 md:p-10 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Property Management</h1>
            <button 
              onClick={() => navigate("/tenant/properties/create")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search property..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">Property Name <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Rooms Setup</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
                  ) : properties.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-slate-500">No properties found.</td></tr>
                  ) : (
                    properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-900">{prop.name}</td>
                        <td className="px-6 py-4">{prop.city}</td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">{prop.category?.name}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          {prop.rooms.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {prop.rooms.map((room) => (
                                <button
                                  key={room.id}
                                  onClick={() => navigate(`/tenant/rooms/${room.id}`)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-900 rounded-lg w-fit transition-colors border border-amber-200"
                                  title="Pengaturan Ketersediaan & Peak Season"
                                >
                                  <Settings className="w-3.5 h-3.5" /> 
                                  {room.name}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-rose-500">No Rooms</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => navigate(`/tenant/properties/${prop.id}/edit`)} className="p-2 text-slate-400 hover:text-amber-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => setPropertyToDelete(prop.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex justify-between items-center text-sm text-slate-500 border-t border-slate-100">
              <span>Page {page} of {totalPages || 1}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50">Prev</button>
                <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {propertyToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Delete Property?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setPropertyToDelete(null)} className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}