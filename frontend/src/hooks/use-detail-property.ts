import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/configs/api.config";
import { toast } from "sonner";
import useAuthStore from "@/stores/authStore";
import type { PropertyDetailResponse, PriceCalendarEntry } from "@/models/property.model";

export function usePropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();  
  const initialCheckIn = searchParams.get("checkInDate") || "";
  const initialCheckOut = searchParams.get("checkOutDate") || "";  
  const user = useAuthStore((state) => state.user);
  const [property, setProperty] = useState<PropertyDetailResponse | null>(null);
  const [calendarData, setCalendarData] = useState<PriceCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
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
      setIsCalendarLoading(true);
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
      } finally {
        setIsCalendarLoading(false);
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

  let firstUnavailableDate = "";
  if (checkInDate && !checkOutDate) {
    const inDate = new Date(checkInDate);
    const futureDates = calendarData.filter(d => new Date(d.date) > inDate);
    futureDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstUnavail = futureDates.find(d => !d.isAvailable);
    if (firstUnavail) firstUnavailableDate = firstUnavail.date;
  }

  const displayCalendarData = calendarData.map(day => ({
    ...day,
    isAvailable: day.date === firstUnavailableDate ? true : day.isAvailable
  }));

  return {
    property, loading, isCalendarLoading, selectedRoomId, setSelectedRoomId,
    checkInDate, checkOutDate, currentMonth, currentYear, isBooking,
    displayCalendarData, handleDateSelection, handleBookNow,
    handleNextMonth, handlePrevMonth
  };
}