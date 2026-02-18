import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModulesService, LessonsService, CreateModuleDTO, UpdateModuleDTO, CreateLessonDTO, UpdateLessonDTO } from "@/services/modules.service";
import { useToast } from "@/hooks/use-toast";

export const useModules = (cohortId: string) => {
    return useQuery({
        queryKey: ["modules", cohortId],
        queryFn: () => ModulesService.getByCohortId(cohortId),
        enabled: !!cohortId,
    });
};

export const useCreateModule = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (module: CreateModuleDTO) => ModulesService.create(module),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["modules", variables.cohort_id] });
            toast({ title: "Módulo creado" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

export const useUpdateModule = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateModuleDTO }) =>
            ModulesService.update(id, updates),
        onSuccess: (_, variables) => {
            // We need cohortId to invalidate properly, but it's not directly in arguments if we only pass id/updates.
            // Alternatively invalidate all modules queries or pass cohortId.
            // For now, simpler to invalidate all "modules" queries.
            queryClient.invalidateQueries({ queryKey: ["modules"] });
            // toast({ title: "Módulo actualizado" }); // Optional toast
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

export const useDeleteModule = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => ModulesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules"] });
            toast({ title: "Módulo eliminado" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

// Lessons Hooks

export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (lesson: CreateLessonDTO) => LessonsService.create(lesson),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules"] });
            toast({ title: "Clase creada" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

export const useUpdateLesson = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateLessonDTO }) =>
            LessonsService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules"] });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};

export const useDeleteLesson = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => LessonsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules"] });
            toast({ title: "Clase eliminada" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};
