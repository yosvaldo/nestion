import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { toast } from "sonner";
import { Check, X, Ban, Eye } from "lucide-react";

interface TenantOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  paymentProofUrl?: string;
  user: { fullName: string; email: string };
  room: { name: string; property: { name: string } };
}

export default function TenantOrdersPage() {
  const [orders, setOrders] = useState<TenantOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tenant-orders", { params: { status: status || undefined, page, limit: 10 } });
        setOrders(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [status, page, refresh]);

  const handleConfirm = async (id: string, action: "ACCEPT" | "REJECT") => {
    try {
      await api.patch(`/tenant-orders/${id}/confirm`, { action });
      toast.success(`Pembayaran berhasil di-${action.toLowerCase()}.`);
      setRefresh((r) => r + 1);
    } catch {
      toast.error("Gagal memproses pembayaran.");
    }
  };

  const executeCancel = async () => {
    if (!cancelId) return;
    try {
      await api.patch(`/tenant-orders/${cancelId}/cancel`);
      toast.success("Pesanan berhasil dibatalkan.");
      setCancelId(null);
      setRefresh((r) => r + 1);
    } catch {
      toast.error("Gagal membatalkan pesanan.");
    }
  };

  return (
    <>
      <SEO title="Mengatur Pesanan | Nestion" description="Tenant order management" />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Transaction Management</h1>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded-xl px-4 py-2 text-sm bg-white min-w-[200px]">
            <option value="">Semua Status</option>
            <option value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</option>
            <option value="MENUNGGU_KONFIRMASI_PEMBAYARAN">Menunggu Konfirmasi</option>
            <option value="DIPROSES">Diproses</option>
            <option value="DIBATALKAN">Dibatalkan</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Order / Property</th>
                <th className="px-6 py-4 font-semibold">Guest</th>
                <th className="px-6 py-4 font-semibold">Total Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500">No orders found.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{o.orderNumber}</div>
                      <div className="text-xs">{o.room.property.name} - {o.room.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{o.user.fullName}</div>
                      <div className="text-xs">{o.user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">Rp {o.totalPrice.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                      {o.paymentProofUrl && (
                        <a href={o.paymentProofUrl} target="_blank" rel="noreferrer" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg tooltip" title="View Proof">
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      {o.status === "MENUNGGU_KONFIRMASI_PEMBAYARAN" && (
                        <>
                          <button onClick={() => handleConfirm(o.id, "ACCEPT")} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleConfirm(o.id, "REJECT")} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><X className="w-4 h-4" /></button>
                        </>
                      )}
                      {o.status === "MENUNGGU_PEMBAYARAN" && (
                        <button onClick={() => setCancelId(o.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Ban className="w-4 h-4" /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-500">
          <span>Page {page} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-lg hover:bg-white disabled:opacity-50">Prev</button>
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-lg hover:bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {cancelId && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Batalkan Pesanan?</h3>
            <p className="text-sm text-slate-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelId(null)} className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200">Kembali</button>
              <button onClick={executeCancel} className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl">Batalkan Order</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}