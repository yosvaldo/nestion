import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { toast } from "sonner";
import { BarChart3, Calendar as CalIcon } from "lucide-react";
import type { ISalesData, IRoomCalendar } from "@/models/report.model";
import PropertyCalendar from "@/components/report/PropertyCalendar";

export default function TenantReportsPage() {
  const [tab, setTab] = useState<"sales" | "calendar">("sales");
  const [salesData, setSalesData] = useState<ISalesData>({ data: [], summary: { totalRevenue: 0, totalTransactions: 0 } });
  const [rooms, setRooms] = useState<IRoomCalendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [sort, setSort] = useState("date");

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        if (tab === "sales") {
          const res = await api.get("/report/sales", { 
            params: { start: start || undefined, end: end || undefined, sort } 
          });
          if (isMounted) setSalesData(res.data.data);
        } else {
          const res = await api.get("/report/calendar");
          if (isMounted) setRooms(res.data.data);
        }
      } catch {
        if (isMounted) toast.error("Gagal memuat data laporan.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [tab, sort, start, end]);

  return (
    <>
      <SEO title="Laporan & Analisis | Nestion" description="Tenant reports and calendar." />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Report & Analysis</h1>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setTab("sales")} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "sales" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <BarChart3 className="w-4 h-4" /> Sales Report
            </button>
            <button 
              onClick={() => setTab("calendar")} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "calendar" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <CalIcon className="w-4 h-4" /> Property Calendar
            </button>
          </div>
        </div>

        {tab === "sales" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">Rp {salesData.summary.totalRevenue.toLocaleString("id-ID")}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">Total Transactions</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{salesData.summary.totalTransactions}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={start} 
                    onChange={(e) => setStart(e.target.value)} 
                    className="border rounded-xl px-3 py-2 text-sm w-40 text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                </div>
                <span className="text-slate-400 text-xs self-end pb-3">s/d</span>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={end} 
                    min={start}
                    onChange={(e) => setEnd(e.target.value)} 
                    className="border rounded-xl px-3 py-2 text-sm w-40 text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Sort By</label>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)} 
                  className="border rounded-xl px-3 py-2 text-sm w-48 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="date">Date (Newest)</option>
                  <option value="total">Total Value (Highest)</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Transaction ID</th>
                    <th className="px-6 py-4 font-semibold">Property & Room</th>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
                  ) : salesData.data.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-slate-500">No sales data found.</td></tr>
                  ) : (
                    salesData.data.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                        <td className="px-6 py-4">{order.room.property.name} - {order.room.name}</td>
                        <td className="px-6 py-4">{order.user.fullName}<br/><span className="text-xs text-slate-400">{order.user.email}</span></td>
                        <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                        <td className="px-6 py-4 font-bold text-amber-600">Rp {order.totalPrice.toLocaleString("id-ID")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <PropertyCalendar rooms={rooms} loading={loading} />
        )}
      </div>
    </>
  );
}