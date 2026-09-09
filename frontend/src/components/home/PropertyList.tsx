import { useState } from "react";
import { Star, ArrowUpDown } from "lucide-react";

interface Property {
  id: string;
  name: string;
  city: string;
  category: string;
  pricePerNight: number;
  rating: number;
  image: string;
}

const mockProperties: Property[] = [
  {
    id: "1",
    name: "Ocean View Villa Seminyak",
    city: "Bali",
    category: "Villa",
    pricePerNight: 1200000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    name: "Dago Highland Resort",
    city: "Bandung",
    category: "Resort",
    pricePerNight: 850000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    name: "Malioboro Heritage Hotel",
    city: "Yogyakarta",
    category: "Hotel",
    pricePerNight: 550000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    name: "Ubud Peaceful Wooden Cabin",
    city: "Bali",
    category: "Cabin",
    pricePerNight: 950000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
  },
];

export default function PropertyList() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filtered = mockProperties
    .filter((item) => categoryFilter === "ALL" || item.category === categoryFilter)
    .sort((a, b) =>
      sortOrder === "asc" ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight
    );

  return (
    <div className="mt-12 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Rekomendasi Penginapan</h3>
          <p className="text-xs text-slate-500">Harga terendah yang tersedia untuk tanggal pilihan Anda</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Villa">Villa</option>
            <option value="Resort">Resort</option>
            <option value="Hotel">Hotel</option>
            <option value="Cabin">Cabin</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Harga: {sortOrder === "asc" ? "Termurah" : "Termahal"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-400">{item.city}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-3 line-clamp-1 group-hover:text-amber-600 transition-colors">
                {item.name}
              </h4>

              <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Mulai dari</span>
                <p className="text-sm font-extrabold text-slate-900">
                  Rp {item.pricePerNight.toLocaleString("id-ID")}
                  <span className="text-[10px] font-normal text-slate-500"> /malam</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}