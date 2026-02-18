import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmissionsService, UpdateSubmissionDTO } from "@/services/submissions.service";
import { useToast } from "@/hooks/use-toast";

export const useSubmissions = (assignmentId: string) => {
    return useQuery({
        queryKey: ["submissions", assignmentId],
        queryFn: () => SubmissionsService.getByAssignmentId(assignmentId),
        enabled: !!assignmentId,
    });
};

export const useGradeSubmission = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateSubmissionDTO }) =>
            SubmissionsService.grade(id, updates),
        onSuccess: (_, variables) => {
            // Invalidate submissions for this assignment (we don't have assignmentId here easily)
            // Invalidating all submissions queries is safer effectively
            queryClient.invalidateQueries({ queryKey: ["submissions"] });
            toast({ title: "Feedback enviado", description: "La calificación ha sido guardada." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });
};
