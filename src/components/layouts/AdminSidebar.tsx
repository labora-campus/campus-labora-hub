import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, ClipboardCheck, GraduationCap, LogOut, ArrowLeftRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/cohorts", label: "Cohortes", icon: Users },
  { to: "/admin/assignments", label: "Tareas", icon: ClipboardCheck },
  { to: "/admin/students", label: "Estudiantes", icon: GraduationCap },
];

export function AdminSidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <>
      <aside className="hidden md:flex flex-col w-[250px] min-h-screen border-r border-border fixed left-0 top-0 z-40" style={{ backgroundColor: "hsl(0 0% 8%)" }}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-extrabold tracking-tight text-lg">Campus Labora</span>
            <Badge variant="primary" className="text-[10px] px-1.5 py-0">ADMIN</Badge>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
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
            <div className="w-8 h-8 rounded-full gradient-lime flex items-center justify-center text-xs font-bold text-primary-foreground">
              {profile?.initials || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "Administrador"}</p>
            </div>
            <button onClick={signOut} className="text-muted-foreground hover:text-destructive transition-colors" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border z-50 flex justify-around py-2" style={{ backgroundColor: "hsl(0 0% 8%)" }}>
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"
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
