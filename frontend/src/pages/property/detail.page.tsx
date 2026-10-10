import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import RoomList from "@/components/property/RoomList";
import PricingCalendar from "@/components/property/PricingCalendar";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import type { PropertyDetailResponse, PriceCalendarEntry } from "@/models/property.model";
import useAuthStore from "@/stores/authStore"; 

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCheckIn = searchParams.get("checkInDate") || "";
  const initialCheckOut = searchParams.get("checkOutDate") || "";  
  const user = useAuthStore((state) => state.user);
  const [property, setProperty] = useState<PropertyDetailResponse | null>(null);
  const [calendarData, setCalendarData] = useState<PriceCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<string>(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(initialCheckOut);
  const initialDate = initialCheckIn ? new Date(initialCheckIn) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setLoading(true);
      try {
        const propRes = await api.get(`/properties/${id}`);        
        setProperty(propRes.data.data);          
      } catch {
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetail();
  }, [id, navigate]);

  useEffect(() => {
    const fetchPricingCalendar = async () => {
      if (!selectedRoomId) return;
      try {
        const calRes = await api.get(`/properties/${id}/calendar?year=${currentYear}&month=${currentMonth}`);
        const propertyCalendar = calRes.data.data;
        type CalendarDay = { date: string; price: number; isAvailable: boolean };
        type RoomCalendar = { roomId: string; basePrice: number; calendar: CalendarDay[] };        
        const roomCal = propertyCalendar.rooms.find((r: RoomCalendar) => r.roomId === selectedRoomId);        
        if (roomCal) {
          const formatted = roomCal.calendar.map((day: CalendarDay) => ({
            date: day.date,
            price: day.price,
            isAvailable: day.isAvailable,
            isPeakSeason: day.price > roomCal.basePrice, 
          }));
          setCalendarData(formatted);
        }
      } catch {
        setCalendarData([]);
      }
    };
    fetchPricingCalendar();
  }, [selectedRoomId, id, currentMonth, currentYear]);

  const handleDateSelection = (date: string) => {
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0); 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (clickedDate < today) {
      toast.error("Tidak bisa memilih tanggal yang sudah berlalu.");
      return; 
    }
    const clickedDayData = calendarData.find(d => d.date === date);
    if (!checkInDate || (checkInDate && checkOutDate)) {
      if (clickedDayData && !clickedDayData.isAvailable) {
        toast.error("Tanggal ini sudah terpesan / tidak tersedia.");
        return;
      }
      setCheckInDate(date);
      setCheckOutDate("");
    } else {
      const inDate = new Date(checkInDate);
      if (clickedDate > inDate) {
        let isRangeAvailable = true;
        const currentDate = new Date(inDate);
        while (currentDate < clickedDate) {
          const yyyy = currentDate.getFullYear();
          const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
          const dd = String(currentDate.getDate()).padStart(2, "0");
          const dateString = `${yyyy}-${mm}-${dd}`;
          const dayData = calendarData.find(d => d.date === dateString);
          if (dayData && !dayData.isAvailable) {
            isRangeAvailable = false;
            break;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        if (!isRangeAvailable) {
          toast.error("Terdapat tanggal yang sudah dipesan di dalam rentang waktu tersebut.");
          return;
        }
        setCheckOutDate(date);
      } else {
        if (clickedDayData && !clickedDayData.isAvailable) {
          toast.error("Tanggal ini sudah terpesan / tidak tersedia.");
          return;
        }
        setCheckInDate(date);
        setCheckOutDate("");
      }
    }
  };

  const handleBookNow = async () => {
    if (!user || user.role !== "USER") {
      toast.error("Mohon daftar atau login untuk memesan");
      return; 
    }
    if (!checkInDate || !checkOutDate) return toast.error("Silakan lengkapi tanggal Check-In dan Check-Out.");
    setIsBooking(true);
    try {
      await api.post("/orders", { roomId: selectedRoomId, checkInDate, checkOutDate });
      toast.success("Pesanan dibuat! Selesaikan pembayaran.");
      navigate("/orders");
      setIsBooking(false);
    } catch {
      toast.error("Gagal membuat pesanan. Pastikan rentang tanggal tersedia.");
      setIsBooking(false);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1); }
    else { setCurrentMonth(m => m + 1); }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1); }
    else { setCurrentMonth(m => m - 1); }
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  let firstUnavailableDate = "";
  if (checkInDate && !checkOutDate) {
    const inDate = new Date(checkInDate);
    const futureDates = calendarData.filter(d => new Date(d.date) > inDate);
    futureDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstUnavail = futureDates.find(d => !d.isAvailable);
    if (firstUnavail) {
      firstUnavailableDate = firstUnavail.date;
    }
  }

  const displayCalendarData = calendarData.map(day => ({
    ...day,
    isAvailable: day.date === firstUnavailableDate ? true : day.isAvailable
  }));

  return (
    <>
      <SEO title={`${property.name} | Nestion`} description={property.description} />
      <main className="min-h-screen bg-slate-50 pb-24 font-sans">
        <div className="w-full h-64 md:h-96 bg-slate-200 relative">
          <img 
            src={property.pictureUrls?.[0] || "https://placehold.co/1200x600?text=No+Image"} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 mb-8">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {property.category?.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 mb-2">
              {property.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium mb-6">
              <MapPin className="w-4 h-4 text-amber-500" />
              {property.address}, {property.city}
            </div>
            <p className="text-slate-600 leading-relaxed max-w-4xl">
              {property.description}
            </p>
          </div>          
          <div className="flex flex-col gap-10">
            <div className="w-full">
              <RoomList 
                rooms={property.rooms} 
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
              />
            </div>            
            <div className="w-full flex flex-col gap-6 border-t border-slate-200 pt-10">
              <PricingCalendar 
                priceData={displayCalendarData} 
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onSelectDate={handleDateSelection}
                currentMonth={currentMonth}
                currentYear={currentYear}
                onNextMonth={handleNextMonth}
                onPrevMonth={handlePrevMonth}
              />              
              <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="font-bold text-xl mb-1">Reservation Summary</h4>
                  <p className="text-slate-400 text-sm">
                    {selectedRoomId && checkInDate && checkOutDate 
                      ? `Tanggal terpilih: ${checkInDate} s/d ${checkOutDate}`
                      : "Pilih kamar, lalu tentukan tanggal Check-In dan Check-Out untuk memesan."}
                  </p>
                </div>                
                <div className="w-full md:w-auto min-w-50">
                  {selectedRoomId && checkInDate && checkOutDate ? (
                    <button
                      onClick={handleBookNow}
                      disabled={isBooking}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 px-8 rounded-xl transition-colors disabled:opacity-50 text-lg"
                    >
                      {isBooking ? "Memproses..." : "Book Now"}
                    </button>
                  ) : (
                    <button disabled className="w-full bg-slate-800 text-slate-500 font-bold py-3.5 px-8 rounded-xl cursor-not-allowed">
                      Menunggu Pilihan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}