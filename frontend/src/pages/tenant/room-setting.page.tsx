import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { toast } from "sonner";
import { Save, AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import type { PriceType } from "@/models/room-management.model";

interface Holiday { date: string; name: string; type: string; }
interface Block { id: string; unavailabilityDate: string; reason: string | null; }
interface Peak { id: string; startDate: string; endDate: string; rateType: PriceType; rateValue: number; }

export default function RoomSettingsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [peaks, setPeaks] = useState<Peak[]>([]);

  const [uForm, setUForm] = useState({ start: "", end: "", reason: "" });
  const [pForm, setPForm] = useState({ start: "", end: "", type: "PERCENTAGE" as PriceType, val: "" });

  const fetchLists = useCallback(async () => {
    try {
      const [bRes, pRes] = await Promise.all([
        api.get(`/room-management/${roomId}/unavailability`),
        api.get(`/room-management/${roomId}/peak-season`)
      ]);
      setBlocks(bRes.data.data || []);
      setPeaks(pRes.data.data || []);
    } catch {
      toast.error("Gagal memuat daftar pengaturan ruangan.");
    }
  }, [roomId]);

  useEffect(() => {
    const fetchInit = async () => {
      setLoading(true);
      try {
        const d = new Date();
        const holidayRes = await api.get(`/room-management/holidays?year=${d.getFullYear()}`).catch(() => ({ data: { data: [] } }));
        setHolidays(holidayRes.data.data || []);
        await fetchLists();
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, [fetchLists]);

  const handleUnavail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uForm.start || !uForm.end) return toast.error("Tanggal wajib diisi.");
    setSaving(true);
    try {
      await api.post(`/room-management/${roomId}/unavailability`, { startDate: uForm.start, endDate: uForm.end, reason: uForm.reason });
      toast.success("Kamar berhasil diblokir.");
      setUForm({ start: "", end: "", reason: "" });
      fetchLists();
    } catch { toast.error("Gagal menyimpan data."); } finally { setSaving(false); }
  };

  const handlePeak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pForm.start || !pForm.end || !pForm.val) return toast.error("Semua field wajib diisi.");
    setSaving(true);
    try {
      await api.post(`/room-management/${roomId}/peak-season`, { startDate: pForm.start, endDate: pForm.end, priceType: pForm.type, value: Number(pForm.val) });
      toast.success("Tarif Peak Season diterapkan.");
      setPForm({ start: "", end: "", type: "PERCENTAGE", val: "" });
      fetchLists();
    } catch { toast.error("Gagal menyimpan tarif."); } finally { setSaving(false); }
  };

  const deleteBlock = async (id: string) => {
    try { await api.delete(`/room-management/unavailability/${id}`); setBlocks(prev => prev.filter(b => b.id !== id)); toast.success("Dihapus."); } 
    catch { toast.error("Gagal menghapus."); }
  };

  const deletePeak = async (id: string) => {
    try { await api.delete(`/room-management/peak-season/${id}`); setPeaks(prev => prev.filter(p => p.id !== id)); toast.success("Dihapus."); } 
    catch { toast.error("Gagal menghapus."); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div></div>;

  return (
    <>
      <SEO title="Pengaturan Room | Nestion" description="Manage room rates." />
      <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 border rounded-xl hover:bg-slate-100"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-2xl font-bold text-slate-900">Room Settings</h1><p className="text-sm text-slate-500">Manage availability and peak season rates.</p></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500" />Block Availability</h3>
              <form onSubmit={handleUnavail} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label><input type="date" value={uForm.start} onChange={e => setUForm({...uForm, start: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label><input type="date" value={uForm.end} onChange={e => setUForm({...uForm, end: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                </div>
                <div><label className="text-xs font-semibold text-slate-600 block mb-1">Reason (Optional)</label><input type="text" value={uForm.reason} onChange={e => setUForm({...uForm, reason: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 disabled:opacity-50"><Save className="w-4 h-4" /> Save</button>
              </form>

              {blocks.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-bold mb-3 text-slate-800">Tanggal Terblokir</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {blocks.map(b => (
                      <div key={b.id} className="flex justify-between items-center p-3 border rounded-xl bg-slate-50 text-sm">
                        <div>
                          <p className="font-semibold">{new Date(b.unavailabilityDate).toLocaleDateString("id-ID")}</p>
                          {b.reason && <p className="text-xs text-slate-500">{b.reason}</p>}
                        </div>
                        <button onClick={() => deleteBlock(b.id)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
              <h3 className="font-bold text-lg mb-4 text-amber-600">Peak Season Rates</h3>
              <form onSubmit={handlePeak} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label><input type="date" value={pForm.start} onChange={e => setPForm({...pForm, start: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label><input type="date" value={pForm.end} onChange={e => setPForm({...pForm, end: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/3"><label className="text-xs font-semibold text-slate-600 block mb-1">Type</label><select value={pForm.type} onChange={e => setPForm({...pForm, type: e.target.value as PriceType})} className="w-full border rounded-xl px-2 py-2 text-sm"><option value="PERCENTAGE">%</option><option value="NOMINAL">Rp</option></select></div>
                  <div className="w-2/3"><label className="text-xs font-semibold text-slate-600 block mb-1">Value</label><input type="number" min="1" value={pForm.val} onChange={e => setPForm({...pForm, val: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                </div>
                <button type="submit" disabled={saving} className="w-full bg-amber-600 text-white font-semibold py-2.5 rounded-xl flex justify-center items-center gap-2 hover:bg-amber-700 disabled:opacity-50"><Save className="w-4 h-4" /> Save</button>
              </form>

              {peaks.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-bold mb-3 text-slate-800">Tarif Aktif</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {peaks.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 border rounded-xl bg-amber-50/50 text-sm">
                        <div>
                          <p className="text-xs text-slate-500">{new Date(p.startDate).toLocaleDateString("id-ID")} - {new Date(p.endDate).toLocaleDateString("id-ID")}</p>
                          <p className="font-bold text-amber-700">+{p.rateType === "PERCENTAGE" ? `${p.rateValue}%` : `Rp ${p.rateValue.toLocaleString()}`}</p>
                        </div>
                        <button onClick={() => deletePeak(p.id)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Libur Nasional {new Date().getFullYear()}</h4>
                {holidays.length > 0 ? (
                  <div className="max-h-56 overflow-y-auto pr-2">
                    <ul className="text-xs text-slate-600 space-y-2">
                      {holidays.map((h, i) => (
                        <li key={i} className="border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-800">{new Date(h.date).toLocaleDateString("id-ID")}</span>
                            {h.type === "leave" && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">Cuti Bersama</span>
                            )}
                          </div>
                          <span className="leading-tight inline-block">{h.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Tidak ada data libur atau API tidak merespons.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}