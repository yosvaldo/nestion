import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import HeroCarousel from "@/components/home/Hero";
import SearchFilterForm from "@/components/home/SearchFilter";
import PropertyList from "@/components/home/PropertyList";
import type { PropertyFilterParams } from "@/models/property.model";

export interface PropertyResponse {
  id: string;
  name: string;
  city: string;
  category: { name: string };
  lowestPrice: number;
  rating: number;
  pictureUrls: string[];
}

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState<PropertyFilterParams>({
    page: 1,
    limit: 10,
    sortBy: "price",
    sortOrder: "asc",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await api.get("/properties", { params: filters });
        setProperties(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setLoading(false);
      } catch(error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters]);

  const handleHeroSearch = (searchData: { destination: string; checkInDate?: string; checkOutDate?: string; guestCapacity?: number }) => {
    setFilters((prev: PropertyFilterParams) => ({
      ...prev,
      city: searchData.destination,
      checkInDate: searchData.checkInDate,
      checkOutDate: searchData.checkOutDate,
      guestCapacity: searchData.guestCapacity,
      page: 1, 
    }));
  };

  const handleListFilterChange = (updates: Partial<PropertyFilterParams>) => {
    setFilters((prev: PropertyFilterParams) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <SEO
        title="Nestion | Ingat Staycation, Ingat Nestion"
        description="Pesan penginapan yang kamu banget."
      />
      <main className="min-h-screen bg-slate-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <HeroCarousel />
          <SearchFilterForm onSearch={handleHeroSearch} />
          <PropertyList 
            properties={properties}
            loading={loading}
            filters={filters}
            totalPages={totalPages}
            onFilterChange={handleListFilterChange}
          />
        </div>
      </main>
    </>
  );
}