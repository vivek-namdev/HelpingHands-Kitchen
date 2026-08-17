import {
  LayoutDashboard,
  UserPlus,
  PackagePlus,
  PackageOpen,
  Building2,
  UsersRound,
  ClipboardList,
  BarChart2,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["donor", "ngo", "admin"],
  },
  {
    label: "Donor Registration",
    path: "/donor/register",
    icon: UserPlus,
    roles: ["donor", "admin"],
  },
  {
    label: "Create Donation",
    path: "/donation/create",
    icon: PackagePlus,
    roles: ["donor", "admin"],
  },
  {
    label: "View Donations",
    path: "/donations",
    icon: PackageOpen,
    roles: ["donor", "ngo", "admin"],
  },
  {
    label: "NGO Registration",
    path: "/ngo/register",
    icon: Building2,
    roles: ["ngo", "admin"],
  },
  {
    label: "View NGOs",
    path: "/ngos",
    icon: UsersRound,
    roles: ["ngo", "admin"],
  },
  {
    label: "Claims",
    path: "/claims",
    icon: ClipboardList,
    roles: ["ngo", "admin"],
  },
  {
    label: "DA Output",
    path: "/da-output",
    icon: BarChart2,
    roles: ["admin"],
  },
];

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const userRole = user?.role?.toLowerCase();

  const filteredNavigationItems = navigationItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const handleLogout = () => {
    logout();

    onClose();

    navigate("/landing");
  };

  const getRoleConfig = () => {
    if (userRole === "donor") {
      return {
        badge: "bg-green-100 text-green-700",
        avatar: "bg-green-100 text-green-700",
        active: "bg-green-100 text-green-700",
        icon: "text-green-600",
      };
    }

    if (userRole === "ngo") {
      return {
        badge: "bg-blue-100 text-blue-700",
        avatar: "bg-blue-100 text-blue-700",
        active: "bg-blue-100 text-blue-700",
        icon: "text-blue-600",
      };
    }

    if (userRole === "admin") {
      return {
        badge: "bg-purple-100 text-purple-700",
        avatar: "bg-purple-100 text-purple-700",
        active: "bg-purple-100 text-purple-700",
        icon: "text-purple-600",
      };
    }

    return {
      badge: "bg-slate-100 text-slate-700",
      avatar: "bg-slate-100 text-slate-700",
      active: "bg-slate-100 text-slate-700",
      icon: "text-slate-600",
    };
  };

  const roleConfig = getRoleConfig();

  return (
    <>
      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200/70 bg-white/95 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ==================================================
            LOGO / HEADER
        ================================================== */}

        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex min-w-0 items-center gap-3 px-2 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <PackageOpen size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-900">
                HelpingHands Kitchen
              </h1>

              <p className="truncate text-xs text-slate-500">
                Food Redistribution
              </p>
            </div>
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  onClose();
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? roleConfig.active
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      className={
                        isActive
                          ? roleConfig.icon
                          : "text-slate-400 transition group-hover:text-slate-600"
                      }
                    />

                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ==================================================
            USER INFO
        ================================================== */}

        <div className="mb-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-semibold ${roleConfig.avatar}`}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleConfig.badge}`}
              >
                {userRole || "user"}
              </span>

              {user?.profileId && (
                <p className="mt-1 truncate text-[11px] text-slate-400">
                  {user.profileId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div className="rounded-2xl bg-green-50 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
