import logoImg from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Nestion Logo" className="h-7 w-auto" />
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Nestion
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Redefining luxury property rentals with seamless booking and flexible stay pricing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Help Center</a></li>
              <li><a href="#" className="hover:text-slate-900">AirCover Protection</a></li>
              <li><a href="#" className="hover:text-slate-900">Cancellation Options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Hosting</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Nestion your home</a></li>
              <li><a href="#" className="hover:text-slate-900">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:text-slate-900">Community Forum</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">About Us</a></li>
              <li><a href="#" className="hover:text-slate-900">Careers</a></li>
              <li><a href="#" className="hover:text-slate-900">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Nestion, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}