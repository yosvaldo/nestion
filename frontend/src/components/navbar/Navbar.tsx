import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: "USER" | "TENANT";
  onLogout?: () => void;
}

export default function Navbar({
  isAuthenticated,
  userRole,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <UserMenu
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onLogout={onLogout}
        />
      </div>
    </nav>
  );
}