import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { cohorts, formatDateEs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Users, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Cohorts() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    setOpen(false);
    toast({ title: "Cohorte creado", description: "El nuevo cohorte ha sido creado exitosamente." });
  };

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={5}>
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
                    <Label className="text-muted-foreground">Nombre</Label>
                    <Input placeholder="Cohorte 16 — IA y No Code" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Descripción</Label>
                    <Input placeholder="Descripción del cohorte" className="bg-secondary border-border" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fecha inicio</Label>
                      <Input type="date" className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fecha fin</Label>
                      <Input type="date" className="bg-secondary border-border" />
                    </div>
                  </div>
                  <button onClick={handleCreate} className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all">
                    Crear Cohorte
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cohorts table */}
          <div className="space-y-3">
            {cohorts.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 card-hover">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <Link to={`/admin/cohorts/${c.id}/content`} className="font-semibold hover:text-primary transition-colors">
                      {c.name}
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} />{formatDateEs(c.startDate)} — {formatDateEs(c.endDate)}</span>
                      <span className="flex items-center gap-1"><Users size={12} />{c.students} estudiantes</span>
                    </div>
                  </div>
                  <Badge variant={c.status === "active" ? "success" : "default"}>
                    {c.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                  <button
                    onClick={() => toast({ title: "Cohorte duplicado", description: `Se ha duplicado "${c.name}"` })}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Duplicar"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
