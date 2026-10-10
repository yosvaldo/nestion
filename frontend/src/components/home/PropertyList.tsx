import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { PropertyFilterParams } from "../../models/property.model";
import type { PropertyResponse } from "../../pages/home/home.page";
import { Link } from "react-router-dom";
import api from "@/configs/api.config";
import { useDebounce } from "@/hooks/use-debounce";

interface PropertyListProps {
  properties: PropertyResponse[];
  loading: boolean;
  filters: PropertyFilterParams;
  totalPages: number;
  onFilterChange: (updates: Partial<PropertyFilterParams>) => void;
}

export default function PropertyList({ properties, loading, filters, totalPages, onFilterChange }: PropertyListProps) {
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (isMounted) setCategories(res.data.data);
      } catch {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm !== (filters.name || "")) {
      onFilterChange({ name: debouncedSearchTerm, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filters.name]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("-") as ["price" | "name", "asc" | "desc"];
    onFilterChange({ sortBy, sortOrder, page: 1 });
  };

  return (
    <div className="mt-16 font-sans">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Rekomendasi Penginapan</h3>
          <p className="text-sm text-slate-500">Harga terendah yang tersedia untuk tanggal pilihan Anda</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search by Name */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama properti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-56"
            />
          </div>

          <select
            value={filters.categoryId || ""}
            onChange={(e) => onFilterChange({ categoryId: e.target.value, page: 1 })}
            className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-36"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={`${filters.sortBy || "price"}-${filters.sortOrder || "asc"}`}
            onChange={handleSortChange}
            className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          >
            <option value="price-asc">Harga: Termurah</option>
            <option value="price-desc">Harga: Termahal</option>
            <option value="name-asc">Nama: A - Z</option>
            <option value="name-desc">Nama: Z - A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">Tidak ada properti yang ditemukan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((item) => (
              <div key={item.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                  <img
                    src={item.pictureUrls?.[0] || "https://placehold.co/600x400?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    {item.category?.name || "Uncategorized"}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-400">{item.city}</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating || 0}</span>
                    </div>
                  </div>

                  <Link to={`/properties/${item.id}?checkInDate=${filters.checkInDate || ""}&checkOutDate=${filters.checkOutDate || ""}`}>
                    <h4 className="font-bold text-slate-900 text-base mb-3 line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h4>
                  </Link>

                  <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Mulai dari</span>
                    <p className="text-sm font-extrabold text-slate-900">
                      Rp {item.lowestPrice.toLocaleString("id-ID")}
                      <span className="text-[10px] font-normal text-slate-500"> /malam</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={filters.page === 1}
                onClick={() => onFilterChange({ page: (filters.page || 1) - 1 })}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-slate-600">
                Halaman {filters.page} dari {totalPages}
              </span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => onFilterChange({ page: (filters.page || 1) + 1 })}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}