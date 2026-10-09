import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { toast } from "sonner";
import { Upload, XCircle, Search, Calendar, Clock } from "lucide-react";
import type { OrderItem } from "@/models/order.model";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/orders", { 
          params: { search, startDate: startDate || undefined, status: status || undefined, page, limit: 5 } 
        });
        if (isMounted) {
          setOrders(res.data.data);
          setTotalPages(res.data.meta?.totalPages || 1);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          toast.error("Gagal memuat daftar pesanan.");
          setLoading(false);
        }
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, [search, startDate, status, page, refresh]);

  const handleUploadProof = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return toast.error("Format file harus .jpg atau .png");
    if (file.size > 1024 * 1024) return toast.error("Ukuran file maksimal 1MB");

    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      await api.patch(`/orders/${orderId}/payment-proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Bukti pembayaran berhasil diupload.");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Gagal mengupload bukti pembayaran.");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success("Pesanan berhasil dibatalkan.");
      setRefresh((prev) => prev + 1);
    } catch {
      toast.error("Gagal membatalkan pesanan.");
    }
  };

  return (
    <>
      <SEO title="Riwayat Pesanan | Nestion" description="Kelola pesanan dan pembayaran Anda." />
      <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Riwayat Pesanan Saya</h1>
            <p className="text-sm text-slate-500">Pantau status reservasi dan lakukan pembayaran di sini.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari No. Order..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-full md:w-48 border rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                title="Filter berdasarkan tanggal order"
              />
            </div>
            
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full md:w-48 border rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="">Semua Status</option>
              <option value="MENUNGGU_PEMBAYARAN">Menunggu Pembayaran</option>
              <option value="MENUNGGU_KONFIRMASI_PEMBAYARAN">Menunggu Konfirmasi</option>
              <option value="DIPROSES">Diproses</option>
              <option value="DIBATALKAN">Dibatalkan</option>
            </select>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Memuat pesanan...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border">Belum ada pesanan ditemukan.</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{order.orderNumber}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === "DIPROSES" ? "bg-emerald-100 text-emerald-800" :
                        order.status === "MENUNGGU_PEMBAYARAN" ? "bg-amber-100 text-amber-800" :
                        order.status === "MENUNGGU_KONFIRMASI_PEMBAYARAN" ? "bg-blue-100 text-blue-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800">{order.room.property.name} - {order.room.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {order.checkInDate.split("T")[0]} s/d {order.checkOutDate.split("T")[0]}</span>
                      {order.status === "MENUNGGU_PEMBAYARAN" && (
                        <span className="flex items-center gap-1 text-rose-500 font-medium"><Clock className="w-3.5 h-3.5" /> Exp: {new Date(order.paymentExpiresAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-amber-600">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                  </div>

                  <div className="flex flex-col justify-center gap-2 min-w-50">
                    {order.status === "MENUNGGU_PEMBAYARAN" && (
                      <>
                        <label className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors">
                          <Upload className="w-4 h-4" /> Upload Bukti
                          <input type="file" accept=".jpg,.png" onChange={(e) => handleUploadProof(order.id, e)} className="hidden" />
                        </label>
                        <button onClick={() => handleCancelOrder(order.id)} className="border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <XCircle className="w-4 h-4" /> Batalkan
                        </button>
                      </>
                    )}
                    {order.paymentProofUrl && <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline text-center">Lihat Bukti Bayar</a>}
                  </div>
                </div>
              ))
            )}
          </div>

          {orders.length > 0 && (
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs text-slate-500">Halaman {page} dari {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-lg text-xs disabled:opacity-50">Sebelumnya</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-lg text-xs disabled:opacity-50">Berikutnya</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}