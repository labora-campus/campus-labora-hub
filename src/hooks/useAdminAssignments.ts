import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentsService, CreateAssignmentDTO, UpdateAssignmentDTO } from "@/services/assignments.service";
import { useToast } from "@/hooks/use-toast";

export const useAdminAssignments = () => {
    return useQuery({
        queryKey: ["admin", "assignments"],
        queryFn: () => AssignmentsService.getAll(),
    });
};

export const useAssignment = (id: string) => {
    return useQuery({
        queryKey: ["assignment", id],
        queryFn: () => AssignmentsService.getById(id),
        enabled: !!id,
    });
};

export const useCreateAssignment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (assignment: CreateAssignmentDTO) => AssignmentsService.create(assignment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "assignments"] });
            toast({ title: "Tarea creada" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateAssignmentDTO }) =>
            AssignmentsService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "assignments"] });
            queryClient.invalidateQueries({ queryKey: ["assignment"] });
            toast({ title: "Tarea actualizada" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

export const useDeleteAssignment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => AssignmentsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "assignments"] });
            toast({ title: "Tarea eliminada" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};
