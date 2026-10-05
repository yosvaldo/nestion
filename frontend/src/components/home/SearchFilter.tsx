import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export interface SearchData {
  destination: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCapacity?: number;
}

interface SearchFilterFormProps {
  onSearch?: (filters: SearchData) => void;
}

export default function SearchFilterForm({ onSearch }: SearchFilterFormProps) {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [duration, setDuration] = useState("1");
  const [guests, setGuests] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      let checkOutDate = "";
      
      if (checkIn && duration) {
        const date = new Date(checkIn);
        date.setDate(date.getDate() + parseInt(duration));
        checkOutDate = date.toISOString().split('T')[0];
      }

      onSearch({ 
        destination, 
        checkInDate: checkIn || undefined, 
        checkOutDate: checkOutDate || undefined, 
        guestCapacity: parseInt(guests) || 1
      });
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
        <input
          type="text"
          placeholder="Ketik kota tujuan (Contoh: Surabaya)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
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
          <div className="relative w-28">
            <input
              type="number"
              min="1"
              placeholder="Malam"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-2 pr-8 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">Malam</span>
          </div>
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