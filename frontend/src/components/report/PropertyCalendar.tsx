import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IRoomCalendar, ICalendarOrder } from "@/models/report.model";

interface PropertyCalendarProps {
  rooms: IRoomCalendar[];
  loading: boolean;
}

export default function PropertyCalendar({ rooms, loading }: PropertyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }).map((_, i) => new Date(year, month, i + 1));

  const uniqueRooms = useMemo(() => {
    const grouped = rooms.reduce((acc, room) => {
      const key = `${room.property.name}-${room.name}`;
      if (!acc[key]) {
        acc[key] = { ...room, orders: [...room.orders] };
      } else {
        acc[key].orders.push(...room.orders);
      }
      return acc;
    }, {} as Record<string, IRoomCalendar>);
    
    return Object.values(grouped);
  }, [rooms]);

  const checkAvailable = (date: Date, orders: ICalendarOrder[]) => {
    const target = new Date(date).setHours(0, 0, 0, 0);
    return !orders.some((o) => {
      const ci = new Date(o.checkInDate).setHours(0, 0, 0, 0);
      const co = new Date(o.checkOutDate).setHours(0, 0, 0, 0);
      return target >= ci && target < co;
    });
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4 p-4">
      <div className="flex justify-between items-center px-2 py-2">
        <h2 className="text-lg font-bold text-slate-900">
          {currentMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 border rounded-xl hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-2 border rounded-xl hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold sticky left-0 bg-slate-50 z-10 min-w-48 shadow-sm">
                Property & Room
              </th>
              {daysArray.map((d, i) => (
                <th key={i} className="px-2 py-3 font-semibold text-center min-w-10">
                  <div>{d.getDate()}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {d.toLocaleDateString("id-ID", { weekday: "short" })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={daysInMonth + 1} className="text-center py-10">Loading...</td></tr>
            ) : uniqueRooms.length === 0 ? (
              <tr><td colSpan={daysInMonth + 1} className="text-center py-10 text-slate-500">No properties found.</td></tr>
            ) : (
              uniqueRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900 sticky left-0 bg-white shadow-sm">
                    <div>{room.property.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{room.name}</div>
                  </td>
                  {daysArray.map((d, i) => {
                    const isAvail = checkAvailable(d, room.orders);
                    return (
                      <td key={i} className="px-1 py-3 text-center border-l border-slate-50">
                        <span 
                          className={`inline-block w-3 h-3 rounded-full ${isAvail ? "bg-blue-500" : "bg-red-500"}`} 
                          title={`${d.toLocaleDateString("id-ID")}: ${isAvail ? "Available" : "Booked"}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 flex gap-6 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /> Available</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Booked</div>
      </div>
    </div>
  );
}