import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type LessonProgress = Database["public"]["Tables"]["lesson_progress"]["Row"];

export const AssignmentsService = {
    async getByCohortId(cohortId: string) {
        const { data, error } = await supabase
            .from("assignments")
            .select("*")
            .eq("cohort_id", cohortId)
            .eq("is_published", true)
            .order("due_date", { ascending: true });

        if (error) throw error;
        return data as Assignment[];
    },

    async getStudentSubmissions(studentId: string) {
        const { data, error } = await supabase
            .from("submissions")
            .select("*")
            .eq("student_id", studentId);

        if (error) throw error;
        return data as Submission[];
    }
};

export const ProgressService = {
    async getStudentProgress(studentId: string) {
        const { data, error } = await supabase
            .from("lesson_progress")
            .select("*")
            .eq("student_id", studentId);

        if (error) throw error;
        return data as LessonProgress[];
    },

    async toggleLessonCompletion(studentId: string, lessonId: string, completed: boolean) {
        if (completed) {
            const { data, error } = await supabase
                .from("lesson_progress")
                .upsert({
                    student_id: studentId,
                    lesson_id: lessonId,
                    completed: true,
                    completed_at: new Date().toISOString()
                }, { onConflict: "student_id,lesson_id" })
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { error } = await supabase
                .from("lesson_progress")
                .delete()
                .eq("student_id", studentId)
                .eq("lesson_id", lessonId);

            if (error) throw error;
            return null;
        }
    }
};

export const ProfileService = {
    async update(userId: string, updates: Database["public"]["Tables"]["profiles"]["Update"]) {
        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async uploadAvatar(file: File) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        return data.publicUrl;
    }
};
