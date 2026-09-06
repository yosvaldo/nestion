import logoImg from "@/assets/logo.png";
import { Instagram, Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Nestion Logo" className="h-7 w-auto object-contain" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">Nestion</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <p className="text-sm text-slate-500 whitespace-nowrap">
            Ingat Staycation, Ingat Nestion.
          </p>
        </div>
          
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-slate-900">Connect with Us</span>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/phenexfishingline/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-amber-600 transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Instagram</span>
            </a>
            <a 
            href="https://www.tiktok.com/@phenexfishingline"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-amber-600 transition-colors"
            >
              <Video className="w-4 h-4 text-slate-900" />
              <span>Tiktok</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}