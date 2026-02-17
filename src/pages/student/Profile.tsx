import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { studentUser } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, ClipboardCheck, CheckCircle2, LogOut } from "lucide-react";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    { label: "Clases completadas", value: "5", icon: BookOpen },
    { label: "Tarea entregada", value: "1", icon: ClipboardCheck },
    { label: "Tarea revisada", value: "1", icon: CheckCircle2 },
  ];

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={5}>
        <div className="max-w-2xl space-y-6">
          <h1 className="text-2xl font-extrabold">Mi Perfil</h1>

          {/* Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-2xl font-extrabold text-foreground">
              {studentUser.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{studentUser.name}</h2>
              <p className="text-muted-foreground text-sm">{studentUser.email}</p>
              <p className="text-sm mt-1">
                Cohorte 15 — <span className="text-primary font-semibold">IA</span> y <span className="font-semibold">No Code</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center card-hover">
                <stat.icon size={24} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-destructive text-destructive font-medium py-2 px-4 rounded-lg text-sm hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
