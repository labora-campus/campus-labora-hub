import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Play, ChevronRight, Clock, FileText, ExternalLink, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useModules } from "@/hooks/useModules";
import { useAssignments, useStudentProgress } from "@/hooks/useStudentData";

export default function ModuleView() {
  const { id } = useParams();
  const { profile } = useAuth();
  const cohortId = profile?.cohort_id;

  const { data: modules, isLoading: loadingModules } = useModules(cohortId || "");
  const { data: assignments, isLoading: loadingAssignments } = useAssignments(cohortId || "");
  const { data: progressData, isLoading: loadingProgress } = useStudentProgress();

  const mod = modules?.find((m) => m.id === id); // id is UUID now

  if (loadingModules || loadingProgress || loadingAssignments) {
    return (
      <StudentLayout>
        <ContentWithSkeleton lines={6} loading={true}>
          <div />
        </ContentWithSkeleton>
      </StudentLayout>
    );
  }

  if (!mod) {
    return <StudentLayout><p className="text-muted-foreground p-8">Módulo no encontrado.</p></StudentLayout>;
  }

  const modLessons = mod.lessons || [];
  const completedLessonIds = new Set(progressData?.filter(p => p.completed).map(p => p.lesson_id));
  const completedCount = modLessons.filter((l) => completedLessonIds.has(l.id)).length;
  const progress = modLessons.length > 0 ? Math.round((completedCount / modLessons.length) * 100) : 0;

  // Filter assignments for this module. 
  // We need to join this conceptually. For now, we can check if assignment has module_id (it does in DB schema).
  const moduleAssignments = assignments?.filter((a) => a.module_id === mod.id) || [];

  return (
    <StudentLayout>
      <div className="max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{mod.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3">
          <Badge variant="primary" className="text-sm font-bold mt-1">S{mod.order_index}</Badge>
          <div>
            <h1 className="text-2xl font-extrabold">{mod.title}</h1>
            <p className="text-muted-foreground mt-1">{modLessons.length} clases en este módulo</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{completedCount} de {modLessons.length} clases completadas</span>
            <span className="text-primary font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-secondary [&>div]:gradient-lime" />
        </div>

        {/* Lessons */}
        <div className="space-y-2">
          {modLessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover"
            >
              {completedLessonIds.has(lesson.id) ? (
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
                <Clock size={10} className="mr-1" />{lesson.duration_minutes || 0} min
              </Badge>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>

        {/* Materials */}
        {/* Hiding materials for now as we did in LessonView until populated properly */}
        {/* 
          {mod.materials && mod.materials.length > 0 && (
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
          */}

        {/* Module assignments */}
        {moduleAssignments.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3">Tareas del módulo</h2>
            {moduleAssignments.map((a) => (
              <Link key={a.id} to={`/assignments/${a.id}`} className="block bg-card border border-border rounded-xl p-4 card-hover">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{a.title}</p>
                  <Badge variant="default">Pendiente</Badge>
                  {/* Simplified status for now */}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
