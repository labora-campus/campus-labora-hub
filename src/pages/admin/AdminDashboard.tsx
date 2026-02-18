import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
// import { students, cohorts, submissionsForTask1, assignments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, ClipboardCheck, TrendingUp, ChevronRight } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useCohorts } from "@/hooks/useCohorts";
import { useAdminAssignments } from "@/hooks/useAdminAssignments";

export default function AdminDashboard() {
  const { data: students, isLoading: loadingStudents } = useStudents();
  const { data: cohorts, isLoading: loadingCohorts } = useCohorts();
  const { data: assignments, isLoading: loadingAssignments } = useAdminAssignments();

  const activeStudentsCount = students?.length || 0;
  const activeCohortsCount = cohorts?.length || 0; // Assuming all are active for now, or filter by date
  // For unreviewed submissions we would need a specific endpoint or filter on submissions
  // For now we will show 0 or a placeholder until we have a dashboard-specific stats endpoint
  const pendingAssignmentsCount = assignments?.length || 0;

  // Calculate average progress if available (mocking for now as we don't have aggregated progress yet)
  const avgProgress = 0;

  const metrics = [
    { label: "Estudiantes registrados", value: activeStudentsCount.toString(), icon: Users, highlight: false },
    { label: "Cohortes creados", value: activeCohortsCount.toString(), icon: BookOpen, highlight: false },
    { label: "Tareas creadas", value: pendingAssignmentsCount.toString(), icon: ClipboardCheck, highlight: false },
    { label: "Promedio de avance", value: `${avgProgress}%`, icon: TrendingUp, highlight: false },
  ];

  const isLoading = loadingStudents || loadingCohorts || loadingAssignments;

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={8} loading={isLoading}>
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Active cohorts */}
            <div>
              <h2 className="text-lg font-bold mb-3">Cohortes Recientes</h2>
              <div className="space-y-3">
                {cohorts?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border border-dashed rounded-xl">
                    No hay cohortes activos.
                  </div>
                ) : (
                  cohorts?.slice(0, 5).map((c) => (
                    <Link key={c.id} to={`/admin/cohorts/${c.id}/content`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.start_date || "Sin fecha"}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent Students */}
            <div>
              <h2 className="text-lg font-bold mb-3">Estudiantes Recientes</h2>
              <div className="space-y-3">
                {students?.slice(0, 5).map((s) => (
                  <Link key={s.id} to={`/admin/students/${s.id}`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover">
                    <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                      {s.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
                ))}
                {students?.length === 0 && <p className="text-sm text-muted-foreground">No hay estudiantes.</p>}
              </div>
            </div>
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
