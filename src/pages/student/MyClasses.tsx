import { Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Play, CheckCircle2, Lock, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useModules } from "@/hooks/useModules";
import { useStudentProgress } from "@/hooks/useStudentData";

export default function MyClasses() {
    const { profile } = useAuth();
    const cohortId = profile?.cohort_id;

    const { data: modules, isLoading: loadingModules } = useModules(cohortId || "");
    const { data: progressData, isLoading: loadingProgress } = useStudentProgress();

    const completedLessonIds = new Set(progressData?.filter(p => p.completed).map(p => p.lesson_id));

    if (loadingModules || loadingProgress) {
        return (
            <StudentLayout>
                <ContentWithSkeleton lines={6} loading={true}>
                    <div />
                </ContentWithSkeleton>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="max-w-4xl space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold">Mis Clases</h1>
                    <p className="text-muted-foreground">Todo el contenido de tu ruta de aprendizaje.</p>
                </div>

                <div className="space-y-4">
                    {modules?.length === 0 ? (
                        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                            <p>No hay módulos publicados en este cohorte aún.</p>
                        </div>
                    ) : (
                        modules?.map((mod) => {
                            const modLessons = mod.lessons || [];
                            const modCompleted = modLessons.filter((l) => completedLessonIds.has(l.id)).length;
                            const isLocked = !mod.is_published;
                            const progressVal = modLessons.length > 0 ? (modCompleted / modLessons.length) * 100 : 0;

                            return (
                                <div key={mod.id} className={`bg-card border border-border rounded-xl p-5 ${isLocked ? "opacity-60" : "card-hover"}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <Badge variant="primary" className="mb-2">Módulo {mod.order_index}</Badge>
                                            <h2 className="text-xl font-bold">{mod.title}</h2>
                                            <p className="text-sm text-muted-foreground mt-1">{mod.description || "Sin descripción"}</p>
                                        </div>
                                        {isLocked && <Lock className="text-muted-foreground" />}
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span>Progreso</span>
                                            <span className="font-bold">{Math.round(progressVal)}%</span>
                                        </div>
                                        <Progress value={progressVal} className="h-2 bg-secondary [&>div]:bg-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        {modLessons.map(lesson => (
                                            <Link
                                                key={lesson.id}
                                                to={`/lessons/${lesson.id}`}
                                                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors ${isLocked ? "pointer-events-none" : ""}`}
                                            >
                                                {completedLessonIds.has(lesson.id) ? (
                                                    <CheckCircle2 size={16} className="text-success shrink-0" />
                                                ) : (
                                                    <Play size={16} className="text-muted-foreground shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-medium block truncate">{lesson.title}</span>
                                                    {lesson.date && (
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Calendar size={10} />
                                                            {new Date(lesson.date).toLocaleString("es-AR", { dateStyle: 'short', timeStyle: 'short' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Clock size={12} className="mr-1" />
                                                    {lesson.duration_minutes || 0} min
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {!isLocked && (
                                        <div className="mt-4 pt-4 border-t border-border flex justify-end">
                                            <Link
                                                to={`/modules/${mod.id}`}
                                                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                                            >
                                                Ver Módulo Completo <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
