import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CohortsService, CreateCohortDTO, UpdateCohortDTO } from "@/services/cohorts.service";
import { useToast } from "@/hooks/use-toast";

export const useCohorts = () => {
    return useQuery({
        queryKey: ["cohorts"],
        queryFn: CohortsService.getAll,
    });
};

export const useCohort = (id: string) => {
    return useQuery({
        queryKey: ["cohorts", id],
        queryFn: () => CohortsService.getById(id),
        enabled: !!id,
    });
};

export const useCreateCohort = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (cohort: CreateCohortDTO) => CohortsService.create(cohort),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cohorts"] });
            toast({
                title: "Cohorte creado",
                description: "El nuevo cohorte se ha creado exitosamente.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error al crear cohorte",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};

export const useUpdateCohort = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateCohortDTO }) =>
            CohortsService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cohorts"] });
            toast({
                title: "Cohorte actualizado",
                description: "Los cambios se han guardado exitosamente.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error al actualizar",
                description: error.message,
                variant: "destructive",
            });
        },
    });
};
