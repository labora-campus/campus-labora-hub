import { useState } from "react";
import { Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { modules, assignments, studentUser, daysUntil, getDeadlineColor, getDeadlineText, formatDateEs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, Play, CheckCircle2, Lock, Calendar, Clock } from "lucide-react";

export default function StudentDashboard() {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const completedLessons = modules.flatMap((m) => m.lessons).filter((l) => l.completed).length;
  const totalLessons = modules.flatMap((m) => m.lessons).length;
  const progressPct = Math.round((completedLessons / totalLessons) * 100);
  const pendingAssignments = assignments.filter((a) => a.status === "pending");

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={8}>
        <div className="max-w-4xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">¡Hola, {studentUser.name.split(" ")[0]}! 👋</h1>
            <p className="text-muted-foreground mt-1">Cohorte 15 — <span className="text-primary font-semibold">IA</span> y <span className="font-semibold">No Code</span></p>
          </div>

          {/* Progress Card */}
          <div className="bg-card border border-border rounded-xl p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Progreso General</h3>
              <span className="text-sm text-muted-foreground">{completedLessons} de {totalLessons} clases</span>
            </div>
            <Progress value={progressPct} className="h-3 bg-secondary [&>div]:gradient-lime" />
            <p className="text-primary font-bold text-lg mt-2">{progressPct}%</p>
          </div>

          {/* Modules */}
          <div>
            <h2 className="text-xl font-bold mb-4">Tu ruta de aprendizaje</h2>
            <div className="space-y-3">
              {modules.map((mod) => {
                const modCompleted = mod.lessons.filter((l) => l.completed).length;
                const isExpanded = expandedModule === mod.id;
                const isLocked = !mod.published;

                return (
                  <div key={mod.id} className={`bg-card border border-border rounded-xl overflow-hidden card-hover ${isLocked ? "opacity-50" : ""}`}>
                    <button
                      onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.id)}
                      className="w-full flex items-center gap-3 p-4 text-left"
                      disabled={isLocked}
                    >
                      <Badge variant="primary" className="text-xs font-bold min-w-fit">S{mod.id}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{mod.title}</p>
                        <p className="text-xs text-muted-foreground">{mod.lessons.length} clases · {modCompleted} completadas</p>
                      </div>
                      {isLocked ? (
                        <Lock size={16} className="text-muted-foreground" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={(modCompleted / mod.lessons.length) * 100} className="h-1.5 bg-secondary [&>div]:bg-primary" />
                          </div>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      )}
                    </button>

                    {isExpanded && !isLocked && (
                      <div className="border-t border-border">
                        {mod.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            to={`/lessons/${lesson.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0"
                          >
                            {lesson.completed ? (
                              <CheckCircle2 size={18} className="text-success shrink-0" />
                            ) : (
                              <Play size={18} className="text-muted-foreground shrink-0" />
                            )}
                            <span className="flex-1 text-sm">{lesson.title}</span>
                            <Badge variant="default" className="text-[10px]">
                              <Clock size={10} className="mr-1" />
                              {lesson.duration} min
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
                        <p className="text-xs text-muted-foreground mt-1">{a.moduleName}</p>
                      </div>
                      <Badge variant="default">Pendiente</Badge>
                    </div>
                    <div className={`flex items-center gap-1.5 mt-3 text-xs ${getDeadlineColor(a.deadline)}`}>
                      <Calendar size={12} />
                      <span>{formatDateEs(a.deadline)} · {getDeadlineText(a.deadline)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
