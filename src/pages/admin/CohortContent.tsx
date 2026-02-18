import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Plus, ArrowLeft, Clock, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCohort } from "@/hooks/useCohorts";
import { useModules, useCreateModule, useUpdateModule, useDeleteModule, useCreateLesson, useUpdateLesson, useDeleteLesson } from "@/hooks/useModules";
import { MaterialsService } from "@/services/modules.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Link as LinkIcon } from "lucide-react";

export default function CohortContent() {
  const { id } = useParams();
  const { data: cohort, isLoading: loadingCohort } = useCohort(id || "");
  const { data: modules, isLoading: loadingModules } = useModules(id || "");

  // Mutations
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();

  const [expanded, setExpanded] = useState<string | null>(null);

  // Modals State
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editModuleModalOpen, setEditModuleModalOpen] = useState(false);
  const [editLessonModalOpen, setEditLessonModalOpen] = useState(false);

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Forms
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonDate, setLessonDate] = useState(""); // YYYY-MM-DDTHH:MM

  const [moduleTitle, setModuleTitle] = useState("");

  // Lesson Materials State
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");
  const [materialType, setMaterialType] = useState("link"); // link, pdf, file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Lesson Materials Queries & Mutations
  const { data: materials } = useQuery({
    queryKey: ["materials", selectedLessonId],
    queryFn: () => MaterialsService.getByLessonId(selectedLessonId!),
    enabled: !!selectedLessonId && editLessonModalOpen
  });

  const createMaterialMutation = useMutation({
    mutationFn: MaterialsService.create,
    onSuccess: () => {
      toast({ title: "Material agregado" });
      setMaterialTitle("");
      setMaterialUrl("");
      queryClient.invalidateQueries({ queryKey: ["materials", selectedLessonId] });
    }
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: MaterialsService.delete,
    onSuccess: () => {
      toast({ title: "Material eliminado" });
      queryClient.invalidateQueries({ queryKey: ["materials", selectedLessonId] });
    }
  });

  const handleAddMaterial = async () => {
    if (!selectedLessonId || !materialTitle) return;

    let finalUrl = materialUrl;

    if (materialType === 'pdf' || materialType === 'file') {
      if (!selectedFile && !materialUrl) {
        toast({ title: "Debes seleccionar un archivo o ingresar una URL", variant: "destructive" });
        return;
      }

      if (selectedFile) {
        try {
          // Upload file first
          const uploadedUrl = await MaterialsService.uploadFile(selectedFile);
          finalUrl = uploadedUrl;
        } catch (error) {
          console.error("Error uploading file:", error);
          toast({ title: "Error al subir el archivo", variant: "destructive" });
          return;
        }
      }
    } else {
      if (!materialUrl) {
        toast({ title: "Ingresa una URL válida", variant: "destructive" });
        return;
      }
    }

    createMaterialMutation.mutate({
      lesson_id: selectedLessonId,
      title: materialTitle,
      file_url: finalUrl,
      type: materialType
    });
  };

  if (!id) return null;

  const handleCreateModule = () => {
    const modulesCount = modules?.length || 0;
    createModuleMutation.mutate({
      cohort_id: id,
      title: `Nuevo Módulo ${modulesCount + 1}`,
      order_index: modulesCount + 1,
      is_published: false
    });
  };

  const openEditModule = (mod: any) => {
    setSelectedModuleId(mod.id);
    setModuleTitle(mod.title);
    setEditModuleModalOpen(true);
  };

  const handleUpdateModule = () => {
    if (!selectedModuleId || !moduleTitle) return;
    updateModuleMutation.mutate({
      id: selectedModuleId,
      updates: { title: moduleTitle }
    }, {
      onSuccess: () => setEditModuleModalOpen(false)
    });
  };

  const toLocalISOString = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Format to YYYY-MM-DDTHH:MM for input
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const openEditLesson = (lesson: any) => {
    setSelectedLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonDesc(lesson.description || "");
    setLessonVideo(lesson.video_url || "");
    setLessonDuration(lesson.duration_minutes?.toString() || "");
    // Format date for input type="datetime-local"
    setLessonDate(toLocalISOString(lesson.date));
    setEditLessonModalOpen(true);
  };

  const handleUpdateLesson = () => {
    if (!selectedLessonId || !lessonTitle) return;

    // Create date from local time string
    const formattedDate = lessonDate ? new Date(lessonDate).toISOString() : null;

    updateLessonMutation.mutate({
      id: selectedLessonId,
      updates: {
        title: lessonTitle,
        description: lessonDesc,
        video_url: lessonVideo,
        duration_minutes: parseInt(lessonDuration) || 0,
        date: formattedDate
      }
    }, {
      onSuccess: () => setEditLessonModalOpen(false)
    });
  };

  const handleCreateLesson = () => {
    if (!selectedModuleId || !lessonTitle) return;

    // Calculate order index based on existing lessons in that module
    const module = modules?.find(m => m.id === selectedModuleId);
    const orderIndex = (module?.lessons?.length || 0) + 1;

    // Create date from local time string
    const formattedDate = lessonDate ? new Date(lessonDate).toISOString() : null;

    createLessonMutation.mutate({
      module_id: selectedModuleId,
      title: lessonTitle,
      description: lessonDesc,
      video_url: lessonVideo,
      duration_minutes: parseInt(lessonDuration) || 0,
      order_index: orderIndex,
      is_published: true,
      date: formattedDate
    }, {
      onSuccess: () => {
        setClassModalOpen(false);
        setLessonTitle("");
        setLessonDesc("");
        setLessonVideo("");
        setLessonDuration("");
        setLessonDate("");
      }
    });
  };

  if (loadingCohort || loadingModules) {
    return (
      <AdminLayout>
        <ContentWithSkeleton loading={true} lines={6}>
          <div />
        </ContentWithSkeleton>
      </AdminLayout>
    );
  }

  if (!cohort) {
    return <AdminLayout><p className="text-muted-foreground p-8">Cohorte no encontrado.</p></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/admin/cohorts" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold">{cohort.name}</h1>
          <Badge variant={cohort.is_active ? "success" : "secondary"}>
            {cohort.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        {/* Modules */}
        <div className="space-y-3">
          {modules?.map((mod) => {
            const isExpanded = expanded === mod.id;
            return (
              <div key={mod.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <GripVertical size={16} className="text-muted-foreground cursor-grab shrink-0" />
                  <Badge variant="primary" className="text-xs font-bold shrink-0">S{mod.order_index}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{mod.title}</p>
                  </div>
                  <Badge variant={mod.is_published ? "success" : "default"}>
                    {mod.is_published ? "Publicado" : "Borrador"}
                  </Badge>
                  <Switch
                    checked={mod.is_published}
                    onCheckedChange={(checked) => updateModuleMutation.mutate({ id: mod.id, updates: { is_published: checked } })}
                  />
                  <button onClick={() => openEditModule(mod)} className="text-muted-foreground hover:text-foreground">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("¿Estás seguro de eliminar este módulo?")) {
                        deleteModuleMutation.mutate(mod.id);
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : mod.id)} className="text-muted-foreground">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-border">
                    {mod.lessons?.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                        <GripVertical size={14} className="text-muted-foreground cursor-grab shrink-0" />
                        <span className="flex-1 text-sm">{lesson.title}</span>
                        {lesson.date && (
                          <Badge variant="secondary" className="text-[10px] mr-2">
                            {new Date(lesson.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </Badge>
                        )}
                        <Badge variant="default" className="text-[10px]">
                          <Clock size={10} className="mr-1" />{lesson.duration_minutes || 0} min
                        </Badge>
                        <button onClick={() => openEditLesson(lesson)} className="text-muted-foreground hover:text-foreground">
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("¿Eliminar clase?")) deleteLessonMutation.mutate(lesson.id);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    <Dialog open={classModalOpen} onOpenChange={(open) => {
                      setClassModalOpen(open);
                      if (open) {
                        setSelectedModuleId(mod.id);
                        setLessonTitle("");
                        setLessonDesc("");
                        setLessonVideo("");
                        setLessonDuration("");
                        setLessonDate("");
                      }
                    }}>
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
                            <Input
                              placeholder="Nombre de la clase"
                              className="bg-secondary border-border"
                              value={lessonTitle}
                              onChange={(e) => setLessonTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Descripción</Label>
                            <textarea
                              placeholder="Descripción de la clase..."
                              className="w-full h-20 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                              value={lessonDesc}
                              onChange={(e) => setLessonDesc(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Fecha y Hora</Label>
                            <Input
                              type="datetime-local"
                              className="bg-secondary border-border"
                              value={lessonDate}
                              onChange={(e) => setLessonDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">URL del video</Label>
                            <Input
                              placeholder="https://drive.google.com/..."
                              className="bg-secondary border-border"
                              value={lessonVideo}
                              onChange={(e) => setLessonVideo(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Duración (minutos)</Label>
                            <Input
                              type="number"
                              placeholder="45"
                              className="bg-secondary border-border"
                              value={lessonDuration}
                              onChange={(e) => setLessonDuration(e.target.value)}
                            />
                          </div>
                          <button
                            onClick={handleCreateLesson}
                            disabled={createLessonMutation.isPending}
                            className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all flex items-center justify-center gap-2"
                          >
                            {createLessonMutation.isPending && <Loader2 className="animate-spin" size={16} />}
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
            onClick={handleCreateModule}
            disabled={createModuleMutation.isPending}
            className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex flex-col items-center justify-center"
          >
            {createModuleMutation.isPending ? (
              <Loader2 className="animate-spin mb-1" size={20} />
            ) : (
              <Plus size={20} className="mx-auto mb-1" />
            )}
            <span className="text-sm font-medium">Agregar Módulo</span>
          </button>
        </div>

        {/* Edit Module Dialog */}
        <Dialog open={editModuleModalOpen} onOpenChange={setEditModuleModalOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Editar Módulo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Título del Módulo</Label>
                <Input
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <button
                onClick={handleUpdateModule}
                disabled={updateModuleMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {updateModuleMutation.isPending && <Loader2 className="animate-spin" size={16} />}
                Guardar Cambios
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson Dialog */}
        <Dialog open={editLessonModalOpen} onOpenChange={setEditLessonModalOpen}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Clase</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha y Hora</Label>
                  <Input
                    type="datetime-local"
                    className="bg-secondary border-border"
                    value={lessonDate}
                    onChange={(e) => setLessonDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm text-foreground resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>URL del Video</Label>
                <Input
                  value={lessonVideo}
                  onChange={(e) => setLessonVideo(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Duración (min)</Label>
                <Input
                  type="number"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="flex justify-end pt-2 border-b border-border pb-6">
                <button
                  onClick={handleUpdateLesson}
                  disabled={updateLessonMutation.isPending}
                  className="bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg btn-scale hover:brightness-110 transition-all"
                >
                  {updateLessonMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>

              {/* Materiales Extra */}
              <div className="pt-2">
                <h3 className="font-bold text-lg mb-3">Materiales de apoyo</h3>

                <div className="space-y-3 mb-4">
                  {materials?.map(material => (
                    <div key={material.id} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-primary/10 p-2 rounded-md text-primary">
                          {material.type === 'pdf' ? <FileText size={18} /> : <LinkIcon size={18} />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{material.title}</p>
                          <a href={material.file_url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline truncate block">
                            {material.file_url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("¿Eliminar este material?")) deleteMaterialMutation.mutate(material.id);
                        }}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {materials?.length === 0 && <p className="text-sm text-muted-foreground">No hay materiales extra.</p>}
                </div>

                <div className="bg-secondary/50 p-4 rounded-xl space-y-3">
                  <p className="text-sm font-semibold">Agregar nuevo material</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Título (ej: Slides, PDF, Link)"
                      className="bg-background border-border"
                      value={materialTitle}
                      onChange={e => setMaterialTitle(e.target.value)}
                    />
                    <select
                      className="bg-background border border-border rounded-md px-3 text-sm h-10"
                      value={materialType}
                      onChange={e => {
                        setMaterialType(e.target.value);
                        setSelectedFile(null);
                        setMaterialUrl("");
                      }}
                    >
                      <option value="link">Enlace / URL</option>
                      <option value="pdf">Documento PDF</option>
                      <option value="file">Archivo General</option>
                    </select>
                  </div>

                  {materialType === 'link' ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://..."
                        className="bg-background border-border flex-1"
                        value={materialUrl}
                        onChange={e => setMaterialUrl(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Input
                        type="file"
                        className="bg-background border-border flex-1 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}

                  <button
                    onClick={handleAddMaterial}
                    disabled={createMaterialMutation.isPending || !materialTitle || (!materialUrl && !selectedFile)}
                    className="w-full bg-foreground text-background font-bold py-2 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createMaterialMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    {createMaterialMutation.isPending ? "Subiendo..." : "Agregar Material"}
                  </button>
                </div>
              </div>

            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}

