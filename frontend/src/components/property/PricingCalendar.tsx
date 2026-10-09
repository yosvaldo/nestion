import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PriceCalendarEntry } from "@/models/property.model";

interface PricingCalendarProps {
  priceData: PriceCalendarEntry[];
  checkInDate: string;
  checkOutDate: string;
  onSelectDate: (date: string) => void;
  currentMonth: number;
  currentYear: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

export default function PricingCalendar({ 
  priceData, checkInDate, checkOutDate, onSelectDate, currentMonth, currentYear, onNextMonth, onPrevMonth 
}: PricingCalendarProps) {
  
  const formatRupiah = (price: number) => {
    if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(1)}Jt`;
    if (price >= 1000) return `Rp ${(price / 1000).toFixed(0)}rb`;
    return `Rp ${price}`;
  };

  if (priceData.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
        Pilih kamar untuk melihat ketersediaan tanggal.
      </div>
    );
  }

  const monthLabel = new Date(currentYear, currentMonth - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm font-sans">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-bold text-slate-900">{monthLabel}</h3>
        <div className="flex gap-2">
          <button onClick={onPrevMonth} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={onNextMonth} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-7 gap-1.5 md:gap-2">
        {priceData.map((day) => {
          const isCheckIn = checkInDate === day.date;
          const isCheckOut = checkOutDate === day.date;
          const isUnavailable = day.isAvailable === false;
          
          const inDateObj = checkInDate ? new Date(checkInDate) : null;
          const outDateObj = checkOutDate ? new Date(checkOutDate) : null;
          const currDateObj = new Date(day.date);
          const isInRange = inDateObj && outDateObj && currDateObj > inDateObj && currDateObj < outDateObj;

          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString("id-ID", { weekday: "short" });
          const dayNumber = dateObj.getDate();

          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              disabled={isUnavailable}
              className={`p-1.5 md:p-2 min-h-18 md:min-h-22 w-full border flex flex-col items-center justify-center transition-all relative overflow-hidden rounded-xl ${
                isUnavailable
                  ? "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed"
                  : (isCheckIn || isCheckOut)
                  ? "bg-amber-600 border-amber-600 text-white shadow-md z-10"
                  : isInRange
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : day.isPeakSeason
                  ? "bg-rose-50 border-rose-200 text-rose-900 hover:border-rose-300"
                  : "bg-white border-slate-200 text-slate-700 hover:border-amber-400"
              }`}
            >
              <span className={`text-[9px] md:text-[10px] uppercase font-semibold ${isCheckIn || isCheckOut ? "text-amber-100" : "text-slate-400"}`}>
                {dayName}
              </span>
              <span className={`text-sm md:text-base font-extrabold leading-tight mt-0.5 ${(isCheckIn || isCheckOut) ? "text-white" : isUnavailable ? "text-slate-400" : "text-slate-800"}`}>
                {dayNumber}
              </span>
              {!isUnavailable && (
                // PERBAIKAN CSS: Hapus truncate, gunakan responsif text sizing
                <span className={`text-[9px] md:text-xs font-bold w-full text-center mt-1 leading-none ${(isCheckIn || isCheckOut) ? "text-white" : day.isPeakSeason ? "text-rose-600" : "text-amber-600"}`}>
                  {formatRupiah(day.price)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}