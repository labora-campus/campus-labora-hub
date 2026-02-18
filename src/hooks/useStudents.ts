import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentsService, StudentProfile } from "@/services/students.service";
import { useToast } from "@/hooks/use-toast";

export const useStudents = () => {
    return useQuery({
        queryKey: ["admin", "students"],
        queryFn: () => StudentsService.getAll(),
    });
};

export const useStudent = (id: string) => {
    return useQuery({
        queryKey: ["admin", "student", id],
        queryFn: () => StudentsService.getById(id),
        enabled: !!id,
    });
};

export const useUpdateStudentCohort = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ studentId, cohortId }: { studentId: string; cohortId: string }) =>
            StudentsService.updateCohort(studentId, cohortId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "student"] });
            toast({ title: "Cohorte actualizado" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};
