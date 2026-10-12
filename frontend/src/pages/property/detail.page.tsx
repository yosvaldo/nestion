import SEO from "@/components/seo/seo";
import RoomList from "@/components/property/RoomList";
import PricingCalendar from "@/components/property/PricingCalendar";
import { MapPin } from "lucide-react";
import { usePropertyDetail } from "@/hooks/use-detail-property";

export default function PropertyDetailPage() {
  const {
    property, loading, selectedRoomId, setSelectedRoomId,
    checkInDate, checkOutDate, currentMonth, currentYear, isBooking,
    displayCalendarData, handleDateSelection, handleBookNow,
    handleNextMonth, handlePrevMonth
  } = usePropertyDetail();

  if (loading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

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