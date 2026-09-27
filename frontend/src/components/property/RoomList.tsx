import { Users, Info } from "lucide-react";
import type { RoomResponse } from "@/models/property.type";

interface RoomListProps {
  rooms: RoomResponse[];
  onSelectRoom: (roomId: string) => void;
  selectedRoomId?: string;
}

export default function RoomList({ rooms, onSelectRoom, selectedRoomId }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-slate-500 font-medium">No rooms available for this property at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Available Rooms</h3>
      {rooms.map((room) => (
        <div 
          key={room.id} 
          className={`p-5 rounded-2xl border transition-all ${
            selectedRoomId === room.id 
              ? "border-amber-500 bg-amber-50/30 shadow-md" 
              : "border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900">{room.name}</h4>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 font-medium">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Up to {room.guestCapacity} guests</span>
              </div>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {room.description || "No description provided."}
              </p>
            </div>
            
            <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-50">
              <div>
                <span className="text-xs text-slate-500 font-medium">Base Price</span>
                <p className="text-xl font-extrabold text-amber-600">
                  Rp {room.basePrice.toLocaleString("id-ID")}
                  <span className="text-xs text-slate-500 font-normal"> /night</span>
                </p>
              </div>
              
              <button 
                onClick={() => onSelectRoom(room.id)}
                className={`w-full md:w-auto mt-4 px-6 py-2.5 rounded-xl font-semibold transition-colors ${
                  selectedRoomId === room.id
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {selectedRoomId === room.id ? "Selected" : "Select Room"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}