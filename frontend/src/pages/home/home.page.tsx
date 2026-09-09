import SEO from "@/components/seo/seo";
import HeroCarousel from "@/components/home/Hero";
import SearchFilterForm from "@/components/home/SearchFilter";
import PropertyList from "@/components/home/PropertyList";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Nestion | Ingat Staycation, Ingat Nestion"
        description="Pesan penginapan yang kamu banget."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <HeroCarousel />
        <SearchFilterForm />
        <PropertyList />
      </div>
    </>
  );
}