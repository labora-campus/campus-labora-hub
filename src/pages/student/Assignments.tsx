import { useState } from "react";
import { Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAssignments, useStudentSubmissions } from "@/hooks/useStudentData";
import { formatDateEs } from "@/data/mockData"; // Helper function, okay to keep or movie

type Filter = "all" | "pending" | "submitted" | "reviewed";

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  submitted: "Entregada",
  reviewed: "Revisada",
  returned: "Devuelta",
};

const statusVariant: Record<string, "default" | "info" | "success" | "warning" | "destructive"> = {
  pending: "default",
  submitted: "info",
  reviewed: "success",
  returned: "destructive",
};

export default function Assignments() {
  const { profile } = useAuth();
  const cohortId = profile?.cohort_id;
  const [filter, setFilter] = useState<Filter>("all");

  const { data: assignments, isLoading: loadingAssignments } = useAssignments(cohortId || "");
  const { data: submissions, isLoading: loadingSubmissions } = useStudentSubmissions();

  const loading = loadingAssignments || loadingSubmissions;

  // Merge assignments with submissions to get status
  const myAssignments = assignments?.map(a => {
    const submission = submissions?.find(s => s.assignment_id === a.id);
    let status = "pending";
    if (submission) {
      status = submission.status; // submitted, reviewed, returned
    }
    return { ...a, status, submission };
  }) || [];

  const filtered = myAssignments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending";
    if (filter === "submitted") return a.status === "submitted";
    if (filter === "reviewed") return a.status === "reviewed";
    return true;
  });

  const filters: { label: string; value: Filter }[] = [
    { label: "Todas", value: "all" },
    { label: "Pendientes", value: "pending" },
    { label: "Entregadas", value: "submitted" },
    { label: "Revisadas", value: "reviewed" },
  ];

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={5} loading={loading}>
        <div className="max-w-4xl space-y-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">Mis Tareas</h1>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Assignments list */}
          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No hay tareas en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => (
                <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 card-hover">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Módulo opcional {/* We don't have module name here easily */}</p>
                    {a.due_date && (
                      <div className={`flex items-center gap-1.5 mt-2 text-xs text-muted-foreground`}>
                        <Calendar size={12} />
                        <span>{formatDateEs(a.due_date)}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={statusVariant[a.status] || "default"}>{statusLabel[a.status] || "Pendiente"}</Badge>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
