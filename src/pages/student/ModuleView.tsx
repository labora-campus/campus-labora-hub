import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { modules, assignments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Play, ChevronRight, Clock, FileText, ExternalLink, ArrowLeft } from "lucide-react";

export default function ModuleView() {
  const { id } = useParams();
  const mod = modules.find((m) => m.id === Number(id));

  if (!mod) {
    return <StudentLayout><p className="text-muted-foreground">Módulo no encontrado.</p></StudentLayout>;
  }

  const completed = mod.lessons.filter((l) => l.completed).length;
  const progress = Math.round((completed / mod.lessons.length) * 100);
  const moduleAssignments = assignments.filter((a) => a.moduleId === mod.id);

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={6}>
        <div className="max-w-4xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">{mod.title}</span>
          </div>

          {/* Header */}
          <div className="flex items-start gap-3">
            <Badge variant="primary" className="text-sm font-bold mt-1">S{mod.id}</Badge>
            <div>
              <h1 className="text-2xl font-extrabold">{mod.title}</h1>
              <p className="text-muted-foreground mt-1">{mod.lessons.length} clases en este módulo</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{completed} de {mod.lessons.length} clases completadas</span>
              <span className="text-primary font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-secondary [&>div]:gradient-lime" />
          </div>

          {/* Lessons */}
          <div className="space-y-2">
            {mod.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover"
              >
                {lesson.completed ? (
                  <div className="w-9 h-9 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-success" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Play size={16} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{lesson.title}</p>
                </div>
                <Badge variant="default" className="text-[10px] shrink-0">
                  <Clock size={10} className="mr-1" />{lesson.duration} min
                </Badge>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>

          {/* Materials */}
          {mod.materials.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Materiales</h2>
              <div className="space-y-2">
                {mod.materials.map((mat) => (
                  <div key={mat.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover">
                    {mat.type === "link" ? <ExternalLink size={18} className="text-primary" /> : <FileText size={18} className="text-primary" />}
                    <span className="flex-1 text-sm">{mat.title}</span>
                    <button className="text-xs text-primary font-semibold hover:underline">
                      {mat.type === "link" ? "Abrir" : "Descargar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module assignments */}
          {moduleAssignments.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Tareas del módulo</h2>
              {moduleAssignments.map((a) => (
                <Link key={a.id} to={`/assignments/${a.id}`} className="block bg-card border border-border rounded-xl p-4 card-hover">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{a.title}</p>
                    <Badge variant={a.status === "reviewed" ? "success" : a.status === "pending" ? "default" : "info"}>
                      {a.status === "reviewed" ? "Revisada" : a.status === "pending" ? "Pendiente" : "Entregada"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
