import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatDateEs } from "@/data/mockData";
import { useAdminAssignments, useCreateAssignment } from "@/hooks/useAdminAssignments";
import { useCohorts } from "@/hooks/useCohorts";

export default function AdminAssignments() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: assignments, isLoading: loadingAssignments } = useAdminAssignments();
  const { data: cohorts, isLoading: loadingCohorts } = useCohorts();
  const createAssignmentMutation = useCreateAssignment();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = () => {
    if (!title || !cohortId || !dueDate) {
      toast({ title: "Error", description: "Completa los campos obligatorios", variant: "destructive" });
      return;
    }

    createAssignmentMutation.mutate({
      title,
      description,
      cohort_id: cohortId,
      due_date: new Date(dueDate).toISOString(),
      is_published: true // auto-publish for now
    }, {
      onSuccess: () => {
        setModalOpen(false);
        setTitle("");
        setDescription("");
        setCohortId("");
        setDueDate("");
      }
    });
  };

  return (
    <AdminLayout>
      <ContentWithSkeleton loading={loadingAssignments || loadingCohorts} lines={5}>
        <div className="max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">Gestión de Tareas</h1>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all">
                  <Plus size={16} />Crear Tarea
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Nueva Tarea</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Título *</Label>
                    <Input
                      placeholder="Nombre de la tarea"
                      className="bg-secondary border-border"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Instrucciones</Label>
                    <textarea
                      placeholder="Describe la tarea en detalle..."
                      className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Cohorte *</Label>
                    <select
                      className="w-full bg-secondary border border-border rounded-lg p-2.5 text-sm text-foreground"
                      value={cohortId}
                      onChange={(e) => setCohortId(e.target.value)}
                    >
                      <option value="">Seleccionar cohorte...</option>
                      {cohorts?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Fecha límite *</Label>
                    <Input
                      type="date"
                      className="bg-secondary border-border"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleCreate}
                    disabled={createAssignmentMutation.isPending}
                    className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {createAssignmentMutation.isPending && <Loader2 className="animate-spin" size={16} />}
                    Crear Tarea
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter - TODO: Implement client-side filtering */}
          <select className="bg-secondary border border-border rounded-lg p-2 text-sm text-foreground">
            <option>Todos los cohortes</option>
            {cohorts?.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>

          {/* Tasks list */}
          <div className="space-y-3">
            {assignments?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No hay tareas creadas.</div>
            ) : (
              assignments?.map((a) => (
                <Link key={a.id} to={`/admin/assignments/${a.id}/submissions`} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 card-hover">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.cohort_name || "Sin cohorte"}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{a.due_date ? formatDateEs(a.due_date) : "Sin fecha"}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{a.submission_count || 0}</p>
                    <p className="text-[10px] text-muted-foreground">entregadas</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
