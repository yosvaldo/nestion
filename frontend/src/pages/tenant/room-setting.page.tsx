import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { toast } from "sonner";
import { Save, AlertTriangle, ArrowLeft } from "lucide-react";
import type { PriceType } from "@/models/room-management.model";

interface Holiday {
  tanggal: string;
  keterangan: string;
}

export default function RoomSettingsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const [uForm, setUForm] = useState({ start: "", end: "", reason: "" });
  const [pForm, setPForm] = useState({ start: "", end: "", type: "PERCENTAGE" as PriceType, val: "" });

  useEffect(() => {
    let isMounted = true;
    const fetchInit = async () => {
      setLoading(true);
      try {
        const d = new Date();
        const res = await api.get(`/services/holidays?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
        if (isMounted) {
          if (res.data) setHolidays(res.data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setHolidays([]);
          setLoading(false);
        }
      }
    };
    fetchInit();
    return () => { isMounted = false; };
  }, []);

  const handleUnavail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uForm.start || !uForm.end) return toast.error("Dates required.");
    setSaving(true);
    try {
      await api.post(`/tenant/rooms/${roomId}/unavailability`, { startDate: uForm.start, endDate: uForm.end, reason: uForm.reason });
      toast.success("Room marked unavailable.");
      setUForm({ start: "", end: "", reason: "" });
      setSaving(false);
    } catch {
      toast.error("Failed to update availability.");
      setSaving(false);
    }
  };

  const handlePeak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pForm.start || !pForm.end || !pForm.val) return toast.error("All fields required.");
    setSaving(true);
    try {
      await api.post(`/tenant/rooms/${roomId}/peak-rates`, { startDate: pForm.start, endDate: pForm.end, priceType: pForm.type, value: Number(pForm.val) });
      toast.success("Peak season rate applied.");
      setPForm({ start: "", end: "", type: "PERCENTAGE", val: "" });
      setSaving(false);
    } catch {
      toast.error("Failed to set peak rate.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Room Settings | Nestion" description="Manage room rates." />
      <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 border rounded-xl hover:bg-slate-100"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Room Settings</h1>
              <p className="text-sm text-slate-500">Manage availability and peak season rates.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500" />Block Availability</h3>
              <form onSubmit={handleUnavail} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label><input type="date" value={uForm.start} onChange={e => setUForm({...uForm, start: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label><input type="date" value={uForm.end} onChange={e => setUForm({...uForm, end: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                </div>
                <div><label className="text-xs font-semibold text-slate-600 block mb-1">Reason (Optional)</label><input type="text" value={uForm.reason} onChange={e => setUForm({...uForm, reason: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
                <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 disabled:opacity-50"><Save className="w-4 h-4" /> Save</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
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
              
              {holidays.length > 0 && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Upcoming Holidays</h4>
                  <ul className="text-xs text-amber-700 space-y-1">{holidays.slice(0, 3).map((h, i) => <li key={i}>• {h.tanggal}: {h.keterangan}</li>)}</ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}