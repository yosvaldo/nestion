import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import RoomList from "@/components/property/RoomList";
import PricingCalendar from "@/components/property/PricingCalendar";
import { MapPin } from "lucide-react";
import type { PropertyDetailResponse, PriceCalendarEntry } from "@/models/property.type";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<PropertyDetailResponse | null>(null);
  const [calendarData, setCalendarData] = useState<PriceCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchPropertyDetail = async () => {
      setLoading(true);
      try {
        const propRes = await api.get(`/properties/${id}`);
        
        if (isMounted) {
          setProperty(propRes.data.data);
          
          const rooms = propRes.data.data.rooms;
          if (rooms && rooms.length > 0) {
            setSelectedRoomId(rooms[0].id);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
          navigate("/error");
        }
      }
    };

    if (id) fetchPropertyDetail();
    
    return () => { isMounted = false; };
  }, [id, navigate]);

  useEffect(() => {
    let isMounted = true;

    const fetchPricingCalendar = async () => {
      if (!selectedRoomId) return;
      try {
        const calRes = await api.get(`/properties/calendar/${selectedRoomId}`);
        if (isMounted) setCalendarData(calRes.data.data);
      } catch {
        if (isMounted) setCalendarData([]);
      }
    };

    fetchPricingCalendar();
    
    return () => { isMounted = false; };
  }, [selectedRoomId]);

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
            src={property.pictureUrls[0] || "https://placehold.co/1200x600?text=No+Image"} 
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <RoomList 
                rooms={property.rooms} 
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <PricingCalendar 
                  priceData={calendarData} 
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                  <h4 className="font-bold mb-4">Reservation Summary</h4>
                  {selectedRoomId && selectedDate ? (
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-xl transition-colors">
                      Book Now
                    </button>
                  ) : (
                    <p className="text-sm text-slate-400">Please select a room and date to continue booking.</p>
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