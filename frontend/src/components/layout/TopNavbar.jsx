import { Bell, Menu, UserCircle } from "lucide-react";

import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const TopNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  const location = useLocation();

  const userRole = user?.role?.toLowerCase();

  const getRoleConfig = () => {
    if (userRole === "donor") {
      return {
        badge: "bg-green-100 text-green-700",
        avatar: "bg-green-100 text-green-700",
      };
    }

    if (userRole === "ngo") {
      return {
        badge: "bg-blue-100 text-blue-700",
        avatar: "bg-blue-100 text-blue-700",
      };
    }

    if (userRole === "admin") {
      return {
        badge: "bg-purple-100 text-purple-700",
        avatar: "bg-purple-100 text-purple-700",
      };
    }

    return {
      badge: "bg-slate-100 text-slate-700",
      avatar: "bg-slate-100 text-slate-700",
    };
  };

  const roleConfig = getRoleConfig();

  const getPageTitle = () => {
    const titles = {
      "/": "Dashboard",
      "/donor/register": "Donor Registration",
      "/donation/create": "Create Donation",
      "/donations": "Donations",
      "/ngo/register": "NGO Registration",
      "/ngos": "NGOs",
      "/claims": "Claims",
      "/da-output": "DA Output",
    };

    return titles[location.pathname] || "HelpingHands Kitchen";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="text-xs font-medium text-slate-400">
              HelpingHands Kitchen
            </p>

            <h2 className="text-lg font-bold text-slate-900">
              {getPageTitle()}
            </h2>
          </div>
        </div>

        {/* ==================================================
            RIGHT
        ================================================== */}

        <div className="flex items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[160px] truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleConfig.badge}`}
              >
                {userRole || "user"}
              </span>
            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${roleConfig.avatar}`}
            >
              {user?.name ? (
                <span className="font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircle size={22} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
