import { useState } from "react";
import { Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, Play, CheckCircle2, Lock, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCohort } from "@/hooks/useCohorts";
import { useModules } from "@/hooks/useModules";
// We'll create a hook for assignments later if not exists, but for now we'll assume we made it or will make it.
// Actually I just made useStudentData.ts which has useAssignments and useStudentProgress.
import { useAssignments, useStudentProgress } from "@/hooks/useStudentData";
import { formatDateEs } from "@/data/mockData"; // Keep utility for now

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const cohortId = profile?.cohort_id;

  const { data: cohort, isLoading: loadingCohort } = useCohort(cohortId || "");
  const { data: modules, isLoading: loadingModules } = useModules(cohortId || "");
  const { data: assignments, isLoading: loadingAssignments } = useAssignments(cohortId || "");
  const { data: progressData, isLoading: loadingProgress } = useStudentProgress();

  if (!cohortId && !loadingCohort) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="bg-secondary/50 p-6 rounded-full">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Sin Cohorte Asignado</h2>
          <p className="text-muted-foreground max-w-md">
            Aún no has sido asignado a un cohorte activo. Contacta a un administrador para acceder al contenido.
          </p>
        </div>
      </StudentLayout>
    );
  }

  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const completedLessonIds = new Set(progressData?.filter(p => p.completed).map(p => p.lesson_id));

  // Calculate stats
  const allLessons = modules?.flatMap(m => m.lessons || []) || [];
  const totalLessons = allLessons.length;
  const completedLessonsCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const pendingAssignments = assignments?.filter(a => {
    // Logic for pending. We don't have submissions yet to check if *this* student submitted.
    // For now, assume all published assignments are pending until we have submission status.
    // We can improve this later.
    return true;
  }) || [];

  // Calculate next class
  const upcomingClasses = allLessons
    .filter(l => l.date && new Date(l.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const nextClass = upcomingClasses[0];

  const isLoading = loadingCohort || loadingModules || loadingAssignments || loadingProgress;

  if (isLoading) {
    return (
      <StudentLayout>
        <ContentWithSkeleton lines={8} loading={true}>
          <div />
        </ContentWithSkeleton>
      </StudentLayout>
    );
  }

  if (!profile || !cohort) {
    return (
      <StudentLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold">No estás asignado a un cohorte.</h2>
          <p className="text-muted-foreground">Contacta al administrador.</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">¡Hola, {profile.full_name?.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            {cohort.name} — <span className="text-primary font-semibold">Campus Labora</span>
          </p>
        </div>

        {/* Next Class Banner */}
        {nextClass && (
          <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-primary font-bold text-lg mb-1">📅 Próxima Clase</h3>
              <p className="font-semibold text-lg">{nextClass.title}</p>
              <p className="text-sm text-foreground/80 flex items-center gap-2 mt-1">
                <Calendar size={14} />
                {new Date(nextClass.date!).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                <span className="mx-1">•</span>
                {new Date(nextClass.date!).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} HS
              </p>
            </div>
            <Link to={`/lessons/${nextClass.id}`} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg btn-scale">
              Ver info
            </Link>
          </div>
        )}

        {/* Progress Card */}
        <div className="bg-card border border-border rounded-xl p-5 card-hover">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Progreso General</h3>
            <span className="text-sm text-muted-foreground">{completedLessonsCount} de {totalLessons} clases</span>
          </div>
          <Progress value={progressPct} className="h-3 bg-secondary [&>div]:gradient-lime" />
          <p className="text-primary font-bold text-lg mt-2">{progressPct}%</p>
        </div>

        {/* Modules */}
        <div>
          <h2 className="text-xl font-bold mb-4">Tu ruta de aprendizaje</h2>
          <div className="space-y-3">
            {modules?.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                <p>No hay módulos publicados en este cohorte aún.</p>
              </div>
            ) : (
              modules?.map((mod) => {
                const modLessons = mod.lessons || [];
                const modCompleted = modLessons.filter((l) => completedLessonIds.has(l.id)).length;
                const isExpanded = expandedModule === mod.id;
                const isLocked = !mod.is_published; // RLS should filter this anyway, but good to keep

                return (
                  <div key={mod.id} className={`bg-card border border-border rounded-xl overflow-hidden card-hover ${isLocked ? "opacity-50" : ""}`}>
                    <button
                      onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.id)}
                      className="w-full flex items-center gap-3 p-4 text-left"
                      disabled={isLocked}
                    >
                      <Badge variant="primary" className="text-xs font-bold min-w-fit">S{mod.order_index}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{mod.title}</p>
                        <p className="text-xs text-muted-foreground">{modLessons.length} clases · {modCompleted} completadas</p>
                      </div>
                      {isLocked ? (
                        <Lock size={16} className="text-muted-foreground" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={modLessons.length > 0 ? (modCompleted / modLessons.length) * 100 : 0} className="h-1.5 bg-secondary [&>div]:bg-primary" />
                          </div>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      )}
                    </button>

                    {isExpanded && !isLocked && (
                      <div className="border-t border-border">
                        {modLessons.length === 0 ? (
                          <div className="p-4 text-center text-xs text-muted-foreground">No hay clases en este módulo.</div>
                        ) : (
                          modLessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              to={`/lessons/${lesson.id}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0"
                            >
                              {completedLessonIds.has(lesson.id) ? (
                                <CheckCircle2 size={18} className="text-success shrink-0" />
                              ) : (
                                <Play size={18} className="text-muted-foreground shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{lesson.title}</p>
                                {lesson.date && <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Calendar size={10} />
                                  {new Date(lesson.date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                                }
                              </div>
                              <Badge variant="default" className="text-[10px]">
                                <Clock size={10} className="mr-1" />
                                {lesson.duration_minutes || 0} min
                              </Badge>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Assignments */}
        <div>
          <h2 className="text-xl font-bold mb-4">Tareas Pendientes</h2>
          {pendingAssignments.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-lg">¡Todo al día! 🎉</p>
              <p className="text-muted-foreground text-sm mt-1">No tienes tareas pendientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.map((a) => (
                <Link key={a.id} to={`/assignments/${a.id}`} className="block bg-card border border-border rounded-xl p-4 card-hover">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{a.title}</p>
                      {/* We don't have module name easily here unless we join, skipping for now */}
                    </div>
                    <Badge variant="default">Pendiente</Badge>
                  </div>
                  {a.due_date && (
                    <div className={`flex items-center gap-1.5 mt-3 text-xs text-muted-foreground`}>
                      <Calendar size={12} />
                      <span>{formatDateEs(a.due_date)}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
