import Logo from "./Logo";
import SearchPill from "./SearchPill";
import UserMenu from "./UserMenu";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: "USER" | "TENANT";
  onLogout?: () => void;
  onOpenSearch?: () => void;
}

export default function Navbar({
  isAuthenticated,
  userRole,
  onLogout,
  onOpenSearch,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Logo />
        <div className="hidden md:block">
          <SearchPill onOpenSearch={onOpenSearch} />
        </div>
        <UserMenu
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onLogout={onLogout}
        />
      </div>
    </nav>
  );
}