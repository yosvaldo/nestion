import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PriceCalendarEntry } from "@/models/property.model";

interface PricingCalendarProps {
  priceData: PriceCalendarEntry[];
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}

export default function PricingCalendar({ priceData, selectedDate, onSelectDate }: PricingCalendarProps) {
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-sans">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">30-Day Price Comparison</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {priceData.map((day) => {
          const isSelected = selectedDate === day.date;
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const dayNumber = dateObj.getDate();
          const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-amber-600 border-amber-600 text-white shadow-md"
                  : day.isPeakSeason
                  ? "bg-rose-50 border-rose-200 text-rose-900 hover:border-rose-300"
                  : "bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:shadow-sm"
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-amber-100" : "text-slate-400"}`}>
                {dayName}
              </span>
              <span className="text-xl font-extrabold mb-1">
                {dayNumber} <span className="text-sm font-medium">{monthName}</span>
              </span>
              <span className={`text-xs font-bold ${isSelected ? "text-white" : day.isPeakSeason ? "text-rose-600" : "text-amber-600"}`}>
                {formatRupiah(day.price)}
              </span>
              {day.isPeakSeason && !isSelected && (
                <span className="text-[9px] mt-1 bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-semibold">
                  High Season
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}