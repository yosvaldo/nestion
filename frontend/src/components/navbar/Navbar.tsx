import Logo from "./Logo";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <UserMenu />
      </div>
    </nav>
  );
}