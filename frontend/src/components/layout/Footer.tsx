import logoImg from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Nestion Logo" className="h-7 w-auto object-contain" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">Nestion</span>
          <span className="text-slate-300">|</span>
          <p className="text-sm text-slate-500 whitespace-nowrap">
          Ingat Staycation, Ingat Nestion.
          </p>
        </div>          
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-slate-900">Connect with Us</span>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a 
              href="https://www.instagram.com/phenexfishingline/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-amber-600 transition-colors"
            >
              Instagram
            </a>
            <a 
            href="https://www.tiktok.com/@phenexfishingline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-amber-600 transition-colors"
            >
              Tiktok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}