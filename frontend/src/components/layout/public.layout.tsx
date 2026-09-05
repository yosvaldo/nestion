import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "./footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}