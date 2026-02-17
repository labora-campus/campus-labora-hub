import { useState } from "react";
import { Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { assignments, formatDateEs, getDeadlineColor, getDeadlineText } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";

type Filter = "all" | "pending" | "submitted" | "reviewed";

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  submitted: "Entregada",
  reviewed: "Revisada",
  needs_review: "Necesita revisión",
};

const statusVariant: Record<string, "default" | "info" | "success" | "warning"> = {
  pending: "default",
  submitted: "info",
  reviewed: "success",
  needs_review: "warning",
};

export default function Assignments() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = assignments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending";
    if (filter === "submitted") return a.status === "submitted" || a.status === "needs_review";
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
      <ContentWithSkeleton lines={5}>
        <div className="max-w-4xl space-y-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">Mis Tareas</h1>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.value
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
                    <p className="text-xs text-muted-foreground mt-1">{a.moduleName}</p>
                    <div className={`flex items-center gap-1.5 mt-2 text-xs ${getDeadlineColor(a.deadline)}`}>
                      <Calendar size={12} />
                      <span>{formatDateEs(a.deadline)} · {getDeadlineText(a.deadline)}</span>
                    </div>
                  </div>
                  <Badge variant={statusVariant[a.status]}>{statusLabel[a.status]}</Badge>
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
