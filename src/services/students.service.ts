import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type StudentProfile = Database["public"]["Tables"]["profiles"]["Row"] & {
    cohort_name?: string;
    progress?: number; // Calculated field
    completed_lessons?: number;
    total_assignments?: number;
    submitted_assignments?: number;
};

export const StudentsService = {
    async getAll() {
        // Fetch all profiles with role 'student'
        const { data, error } = await supabase
            .from("profiles")
            .select("*, cohorts(name)")
            .eq("role", "student")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // In a real app, calculation of progress should be done in a SQL view or aggregated query
        // For MVP, we'll return the profiles and load detailed stats in the detail view or asynchronously
        // to avoid heavy calculations on the list view.
        // We will just map cohort name.

        return data.map(p => ({
            ...p,
            cohort_name: p.cohorts?.name
        })) as StudentProfile[];
    },

    async getById(id: string) {
        // Fetch specific student with cohort
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("*, cohorts(name)")
            .eq("id", id)
            .single();

        if (error) throw error;

        // Fetch progress stats
        // 1. Total lessons in their cohort
        let totalLessons = 0;
        if (profile.cohort_id) {
            const { count } = await supabase
                .from("lessons")
                .select("id", { count: 'exact', head: true })
            // This logic is complex because lessons are nested in modules. 
            // We'd need a join: lessons -> modules -> cohorts
            // Simplified: Fetch all modules for cohort, then sum lessons.
            // Or simplified for MVP: just get completed count from progress table
        }

        // Get completed lessons count
        const { count: completedCount } = await supabase
            .from("lesson_progress")
            .select("*", { count: 'exact', head: true })
            .eq("student_id", id)
            .eq("completed", true);

        // Get assignments stats
        const { count: submittedAssignments } = await supabase
            .from("submissions")
            .select("*", { count: 'exact', head: true })
            .eq("student_id", id);

        return {
            ...profile,
            cohort_name: profile.cohorts?.name,
            completed_lessons: completedCount || 0,
            submitted_assignments: submittedAssignments || 0,
            progress: 0 // We'd need total lessons to calculate %, leaving as 0 or handling in UI for now
        } as StudentProfile;
    },

    async updateCohort(studentId: string, cohortId: string) {
        const { data, error } = await supabase
            .from("profiles")
            .update({ cohort_id: cohortId })
            .eq("id", studentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
