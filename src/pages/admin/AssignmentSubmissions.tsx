import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { assignments, submissionsForTask1, students } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AssignmentSubmissions() {
  const { id } = useParams();
  const assignment = assignments.find((a) => a.id === Number(id));
  const { toast } = useToast();
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  if (!assignment) {
    return <AdminLayout><p className="text-muted-foreground">Tarea no encontrada.</p></AdminLayout>;
  }

  const submissions = Number(id) === 1 ? submissionsForTask1 : [];
  const allStudentsSubs = students.map((s) => {
    const sub = submissions.find((sub) => sub.studentId === s.id);
    return sub || { studentId: s.id, studentName: s.name, studentInitials: s.initials, submittedDate: "", status: "not_submitted" as const, content: "" };
  });

  const submittedCount = allStudentsSubs.filter((s) => s.status !== "not_submitted").length;
  const reviewedCount = allStudentsSubs.filter((s) => s.status === "reviewed").length;

  const handleSaveReview = (studentId: string) => {
    toast({ title: "Revisión guardada", description: "El feedback ha sido enviado al estudiante." });
    setExpandedStudent(null);
    setFeedbackText("");
  };

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={6}>
        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <Link to="/admin/assignments" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold">{assignment.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {submittedCount} de {students.length} entregadas · {reviewedCount} revisadas
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {allStudentsSubs.map((sub) => {
              const isExpanded = expandedStudent === sub.studentId;
              return (
                <div key={sub.studentId} className={`bg-card border rounded-xl overflow-hidden card-hover ${sub.status === "needs_review" ? "border-warning" : "border-border"}`}>
                  <button
                    onClick={() => setExpandedStudent(isExpanded ? null : sub.studentId)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                      {sub.studentInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{sub.studentName}</p>
                      {sub.submittedDate && <p className="text-xs text-muted-foreground">{sub.submittedDate}</p>}
                    </div>
                    <Badge variant={
                      sub.status === "reviewed" ? "success" :
                      sub.status === "needs_review" ? "warning" : "default"
                    }>
                      {sub.status === "reviewed" ? "Revisada" : sub.status === "needs_review" ? "Pendiente de revisión" : "No entregada"}
                    </Badge>
                    {sub.status !== "not_submitted" && (
                      isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>

                  {isExpanded && sub.status !== "not_submitted" && (
                    <div className="border-t border-border p-4 space-y-4">
                      {sub.content && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Entrega:</p>
                          <a href="#" className="text-sm text-primary flex items-center gap-1 hover:underline">
                            <ExternalLink size={14} />{sub.content}
                          </a>
                        </div>
                      )}

                      {sub.status === "reviewed" && sub.feedback && (
                        <div className="bg-secondary rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Feedback:</p>
                          <p className="text-sm">{sub.feedback}</p>
                        </div>
                      )}

                      {sub.status === "needs_review" && (
                        <div className="space-y-3">
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Tu feedback..."
                            className="w-full h-20 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex gap-2">
                            <select className="bg-secondary border border-border rounded-lg p-2 text-sm text-foreground">
                              <option>Aprobada</option>
                              <option>Necesita revisión</option>
                            </select>
                            <button
                              onClick={() => handleSaveReview(sub.studentId)}
                              className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all"
                            >
                              Guardar revisión
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
