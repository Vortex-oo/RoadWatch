import { NavLink, Navigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  ClipboardCheck,
  Users,
  ChartNoAxesCombined,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { getCurrentUser } from "./auth";
import type { UserRole } from "./types";

interface RequireRoleProps {
  allowedRoles: UserRole[];
}

export function RequireRole({ allowedRoles }: RequireRoleProps) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true, roles: ["admin", "verifier"] },
  { to: "/admin/reports", label: "All reports", icon: Map, roles: ["admin", "verifier"] },
  { to: "/admin/verify", label: "Verification queue", icon: ClipboardCheck, roles: ["admin", "verifier"] },
  { to: "/admin/users", label: "Users", icon: Users, roles: ["admin"] },
  { to: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined, roles: ["admin"] },
] as const;

export function AdminLayout() {
  const user = getCurrentUser();
  const links = navItems.filter((item) =>
    user ? (item.roles as readonly string[]).includes(user.role) : false
  );

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="flex w-full flex-col bg-slate-950 p-3 text-slate-200 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:p-5">
        <div className="flex items-center gap-3 px-2 py-2 md:pb-8">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={22} />
          </span>
          <span>
            <strong className="block font-bold tracking-tight text-white">PotholeWatch</strong>
            <small className="text-xs text-slate-400">Operations console</small>
          </span>
        </div>

        <p className="hidden px-3 pb-2 text-[10px] font-bold tracking-[.18em] text-slate-500 md:block">
          WORKSPACE
        </p>
        <nav className="flex gap-1 overflow-x-auto md:grid">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-800 text-white ring-1 ring-inset ring-slate-700"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-slate-800 pt-4 md:block">
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="grid size-9 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm text-white">{user?.name || "Team member"}</strong>
              <small className="text-xs capitalize text-slate-400">{user?.role}</small>
            </span>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-9">
          <div>
            <p className="text-[10px] font-bold tracking-[.16em] text-slate-400">
              POTHOLEWATCH / {user?.role?.toUpperCase()}
            </p>
            <h1 className="mt-1 font-semibold tracking-tight text-slate-900">Road safety operations</h1>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700">
            {user?.role}
          </span>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
