import { Spinner } from "@/components/ui/spinner";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-10 text-amber-600" />
        <p className="text-sm font-medium text-slate-600">Loading Nestion...</p>
      </div>
    </div>
  );
}