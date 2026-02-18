import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, BookOpen, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useStudent, useUpdateStudentCohort } from "@/hooks/useStudents";
import { useCohorts } from "@/hooks/useCohorts";
import { formatDateEs } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function StudentDetail() {
  const { id } = useParams();
  const studentId = id || "";

  const { data: student, isLoading: loadingStudent } = useStudent(studentId);
  const { data: cohorts, isLoading: loadingCohorts } = useCohorts();
  const updateCohortMutation = useUpdateStudentCohort();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState("");

  const handleUpdateCohort = () => {
    if (!selectedCohortId) return;

    updateCohortMutation.mutate({
      studentId: studentId,
      cohortId: selectedCohortId
    }, {
      onSuccess: () => {
        setModalOpen(false);
      }
    });
  };

  if (loadingStudent || loadingCohorts) {
    return (
      <AdminLayout>
        <ContentWithSkeleton loading={true} lines={6}><div /></ContentWithSkeleton>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">Estudiante no encontrado.</div>
      </AdminLayout>
    );
  }

  const stats = [
    { label: "Lecciones completadas", value: student.completed_lessons, icon: CheckCircle, color: "text-green-500" },
    { label: "Tareas entregadas", value: student.submitted_assignments, icon: BookOpen, color: "text-blue-500" },
    // { label: "Promedio asistencia", value: "92%", icon: Clock, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/students" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold">Detalle del Estudiante</h1>
        </div>

        {/* Header Profile */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {student.initials || "ST"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.full_name}</h2>
              <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Mail size={14} /> {student.email}</span>
                <span className="flex items-center gap-2"><Calendar size={14} /> Registrado el {student.created_at ? formatDateEs(student.created_at) : "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-start md:items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Cohorte actual:</span>
              <Badge variant="outline" className="text-base py-1 px-3">
                {student.cohort_name || "Sin Asignar"}
              </Badge>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button
                  className="text-sm text-primary hover:underline font-medium"
                  onClick={() => setSelectedCohortId(student.cohort_id || "")}
                >
                  Cambiar de cohorte
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Mover estudiante de cohorte</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Selecciona el nuevo cohorte</Label>
                    <select
                      className="w-full bg-secondary border border-border rounded-lg p-2.5 text-sm text-foreground"
                      value={selectedCohortId}
                      onChange={(e) => setSelectedCohortId(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {cohorts?.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleUpdateCohort}
                    disabled={updateCohortMutation.isPending}
                    className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {updateCohortMutation.isPending && <Loader2 className="animate-spin" size={16} />}
                    Confirmar Cambio
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
