import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown, Check } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import api from "@/configs/api.config";

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
  const [cities, setCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedDestination = useDebounce(destination, 500);

  useEffect(() => {
    let isMounted = true;
    const fetchAvailableCities = async () => {
      try {
        const res = await api.get("/properties/cities");
        if (isMounted) setCities(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data kota:", error);
      }
    };
    fetchAvailableCities();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!onSearch) return;
    let checkOutDate = "";
    if (checkIn && duration) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + parseInt(duration));
      checkOutDate = date.toISOString().split('T')[0];
    }
    onSearch({ 
      destination: debouncedDestination, 
      checkInDate: checkIn || undefined, 
      checkOutDate: checkOutDate || undefined, 
      guestCapacity: parseInt(guests) || 1
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDestination, checkIn, duration, guests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSearch) return;
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
  };

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-xl -mt-10 relative z-30 max-w-5xl mx-auto font-sans grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
    >
      <div className="relative" ref={dropdownRef}>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          Destinasi
        </label>       
        <div 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className={`truncate ${destination ? "text-slate-800" : "text-slate-400"}`}>
            {destination || "Pilih kota tujuan..."}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </div>
        {isDropdownOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full sm:w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Search className="w-4 h-4 text-slate-400 ml-1" />
              <input
                autoFocus
                type="text"
                placeholder="Cari kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm py-1.5 focus:outline-none text-slate-800"
              />
            </div>            
            <ul className="max-h-60 overflow-y-auto p-1.5">
              {cities.length === 0 ? (
                <li className="px-3 py-4 text-sm text-slate-500 text-center">Belum ada kota yang tersedia.</li>
              ) : filteredCities.length === 0 ? (
                <li className="px-3 py-4 text-sm text-slate-500 text-center">Kota tidak ditemukan.</li>
              ) : (
                filteredCities.map(city => (
                  <li
                    key={city}
                    onClick={() => {
                      setDestination(city);
                      setIsDropdownOpen(false);
                      setSearchQuery("");
                    }}
                    className="px-3 py-2.5 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="truncate pr-4">{city}</span>
                    {destination === city && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
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