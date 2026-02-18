import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { ContentWithSkeleton } from "@/components/SkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreVertical, Copy, Mail, User } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { formatDateEs } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const { data: students, isLoading } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredStudents = students?.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <ContentWithSkeleton loading={isLoading} lines={5}>
        <div className="max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold">Estudiantes</h1>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm btn-scale hover:brightness-110 transition-all">
                  <Plus size={16} />Invitar Estudiante
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Invitar Estudiante</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Los estudiantes deben registrarse por su cuenta. Puedes enviarles el link de registro.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input value={`${window.location.origin}/register`} readOnly />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/register`);
                        toast({ title: "Link copiado" });
                      }}
                      className="bg-secondary p-2 rounded-md hover:bg-secondary/80"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Cohorte</th>
                    <th className="px-6 py-3">Fecha de Registro</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No se encontraron estudiantes.</td>
                    </tr>
                  ) : (
                    filteredStudents?.map((student) => (
                      <tr key={student.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {student.initials || "ST"}
                            </div>
                            <div>
                              <Link to={`/admin/students/${student.id}`} className="font-semibold hover:text-primary transition-colors block">
                                {student.full_name || "Sin nombre"}
                              </Link>
                              <span className="text-xs text-muted-foreground">{student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {student.cohort_name ? (
                            <Badge variant="secondary" className="font-normal">{student.cohort_name}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Sin asignar</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {student.created_at ? formatDateEs(student.created_at) : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/students/${student.id}`}
                            className="text-primary hover:underline text-xs font-semibold"
                          >
                            Ver Detalle
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ContentWithSkeleton>
    </AdminLayout>
  );
}
