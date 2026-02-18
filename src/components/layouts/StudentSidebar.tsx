import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, PlayCircle, ClipboardCheck, User, LogOut, ArrowLeftRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";

import { useModules } from "@/hooks/useModules";

export function StudentSidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const { data: modules } = useModules(profile?.cohort_id || "");

  // const firstModuleId = modules?.find(m => m.is_published)?.id;
  // const classesLink = firstModuleId ? `/modules/${firstModuleId}` : "/dashboard";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/modules", label: "Mis Clases", icon: PlayCircle },
    { to: "/assignments", label: "Tareas", icon: ClipboardCheck },
    { to: "/profile", label: "Mi Perfil", icon: User },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[250px] min-h-screen border-r border-border bg-background fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-border">
          <BrandLogo className="text-lg" />
          <p className="text-xs mt-1">
            <span className="text-primary font-bold">IA</span>{" "}
            <span className="text-foreground font-bold">NoCode</span>
          </p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to.split("/").slice(0, 2).join("/")) ||
              (item.to === "/dashboard" && location.pathname === "/dashboard");
            // Special case for dynamic "Mis Clases" to highlight if we are in ANY module view
            const isModuleActive = item.label === "Mis Clases" && location.pathname.startsWith("/modules/");

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive || isModuleActive
                  ? "text-primary bg-primary/10 border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground">
              {profile?.initials || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || "Usuario"}</p>
            </div>
            <button onClick={signOut} className="text-muted-foreground hover:text-destructive transition-colors" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to.split("/").slice(0, 2).join("/"));
          const isModuleActive = item.label === "Mis Clases" && location.pathname.startsWith("/modules/");

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors ${isActive || isModuleActive ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
