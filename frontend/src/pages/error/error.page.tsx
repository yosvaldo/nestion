import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
      <div className="flex flex-col gap-4 items-center justify-center text-center">
        <h3 className="text-3xl font-extrabold text-slate-900">Oops! Something went wrong.</h3>
        <p className="text-sm text-slate-500">
          Error: {error instanceof Error ? error.message : "An unexpected error occurred."}
        </p>
      </div>
    </div>
  );
}