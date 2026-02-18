import { StudentLayout } from "@/components/layouts/StudentLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookOpen, ClipboardCheck, CheckCircle2, LogOut, Github, Linkedin, Globe, MapPin, Pencil, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCohort } from "@/hooks/useCohorts";
import { useStudentProgress, useStudentSubmissions } from "@/hooks/useStudentData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/student.service";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/types/database.types";

export default function Profile() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [github, setGithub] = useState(profile?.github_username || "");
  const [linkedin, setLinkedin] = useState(profile?.linkedin_url || "");
  const [website, setWebsite] = useState(profile?.website_url || "");

  // Update effect to sync state when profile changes (e.g. after refetch)
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setGithub(profile.github_username || "");
      setLinkedin(profile.linkedin_url || "");
      setWebsite(profile.website_url || "");
    }
  }, [profile]);

  const { data: cohort, isLoading: loadingCohort } = useCohort(profile?.cohort_id || "");
  const { data: progressData, isLoading: loadingProgress } = useStudentProgress();
  const { data: submissions, isLoading: loadingSubmissions } = useStudentSubmissions();

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Database["public"]["Tables"]["profiles"]["Update"]>) => ProfileService.update(profile!.id, updates),
    onSuccess: () => {
      toast({ title: "Perfil actualizado correctamente" });
      setIsEditOpen(false);
      // Invalidate queries or reload auth profile if needed (AuthContext might need refresh)
      window.location.reload(); // Simple way to refresh auth context for now
    },
    onError: (error) => {
      toast({ title: "Error al actualizar perfil", description: error.message, variant: "destructive" });
    }
  });

  const handleUpdate = () => {
    if (!fullName.trim()) return;
    updateProfileMutation.mutate({
      full_name: fullName,
      bio,
      location,
      github_username: github,
      linkedin_url: linkedin,
      website_url: website
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loading = loadingCohort || loadingProgress || loadingSubmissions;

  // Calculate stats
  const completedClasses = progressData?.filter(p => p.completed).length || 0;
  const submittedAssignments = submissions?.length || 0;
  const reviewedAssignments = submissions?.filter(s => s.status === 'reviewed').length || 0;

  const stats = [
    { label: "Clases completadas", value: completedClasses.toString(), icon: BookOpen },
    { label: "Tareas entregadas", value: submittedAssignments.toString(), icon: ClipboardCheck },
    { label: "Tareas revisadas", value: reviewedAssignments.toString(), icon: CheckCircle2 },
  ];

  if (!profile) return null;

  return (
    <StudentLayout>
      <ContentWithSkeleton lines={5} loading={loading}>
        <div className="max-w-2xl space-y-6">
          <h1 className="text-2xl font-extrabold">Mi Perfil</h1>

          {/* Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center text-2xl font-extrabold text-foreground border-2 border-primary/20 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.initials || profile.full_name?.[0] || "?"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{profile.full_name}</h2>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      onClick={() => setFullName(profile.full_name)}
                    >
                      <Pencil size={14} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center text-3xl font-extrabold text-foreground border-2 border-primary/20 overflow-hidden relative group cursor-pointer">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{profile.initials || profile.full_name?.[0] || "?"}</span>
                          )}
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Pencil className="text-white" size={24} />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = e.target.files[0];
                                  try {
                                    toast({ title: "Subiendo imagen..." });
                                    const url = await ProfileService.uploadAvatar(file);
                                    updateProfileMutation.mutate({ avatar_url: url });
                                  } catch (error) {
                                    toast({ title: "Error al subir imagen", variant: "destructive" });
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground">Click para cambiar foto</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Nombre Completo</Label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ubicación</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-secondary border-border pl-9"
                            placeholder="Ciudad, País"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Biografía / Sobre mí</Label>
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="bg-secondary border-border min-h-[80px]"
                          placeholder="Breve descripción..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>GitHub Username</Label>
                          <div className="relative">
                            <Github className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                            <Input
                              value={github}
                              onChange={(e) => setGithub(e.target.value)}
                              className="bg-secondary border-border pl-9"
                              placeholder="usuario"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>LinkedIn URL</Label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                            <Input
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                              className="bg-secondary border-border pl-9"
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Sitio Web / Portfolio</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                          <Input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="bg-secondary border-border pl-9"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleUpdate}
                        disabled={updateProfileMutation.isPending}
                        className="w-full font-bold mt-2"
                      >
                        {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cambios
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
              {profile.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {profile.location}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                {profile.github_username && (
                  <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github size={18} />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin size={18} />
                  </a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Globe size={18} />
                  </a>
                )}
              </div>
              <p className="text-sm mt-2">
                {cohort?.name || "Sin cohorte"} — <span className="text-primary font-semibold">Campus Labora</span>
              </p>
              {profile.bio && <p className="text-sm mt-2 text-muted-foreground bg-secondary/30 p-2 rounded-lg border border-border">{profile.bio}</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center card-hover">
                <stat.icon size={24} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-destructive text-destructive font-medium py-2 px-4 rounded-lg text-sm hover:bg-destructive/10 transition-colors bg-card"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </ContentWithSkeleton>
    </StudentLayout>
  );
}
