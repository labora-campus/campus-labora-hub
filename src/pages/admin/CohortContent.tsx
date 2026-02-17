import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { modules, cohorts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Plus, ArrowLeft, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function CohortContent() {
  const { id } = useParams();
  const cohort = cohorts.find((c) => c.id === id);
  const [expanded, setExpanded] = useState<number | null>(1);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const { toast } = useToast();

  if (!cohort) {
    return <AdminLayout><p className="text-muted-foreground">Cohorte no encontrado.</p></AdminLayout>;
  }

  return (
    <AdminLayout>
      <ContentWithSkeleton lines={6}>
        <div className="max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/admin/cohorts" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-extrabold">{cohort.name}</h1>
            <Badge variant="success">Activo</Badge>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            {modules.map((mod) => {
              const isExpanded = expanded === mod.id;
              return (
                <div key={mod.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <GripVertical size={16} className="text-muted-foreground cursor-grab shrink-0" />
                    <Badge variant="primary" className="text-xs font-bold shrink-0">S{mod.id}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{mod.title}</p>
                    </div>
                    <Badge variant={mod.published ? "success" : "default"}>
                      {mod.published ? "Publicado" : "Borrador"}
                    </Badge>
                    <Switch
                      checked={mod.published}
                      onCheckedChange={() => toast({ title: mod.published ? "Módulo despublicado" : "Módulo publicado" })}
                    />
                    <button className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                    <button onClick={() => setExpanded(isExpanded ? null : mod.id)} className="text-muted-foreground">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border">
                      {mod.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                          <GripVertical size={14} className="text-muted-foreground cursor-grab shrink-0" />
                          <span className="flex-1 text-sm">{lesson.title}</span>
                          <Badge variant="default" className="text-[10px]">
                            <Clock size={10} className="mr-1" />{lesson.duration} min
                          </Badge>
                          <button className="text-muted-foreground hover:text-foreground"><Pencil size={12} /></button>
                          <button className="text-muted-foreground hover:text-destructive"><Trash2 size={12} /></button>
                        </div>
                      ))}

                      <Dialog open={classModalOpen} onOpenChange={setClassModalOpen}>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-2 w-full px-4 py-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Plus size={14} />Agregar clase
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle>Nueva Clase</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">Título</Label>
                              <Input placeholder="Nombre de la clase" className="bg-secondary border-border" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">Descripción</Label>
                              <textarea placeholder="Descripción de la clase..." className="w-full h-20 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">URL del video</Label>
                              <Input placeholder="https://drive.google.com/file/d/.../preview" className="bg-secondary border-border" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">Duración (minutos)</Label>
                              <Input type="number" placeholder="45" className="bg-secondary border-border" />
                            </div>
                            <button
                              onClick={() => { setClassModalOpen(false); toast({ title: "Clase creada" }); }}
                              className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all"
                            >
                              Guardar Clase
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add module */}
            <button
              onClick={() => toast({ title: "Módulo creado", description: "Nuevo módulo agregado al cohorte." })}
              className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            >
              <Plus size={20} className="mx-auto mb-1" />
              <span className="text-sm font-medium">Agregar Módulo</span>
            </button>
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
