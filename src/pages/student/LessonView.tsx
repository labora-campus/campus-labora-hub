import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { modules, getLessonById, getModuleForLesson } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, ChevronRight, ChevronLeft, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LessonView() {
  const { id } = useParams();
  const lessonId = Number(id);
  const lesson = getLessonById(lessonId);
  const mod = getModuleForLesson(lessonId);
  const { toast } = useToast();
  const [completed, setCompleted] = useState(lesson?.completed || false);

  if (!lesson || !mod) {
    return <StudentLayout><p className="text-muted-foreground">Clase no encontrada.</p></StudentLayout>;
  }

  const allLessons = modules.filter((m) => m.published).flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = () => {
    setCompleted(true);
    toast({
      title: "¡Clase completada! ✓",
      description: `Has completado "${lesson.title}"`,
    });
  };

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={6}>
        <div className="max-w-4xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <Link to={`/modules/${mod.id}`} className="hover:text-foreground transition-colors">{mod.title}</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">{lesson.title}</span>
          </div>

          {/* Video placeholder */}
          <div className="aspect-video bg-secondary rounded-xl border border-border flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Play size={28} className="text-primary ml-1" />
              </div>
              <p className="text-muted-foreground text-sm">Video de la clase</p>
            </div>
          </div>

          {/* Lesson info */}
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold">{lesson.title}</h1>
            <p className="text-muted-foreground">Contenido de la clase sobre {lesson.title.toLowerCase()}. Aprende paso a paso con ejemplos prácticos.</p>
            <Badge variant="default">
              <Clock size={12} className="mr-1" />{lesson.duration} min
            </Badge>
          </div>

          {/* Complete button */}
          {completed ? (
            <button disabled className="flex items-center gap-2 border border-success text-success font-semibold py-2.5 px-6 rounded-lg opacity-80 cursor-default">
              <CheckCircle2 size={18} />
              Completada ✓
            </button>
          ) : (
            <button onClick={handleComplete} className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-lg btn-scale hover:brightness-110 transition-all">
              Marcar como completada
            </button>
          )}

          {/* Materials */}
          {mod.materials.length > 0 && mod.lessons[0].id === lessonId && (
            <div>
              <h2 className="text-lg font-bold mb-3">Materiales de la clase</h2>
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

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {prevLesson ? (
              <Link to={`/lessons/${prevLesson.id}`} className="flex items-center gap-2 border border-primary text-primary font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary/10 transition-colors">
                <ChevronLeft size={16} />
                Clase anterior
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link to={`/lessons/${nextLesson.id}`} className="flex items-center gap-2 border border-primary text-primary font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary/10 transition-colors">
                Siguiente clase
                <ChevronRight size={16} />
              </Link>
            ) : <div />}
          </div>
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
