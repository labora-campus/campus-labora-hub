import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentsService, ProgressService } from "@/services/student.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useAssignments = (cohortId: string) => {
    return useQuery({
        queryKey: ["assignments", cohortId],
        queryFn: () => AssignmentsService.getByCohortId(cohortId),
        enabled: !!cohortId,
    });
};

export const useStudentProgress = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ["progress", user?.id],
        queryFn: () => ProgressService.getStudentProgress(user!.id),
        enabled: !!user,
    });
};

export const useStudentSubmissions = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ["submissions", user?.id],
        queryFn: () => AssignmentsService.getStudentSubmissions(user!.id),
        enabled: !!user,
    });
};

export const useToggleLesson = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ lessonId, completed }: { lessonId: string; completed: boolean }) =>
            ProgressService.toggleLessonCompletion(user!.id, lessonId, completed),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["progress", user?.id] });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};
