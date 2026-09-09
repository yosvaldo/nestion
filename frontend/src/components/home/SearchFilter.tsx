import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";

interface SearchFilterFormProps {
  onSearch?: (filters: { destination: string; checkIn: string; duration: string; guests: string }) => void;
}

export default function SearchFilterForm({ onSearch }: SearchFilterFormProps) {
  const [destination, setDestination] = useState("Bali");
  const [checkIn, setCheckIn] = useState("");
  const [duration, setDuration] = useState("1");
  const [guests, setGuests] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ destination, checkIn, duration, guests });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-xl -mt-10 relative z-30 max-w-5xl mx-auto font-sans grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
    >
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          Destinasi
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="Bali">Bali</option>
          <option value="Bandung">Bandung</option>
          <option value="Yogyakarta">Yogyakarta</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Surabaya">Surabaya</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          Tanggal & Durasi
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-28 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="1">1 Malam</option>
            <option value="2">2 Malam</option>
            <option value="3">3 Malam</option>
            <option value="7">1 Minggu</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-amber-600" />
          Tamu
        </label>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Jumlah Tamu"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Search className="w-4 h-4" />
        <span>Cari Penginapan</span>
      </button>
    </form>
  );
}