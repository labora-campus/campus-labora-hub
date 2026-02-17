import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { assignments, cohorts, formatDateEs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminAssignments() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const taskStats = [
    { id: 1, submitted: 4, total: 8, reviewed: 3 },
    { id: 2, submitted: 0, total: 8, reviewed: 0 },
    { id: 3, submitted: 0, total: 8, reviewed: 0 },
  ];

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={5}>
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
                    <Label className="text-muted-foreground">Título</Label>
                    <Input placeholder="Nombre de la tarea" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Instrucciones</Label>
                    <textarea placeholder="Describe la tarea en detalle..." className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Cohorte</Label>
                    <select className="w-full bg-secondary border border-border rounded-lg p-2.5 text-sm text-foreground">
                      {cohorts.map((c) => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Fecha límite</Label>
                    <Input type="date" className="bg-secondary border-border" />
                  </div>
                  <button
                    onClick={() => { setModalOpen(false); toast({ title: "Tarea creada" }); }}
                    className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all"
                  >
                    Crear Tarea
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter */}
          <select className="bg-secondary border border-border rounded-lg p-2 text-sm text-foreground">
            <option>Todos los cohortes</option>
            {cohorts.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>

          {/* Tasks list */}
          <div className="space-y-3">
            {assignments.map((a, i) => {
              const stats = taskStats[i];
              return (
                <Link key={a.id} to={`/admin/assignments/${a.id}/submissions`} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 card-hover">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.moduleName}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{formatDateEs(a.deadline)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{stats.submitted}/{stats.total}</p>
                    <p className="text-[10px] text-muted-foreground">entregadas</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
