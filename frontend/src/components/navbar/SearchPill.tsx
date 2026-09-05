import { Search } from "lucide-react";

interface SearchPillProps {
  onOpenSearch?: () => void;
}

export default function SearchPill({ onOpenSearch }: SearchPillProps) {
  return (
    <button
      onClick={onOpenSearch}
      className="flex items-center gap-4 px-4 py-2 bg-white/80 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-slate-700"
    >
      <span className="font-semibold text-slate-900 pl-1">
        Any Destination
      </span>
      <span className="h-4 w-px bg-slate-200" />
      <span>Any Week</span>
      <span className="h-4 w-px bg-slate-200" />
      <span className="text-slate-400 font-normal">Add Guests</span>
      <div className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transition-colors ml-1">
        <Search className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}