import { Outlet, Link, useLocation } from "react-router-dom";
import { Building, Receipt, BarChart3, Menu } from "lucide-react";
import Logo from "../navbar/Logo";
import UserMenu from "../navbar/UserMenu";
import { useState } from "react";

export default function TenantLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Properties", path: "/tenant", icon: Building },
    { name: "Transactions", path: "/tenant/orders", icon: Receipt },
    { name: "Reports", path: "/tenant/reports", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Logo />
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = 
              item.path === "/tenant"
              ? location.pathname === "/tenant" ||
              location.pathname.startsWith("/tenant/properties") ||
              location.pathname.startsWith("/tenant/rooms")
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            
              const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? "bg-amber-50 text-amber-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5" /> {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>
          <div className="hidden md:block"></div>
          <UserMenu />
        </header>

        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-b border-slate-200 px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600"
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}