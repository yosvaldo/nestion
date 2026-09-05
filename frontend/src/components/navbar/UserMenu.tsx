import { Globe, Menu, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isAuthenticated?: boolean;
  userRole?: "USER" | "TENANT";
  onLogout?: () => void;
}

export default function UserMenu({
  isAuthenticated = false,
  userRole,
  onLogout,
}: UserMenuProps) {
  return (
    <div className="flex items-center gap-3 font-sans">
      {userRole !== "USER" && (
        <Link
          to="/tenant/register"
          className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-amber-600 transition-colors px-3 py-2 rounded-full"
        >
          Become a Host
        </Link>
      )}

      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        <Globe className="w-4 h-4" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 border border-slate-200 bg-white px-3 py-1.5 rounded-full hover:shadow-md transition-all">
            <Menu className="w-4 h-4 text-slate-600" />
            <div className="bg-slate-200 text-slate-600 p-1 rounded-full">
              <UserIcon className="w-4 h-4" />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl p-2 shadow-xl border-slate-100 bg-white"
        >
          {!isAuthenticated ? (
            <>
              <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer">
                <Link to="/login">Log in</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link to="/register">Sign up</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link to="/tenant/register">Register as Tenant</Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild className="rounded-xl font-semibold cursor-pointer">
                <Link to="/profile">My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link to="/orders">My Bookings</Link>
              </DropdownMenuItem>
              {userRole === "TENANT" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                    <Link to="/tenant/dashboard">Tenant Dashboard</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="rounded-xl text-red-600 focus:text-red-600 cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}