import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, PlayCircle, ClipboardCheck, User, LogOut, ArrowLeftRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/modules/1", label: "Mis Clases", icon: PlayCircle },
  { to: "/assignments", label: "Tareas", icon: ClipboardCheck },
  { to: "/profile", label: "Mi Perfil", icon: User },
];

export function StudentSidebar() {
  const { user, logout, toggleRole } = useAuth();
  const location = useLocation();

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
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
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
          <button
            onClick={toggleRole}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors w-full px-3 py-1.5"
          >
            <ArrowLeftRight size={14} />
            Cambiar a Admin
          </button>
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground">
              {user?.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
            </div>
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to.split("/").slice(0, 2).join("/"));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
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
