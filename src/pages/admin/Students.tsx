import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { students, cohorts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={6}>
        <div className="max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">Gestión de Estudiantes</h1>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all">
                  <Plus size={16} />Agregar Estudiante
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Nuevo Estudiante</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Nombre completo</Label>
                    <Input placeholder="Nombre del estudiante" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <Input type="email" placeholder="email@ejemplo.com" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Cohorte</Label>
                    <select className="w-full bg-secondary border border-border rounded-lg p-2.5 text-sm text-foreground">
                      {cohorts.map((c) => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Password temporal</Label>
                    <div className="flex gap-2">
                      <Input readOnly value="Tmp-X7k9mQ" className="bg-secondary border-border font-mono" />
                      <button
                        onClick={() => { navigator.clipboard.writeText("Tmp-X7k9mQ"); toast({ title: "Copiado" }); }}
                        className="text-xs text-primary font-semibold shrink-0 hover:underline"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => { setModalOpen(false); toast({ title: "Estudiante agregado" }); }}
                    className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all"
                  >
                    Agregar Estudiante
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

          {/* Students list */}
          <div className="space-y-2">
            {students.map((s) => (
              <Link key={s.id} to={`/admin/students/${s.id}`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover">
                <div className="w-9 h-9 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <div className="w-20">
                    <Progress value={s.progress} className="h-1.5 bg-secondary [&>div]:bg-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{s.progress}%</span>
                </div>
                <Badge variant="default" className="text-[10px] shrink-0">{s.assignmentsSubmitted}/{s.totalAssignments}</Badge>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
