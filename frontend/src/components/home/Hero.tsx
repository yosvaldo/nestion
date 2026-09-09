import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Nikmati Staycation Terbaik di Bali",
    subtitle: "Dapatkan penawaran khusus liburan pekan ini.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Penginapan Nyaman di Bandung",
    subtitle: "Suasana sejuk dan pemandangan alam memukau.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Eksplorasi Keindahan Yogyakarta",
    subtitle: "Temukan villa & hotel unik dengan harga terjangkau.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-90 sm:h-105 rounded-3xl overflow-hidden shadow-lg font-sans">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-10 left-6 sm:left-10 text-white max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 leading-tight">{slide.title}</h2>
            <p className="text-sm sm:text-base text-slate-200">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      <button
        onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full shadow transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full shadow transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 right-6 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-amber-500" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}