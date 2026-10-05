import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { toast } from "sonner";
import { BarChart3, Calendar as CalIcon, Filter } from "lucide-react";
import type { ISalesData, IRoomCalendar, ICalendarOrder } from "@/models/report.model";

export default function TenantReportsPage() {
  const [tab, setTab] = useState<"sales" | "calendar">("sales");
  const [salesData, setSalesData] = useState<ISalesData>({ data: [], summary: { totalRevenue: 0, totalTransactions: 0 } });
  const [rooms, setRooms] = useState<IRoomCalendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [sort, setSort] = useState("date");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (tab === "sales") {
          const res = await api.get("/report/sales", { params: { start, end, sort } });
          setSalesData(res.data.data); setLoading(false);
        } else {
          const res = await api.get("/report/calendar");
          setRooms(res.data.data); setLoading(false);
        }
      } catch {
        toast.error("Gagal memuat data laporan.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tab, sort, refresh, start, end]);

  const handleFilter = () => setRefresh((r) => r + 1);

  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const checkAvailable = (date: Date, orders: ICalendarOrder[]) => {
    const target = date.setHours(0, 0, 0, 0);
    return !orders.some((o) => {
      const ci = new Date(o.checkInDate).setHours(0, 0, 0, 0);
      const co = new Date(o.checkOutDate).setHours(0, 0, 0, 0);
      return target >= ci && target < co;
    });
  };

  return (
    <>
      <SEO title="Laporan & Analisis | Nestion" description="Tenant reports and calendar." />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Report & Analysis</h1>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setTab("sales")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "sales" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <BarChart3 className="w-4 h-4" /> Sales Report
            </button>
            <button onClick={() => setTab("calendar")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "calendar" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <CalIcon className="w-4 h-4" /> Property Calendar
            </button>
          </div>
        </div>

        {tab === "sales" && (
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

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border rounded-xl px-3 py-2 text-sm w-40" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border rounded-xl px-3 py-2 text-sm w-40" />
              </div>
              <button onClick={handleFilter} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <div className="ml-auto">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Sort By</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-xl px-3 py-2 text-sm w-40 bg-white">
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
                  {loading ? <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr> : salesData.data.length === 0 ? <tr><td colSpan={5} className="text-center py-10">No sales data found.</td></tr> : salesData.data.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold">{order.orderNumber}</td>
                      <td className="px-6 py-4">{order.room.property.name} - {order.room.name}</td>
                      <td className="px-6 py-4">{order.user.fullName}<br/><span className="text-xs text-slate-400">{order.user.email}</span></td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="px-6 py-4 font-bold text-amber-600">Rp {order.totalPrice.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "calendar" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/3">Property & Room</th>
                  {next7Days.map((d, i) => (
                    <th key={i} className="px-2 py-4 font-semibold text-center whitespace-nowrap">
                      {d.toLocaleDateString("id-ID", { weekday: 'short', day: 'numeric', month: 'short' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr><td colSpan={8} className="text-center py-10">Loading...</td></tr> : rooms.length === 0 ? <tr><td colSpan={8} className="text-center py-10">No properties found.</td></tr> : rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{room.property.name} <br/><span className="text-xs text-slate-500">{room.name}</span></td>
                    {next7Days.map((d, i) => {
                      const isAvail = checkAvailable(d, room.orders);
                      return (
                        <td key={i} className="px-2 py-4 text-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${isAvail ? "bg-emerald-400" : "bg-rose-500"}`} title={isAvail ? "Available" : "Booked"}></span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> Available</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Booked</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}