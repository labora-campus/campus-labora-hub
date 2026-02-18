import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type Submission = Database["public"]["Tables"]["submissions"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"]; // Joined profile
};

export type UpdateSubmissionDTO = {
    grade?: string;
    feedback?: string;
    status: "reviewed" | "revision_requested";
};

export const SubmissionsService = {
    async getByAssignmentId(assignmentId: string) {
        const { data, error } = await supabase
            .from("submissions")
            .select("*, profiles(*)")
            .eq("assignment_id", assignmentId);

        if (error) throw error;
        return data as Submission[];
    },

    async grade(id: string, updates: UpdateSubmissionDTO) {
        const { data, error } = await supabase
            .from("submissions")
            .update({
                grade: updates.grade,
                admin_feedback: updates.feedback,
                status: updates.status,
                reviewed_at: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
