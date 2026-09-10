import { Menu, User as UserIcon } from "lucide-react";
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
    <div className="flex items-center font-sans">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 border border-slate-200 bg-white px-3 py-1.5 rounded-full hover:shadow-md transition-all outline-none">
            <Menu className="w-4 h-4 text-slate-600" />
            <div className="bg-slate-200 text-slate-600 p-1 rounded-full">
              <UserIcon className="w-4 h-4" />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl p-2 shadow-xl border border-slate-200 bg-white text-slate-800 z-50"
        >
          {!isAuthenticated ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  to="/login"
                  className="w-full flex items-center px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-100 hover:text-amber-600 focus:bg-slate-100 focus:text-amber-600 cursor-pointer"
                >
                  Log in
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/register"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-amber-600 focus:bg-slate-100 focus:text-amber-600 cursor-pointer"
                >
                  Sign up
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem asChild>
                <Link
                  to="/tenant/register"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-amber-600 focus:bg-slate-100 focus:text-amber-600 cursor-pointer"
                >
                  Register as Tenant
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="w-full flex items-center px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-100 hover:text-amber-600 focus:bg-slate-100 focus:text-amber-600 cursor-pointer"
                >
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/orders"
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-amber-600 focus:bg-slate-100 focus:text-amber-600 cursor-pointer"
                >
                  My Bookings
                </Link>
              </DropdownMenuItem>
              {userRole === "TENANT" && (
                <>
                  <DropdownMenuSeparator className="bg-slate-100 my-1" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/tenant/dashboard"
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-amber-600 focus:bg-slate-100 focus:text-amber-600 cursor-pointer"
                    >
                      Tenant Dashboard
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem
                onClick={onLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
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