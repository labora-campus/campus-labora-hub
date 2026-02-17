import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { students, cohorts, submissionsForTask1, assignments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, ClipboardCheck, TrendingUp, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const avgProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length);
  const unreviewedCount = submissionsForTask1.filter((s) => s.status === "needs_review").length;

  const metrics = [
    { label: "Estudiantes activos", value: students.length.toString(), icon: Users, highlight: false },
    { label: "Cohorte activo", value: cohorts.filter((c) => c.status === "active").length.toString(), icon: BookOpen, highlight: false },
    { label: "Entrega sin revisar", value: unreviewedCount.toString(), icon: ClipboardCheck, highlight: true },
    { label: "Progreso promedio", value: `${avgProgress}%`, icon: TrendingUp, highlight: false },
  ];

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={8}>
        <div className="max-w-5xl space-y-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">Panel de Administración</h1>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className={`bg-card border rounded-xl p-4 card-hover ${m.highlight ? "border-warning" : "border-border"}`}
              >
                <m.icon size={20} className="text-primary mb-2" />
                <p className="text-2xl font-extrabold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Recent submissions */}
          <div>
            <h2 className="text-lg font-bold mb-3">Entregas recientes</h2>
            <div className="space-y-2">
              {submissionsForTask1.map((sub) => (
                <div
                  key={sub.studentId}
                  className={`flex items-center gap-3 bg-card border rounded-xl p-4 card-hover ${
                    sub.status === "needs_review" ? "border-warning" : "border-border"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                    {sub.studentInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{sub.studentName}</p>
                    <p className="text-xs text-muted-foreground">{assignments[0].title} · {sub.submittedDate}</p>
                  </div>
                  <Badge variant={sub.status === "reviewed" ? "success" : "warning"}>
                    {sub.status === "reviewed" ? "Revisada" : "Pendiente"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Active cohorts */}
          <div>
            <h2 className="text-lg font-bold mb-3">Cohortes activos</h2>
            {cohorts.filter((c) => c.status === "active").map((c) => (
              <Link key={c.id} to={`/admin/cohorts`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.students} estudiantes · {c.startDate} — {c.endDate}</p>
                </div>
                <Badge variant="success">Activo</Badge>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
