import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Users, Calendar, Loader2, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCohorts, useCreateCohort } from "@/hooks/useCohorts";
import { formatDateEs } from "@/data/mockData"; // Reuse date formatter for now

export default function Cohorts() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data: cohorts, isLoading } = useCohorts();
  const createCohortMutation = useCreateCohort();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = async () => {
    if (!name || !startDate || !endDate) {
      toast({ title: "Error", description: "Completa los campos obligatorios", variant: "destructive" });
      return;
    }

    createCohortMutation.mutate(
      {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
      },
      {
        onSuccess: (newCohort) => {
          setOpen(false);
          setName("");
          setDescription("");
          setStartDate("");
          setEndDate("");
          // Redirect to content management immediately
          navigate(`/admin/cohorts/${newCohort.id}/content`);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <ContentWithSkeleton loading={isLoading} lines={5}>
        <div className="max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">Gestión de Cohortes</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all">
                  <Plus size={16} />Crear Cohorte
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Nuevo Cohorte</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Nombre *</Label>
                    <Input
                      placeholder="Cohorte 16 — IA y No Code"
                      className="bg-secondary border-border"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Descripción</Label>
                    <Input
                      placeholder="Descripción del cohorte"
                      className="bg-secondary border-border"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fecha inicio *</Label>
                      <Input
                        type="date"
                        className="bg-secondary border-border"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fecha fin *</Label>
                      <Input
                        type="date"
                        className="bg-secondary border-border"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCreate}
                    disabled={createCohortMutation.isPending}
                    className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {createCohortMutation.isPending && <Loader2 className="animate-spin" size={16} />}
                    Crear y Gestionar Contenido
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cohorts table */}
          {cohorts?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay cohortes creados aún.
            </div>
          ) : (
            <div className="space-y-3">
              {cohorts?.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-4 card-hover">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{c.name}</span>
                        <Badge variant={c.is_active ? "success" : "secondary"} className="text-[10px]">
                          {c.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {c.start_date ? formatDateEs(c.start_date) : "N/A"} — {c.end_date ? formatDateEs(c.end_date) : "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {c.student_count || 0} estudiantes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/cohorts/${c.id}/content`}
                        className="flex items-center gap-2 border border-primary text-primary hover:bg-primary/10 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors"
                      >
                        <BookOpen size={14} />
                        Gestionar Contenido
                      </Link>
                      <button
                        onClick={() => toast({ title: "Proximamente", description: "Función de duplicar en desarrollo" })}
                        className="text-muted-foreground hover:text-primary transition-colors p-2"
                        title="Duplicar"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
