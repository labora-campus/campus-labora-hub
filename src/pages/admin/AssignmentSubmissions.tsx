import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { useAssignment } from "@/hooks/useAdminAssignments";
import { useSubmissions, useGradeSubmission } from "@/hooks/useSubmissions";
import { formatDateEs } from "@/data/mockData";

export default function AssignmentSubmissions() {
  const { id } = useParams();
  const assignmentId = id || "";

  const { data: assignment, isLoading: loadingAssignment } = useAssignment(assignmentId);
  const { data: submissions, isLoading: loadingSubmissions } = useSubmissions(assignmentId);
  const gradeMutation = useGradeSubmission();

  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [gradeStatus, setGradeStatus] = useState<"reviewed" | "revision_requested">("reviewed");

  if (loadingAssignment || loadingSubmissions) {
    return (
      <AdminLayout>
        <ContentWithSkeleton loading={true} lines={6}><div /></ContentWithSkeleton>
      </AdminLayout>
    );
  }

  if (!assignment) {
    return <AdminLayout><p className="text-muted-foreground p-8">Tarea no encontrada.</p></AdminLayout>;
  }

  // We need to list all students in the cohort (not implemented yet fully joined), 
  // currently `submissions` only returns actual submissions. 
  // Ideally, we should fetch all students in the cohort and specific submissions to show "Not Submitted".
  // For Phase 3 MVP, we will just show the submissions we have.
  // TODO: Join with cohort students to show missing submissions.

  const submittedCount = submissions?.length || 0;
  const reviewedCount = submissions?.filter((s) => s.status === "reviewed").length || 0;

  const handleSaveReview = (submissionId: string) => {
    gradeMutation.mutate({
      id: submissionId,
      updates: {
        status: gradeStatus,
        feedback: feedbackText,
        // grade: "100" // Not using numeric grades yet in UI
      }
    }, {
      onSuccess: () => {
        setExpandedStudent(null);
        setFeedbackText("");
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/assignments" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold">{assignment.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {submittedCount} entregas · {reviewedCount} revisadas
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {submissions?.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center bg-card border border-border rounded-xl">
              No hay entregas para esta tarea aún.
            </div>
          ) : (
            submissions?.map((sub) => {
              const isExpanded = expandedStudent === sub.id;
              const studentName = sub.profiles?.full_name || "Estudiante desconocido";
              const studentInitials = sub.profiles?.initials || "?";

              return (
                <div key={sub.id} className={`bg-card border rounded-xl overflow-hidden card-hover ${sub.status === "submitted" ? "border-warning" : "border-border"}`}>
                  <button
                    onClick={() => setExpandedStudent(isExpanded ? null : sub.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                      {studentInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{studentName}</p>
                      {sub.submitted_at && <p className="text-xs text-muted-foreground">{formatDateEs(sub.submitted_at)}</p>}
                    </div>
                    <Badge variant={
                      sub.status === "reviewed" ? "success" :
                        sub.status === "revision_requested" ? "destructive" : "warning"
                    }>
                      {sub.status === "reviewed" ? "Revisada" : sub.status === "revision_requested" ? "Revisión Solicitada" : "Pendiente de revisión"}
                    </Badge>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border p-4 space-y-4">
                      {(sub.content_text || sub.link_url || sub.file_url) && (
                        <div className="bg-secondary/20 p-3 rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Entrega del estudiante</p>
                          {sub.content_text && <p className="text-sm mb-2">{sub.content_text}</p>}
                          {sub.link_url && (
                            <a href={sub.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline break-all">
                              <ExternalLink size={14} />{sub.link_url}
                            </a>
                          )}
                        </div>
                      )}

                      {sub.status === "reviewed" && sub.admin_feedback && (
                        <div className="bg-secondary p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1 font-semibold">Feedback enviado:</p>
                          <p className="text-sm">{sub.admin_feedback}</p>
                        </div>
                      )}

                      {/* Grading form */}
                      <div className="space-y-3 pt-2 border-t border-border/50">
                        <Label className="text-sm font-semibold">Tu Feedback</Label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Escribe comentarios para el estudiante..."
                          className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="flex gap-2 items-center justify-end">
                          <select
                            className="bg-secondary border border-border rounded-lg p-2 text-sm text-foreground"
                            value={gradeStatus}
                            onChange={(e) => setGradeStatus(e.target.value as any)}
                          >
                            <option value="reviewed">Aprobada</option>
                            <option value="revision_requested">Solicitar cambios</option>
                          </select>
                          <button
                            onClick={() => handleSaveReview(sub.id)}
                            disabled={gradeMutation.isPending}
                            className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all flex items-center gap-2"
                          >
                            {gradeMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                            Enviar Revisión
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
