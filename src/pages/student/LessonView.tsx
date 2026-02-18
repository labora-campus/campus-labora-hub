import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, ChevronRight, ChevronLeft, FileText, ExternalLink, Loader2, Link as LinkIcon, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useModules } from "@/hooks/useModules";
import { useStudentProgress, useToggleLesson } from "@/hooks/useStudentData";
import { useQuery } from "@tanstack/react-query";
import { MaterialsService } from "@/services/modules.service";

const getEmbedUrl = (url: string) => {
  if (!url) return "";

  // Google Drive
  if (url.includes("drive.google.com")) {
    // Transform /view or /share to /preview
    return url.replace(/\/view.*/, "/preview").replace(/\/share.*/, "/preview");
  }

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("youtu.be")) {
      videoId = url.split("/").pop() || "";
    } else {
      videoId = new URLSearchParams(new URL(url).search).get("v") || "";
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

export default function LessonView() {
  const { id } = useParams();
  const lessonId = id; // Assuming UUIDs now
  const { profile } = useAuth();
  const cohortId = profile?.cohort_id;

  const { data: modules, isLoading: loadingModules } = useModules(cohortId || "");
  const { data: progressData, isLoading: loadingProgress } = useStudentProgress();
  const toggleLessonMutation = useToggleLesson();

  const { data: materials } = useQuery({
    queryKey: ["materials", lessonId],
    queryFn: () => MaterialsService.getByLessonId(lessonId!),
    enabled: !!lessonId
  });

  const allLessons = modules?.flatMap(m => m.lessons || []) || [];
  const lesson = allLessons.find(l => l.id === lessonId);
  const mod = modules?.find(m => m.lessons?.some(l => l.id === lessonId));

  const isCompleted = progressData?.some(p => p.lesson_id === lessonId && p.completed);

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loadingModules || loadingProgress) {
    return (
      <StudentLayout>
        <ContentWithSkeleton lines={6} loading={true}>
          <div />
        </ContentWithSkeleton>
      </StudentLayout>
    );
  }

  if (!lesson || !mod) {
    return <StudentLayout><p className="text-muted-foreground p-8">Clase no encontrada.</p></StudentLayout>;
  }

  const handleComplete = () => {
    if (!lessonId) return;
    toggleLessonMutation.mutate({ lessonId, completed: true });
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight size={14} />
          <Link to={`/modules/${mod.id}`} className="hover:text-foreground transition-colors">{mod.title}</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{lesson.title}</span>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl border border-border flex items-center justify-center relative overflow-hidden group">
          {lesson.video_url ? (
            <div className="w-full h-full">
              <iframe
                src={getEmbedUrl(lesson.video_url)}
                className="w-full h-full"
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Play size={28} className="text-primary ml-1" />
              </div>
              <p className="text-muted-foreground text-sm">Sin video asignado</p>
            </div>
          )}
        </div>

        {/* Lesson info */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold">{lesson.title}</h1>
          <p className="text-muted-foreground">{lesson.description || `Contenido de la clase sobre ${lesson.title.toLowerCase()}.`}</p>
          <Badge variant="default">
            <Clock size={12} className="mr-1" />{lesson.duration_minutes || 0} min
          </Badge>
        </div>

        {/* Complete button */}
        {isCompleted ? (
          <button disabled className="flex items-center gap-2 border border-success text-success font-semibold py-2.5 px-6 rounded-lg opacity-80 cursor-default">
            <CheckCircle2 size={18} />
            Completada ✓
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={toggleLessonMutation.isPending}
            className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-lg btn-scale hover:brightness-110 transition-all flex items-center gap-2"
          >
            {toggleLessonMutation.isPending && <Loader2 className="animate-spin" size={16} />}
            Marcar como completada
          </button>
        )}

        {/* Materials - TODO: Implement Materials Service if needed, or join materials in modules query */}
        {/* Materials */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="font-bold text-lg">Materiales de la clase</h3>
          {materials && materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {materials.map((material) => (
                <a
                  key={material.id}
                  href={material.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <div className="bg-primary/10 p-2 rounded-lg text-primary mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {material.type === 'pdf' ? <FileText size={20} /> : <LinkIcon size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{material.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{material.type === 'pdf' ? 'Documento PDF' : 'Enlace externo'}</p>
                  </div>
                  <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay materiales adicionales para esta clase.</p>
          )}
        </div>

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
    </StudentLayout>
  );
}
