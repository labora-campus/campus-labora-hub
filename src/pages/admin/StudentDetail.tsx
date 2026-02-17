import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { students, modules, assignments, formatDateEs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentDetail() {
  const { id } = useParams();
  const student = students.find((s) => s.id === id);
  const { toast } = useToast();

  if (!student) {
    return <AdminLayout><p className="text-muted-foreground">Estudiante no encontrado.</p></AdminLayout>;
  }

  const completedLessons = modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.completed)
    .slice(0, student.completedLessons);

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={6}>
        <div className="max-w-4xl space-y-6">
          <Link to="/admin/students" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft size={16} />Volver a estudiantes
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-xl font-extrabold text-foreground">
              {student.initials}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{student.name}</h1>
              <p className="text-muted-foreground text-sm">{student.email}</p>
              <p className="text-sm mt-0.5">Cohorte 15 — <span className="text-primary font-semibold">IA</span> y <span className="font-semibold">No Code</span></p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso general</span>
              <span className="text-primary font-bold">{student.progress}%</span>
            </div>
            <Progress value={student.progress} className="h-3 bg-secondary [&>div]:gradient-lime" />
            <p className="text-xs text-muted-foreground mt-2">{student.completedLessons} de {student.totalLessons} clases completadas</p>
          </div>

          {/* Completed lessons */}
          <div>
            <h2 className="text-lg font-bold mb-3">Clases completadas</h2>
            {completedLessons.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ha completado clases aún.</p>
            ) : (
              <div className="space-y-2">
                {completedLessons.map((l) => (
                  <div key={l.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                    <CheckCircle2 size={16} className="text-success shrink-0" />
                    <span className="text-sm flex-1">{l.title}</span>
                    <Badge variant="default" className="text-[10px]"><Clock size={10} className="mr-1" />{l.duration} min</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div>
            <h2 className="text-lg font-bold mb-3">Tareas</h2>
            <div className="space-y-2">
              {assignments.map((a) => {
                const isSubmitted = a.status === "reviewed" || a.status === "submitted";
                return (
                  <div key={a.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                    <span className="text-sm flex-1">{a.title}</span>
                    <Badge variant={a.status === "reviewed" ? "success" : a.status === "pending" ? "default" : "info"}>
                      {a.status === "reviewed" ? "Revisada" : a.status === "pending" ? "Pendiente" : "Entregada"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reassign */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Reasignar cohorte</h3>
            <div className="flex gap-2">
              <select className="flex-1 bg-secondary border border-border rounded-lg p-2 text-sm text-foreground">
                <option>Cohorte 15 — IA y No Code</option>
                <option>Cohorte 14 — IA y Contenido</option>
              </select>
              <button
                onClick={() => toast({ title: "Cohorte reasignado" })}
                className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
