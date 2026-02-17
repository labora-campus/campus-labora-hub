import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { assignments, formatDateEs, getDeadlineColor, getDeadlineText } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, Upload, Link2, FileText, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AssignmentDetail() {
  const { id } = useParams();
  const assignment = assignments.find((a) => a.id === Number(id));
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  if (!assignment) {
    return <StudentLayout><p className="text-muted-foreground">Tarea no encontrada.</p></StudentLayout>;
  }

  const isReviewed = assignment.status === "reviewed";
  const isPending = assignment.status === "pending" && !submitted;

  const handleSubmit = () => {
    setSubmitted(true);
    toast({ title: "¡Tarea entregada! 🎉", description: "Tu entrega ha sido registrada correctamente." });
  };

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={5}>
        <div className="max-w-3xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/assignments" className="hover:text-foreground transition-colors">Tareas</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">{assignment.title}</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold">{assignment.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge variant="default">{assignment.moduleName}</Badge>
              <div className={`flex items-center gap-1.5 text-xs ${getDeadlineColor(assignment.deadline)}`}>
                <Calendar size={12} />
                <span>{formatDateEs(assignment.deadline)} · {getDeadlineText(assignment.deadline)}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-2">Instrucciones</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Completa esta tarea según lo aprendido en clase. Asegúrate de seguir las mejores prácticas
              y entregar un trabajo de calidad profesional. Puedes entregar un link, archivo o texto.
            </p>
          </div>

          {/* Reviewed submission */}
          {isReviewed && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold mb-2">Tu entrega</h3>
                <p className="text-sm text-primary">Link: {assignment.submissionContent}</p>
                <p className="text-xs text-muted-foreground mt-2">Entregada el {formatDateEs(assignment.submittedDate!)}</p>
              </div>

              <div className="bg-card border-l-4 border-l-primary border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  <h3 className="font-semibold">Feedback del profesor</h3>
                  <Badge variant="success">Revisada ✓</Badge>
                </div>
                <p className="text-foreground text-sm">{assignment.feedback}</p>
              </div>
            </div>
          )}

          {/* Submission already done */}
          {submitted && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <CheckCircle2 size={32} className="text-success mx-auto mb-3" />
              <p className="font-semibold">¡Tarea entregada!</p>
              <p className="text-muted-foreground text-sm mt-1">Tu profesor la revisará pronto.</p>
            </div>
          )}

          {/* Submission form */}
          {isPending && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Entregar tarea</h3>
              <Tabs defaultValue="text" className="space-y-4">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <FileText size={14} className="mr-1.5" />Texto
                  </TabsTrigger>
                  <TabsTrigger value="file" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Upload size={14} className="mr-1.5" />Archivo
                  </TabsTrigger>
                  <TabsTrigger value="link" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Link2 size={14} className="mr-1.5" />Link
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <textarea
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full h-32 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </TabsContent>

                <TabsContent value="file">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                    <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Arrastra un archivo o haz click para seleccionar</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, PNG, JPG, ZIP — Máx 10MB</p>
                  </div>
                </TabsContent>

                <TabsContent value="link">
                  <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg p-3">
                    <Link2 size={16} className="text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://tu-proyecto.lovable.app"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg mt-4 btn-scale hover:brightness-110 transition-all">
                Entregar Tarea
              </button>
            </div>
          )}
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
