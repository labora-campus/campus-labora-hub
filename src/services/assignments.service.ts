import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type Assignment = Database["public"]["Tables"]["assignments"]["Row"] & {
    submission_count?: number; // Calculated field
};

export type CreateAssignmentDTO = Database["public"]["Tables"]["assignments"]["Insert"];
export type UpdateAssignmentDTO = Database["public"]["Tables"]["assignments"]["Update"];

export const AssignmentsService = {
    async getAll() {
        // Fetch all assignments ordered by created_at
        const { data, error } = await supabase
            .from("assignments")
            .select("*, cohorts(name)")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch submission counts for each assignment
        // This is a bit inefficient (N+1), in production we might want a SQL view or a join if possible
        const assignmentsWithCounts = await Promise.all(data.map(async (a) => {
            const { count } = await supabase
                .from("submissions")
                .select("*", { count: 'exact', head: true })
                .eq("assignment_id", a.id)
                .neq("status", "not_submitted"); // Assuming we track non-submitted differently or just count records

            return {
                ...a,
                submission_count: count || 0,
                cohort_name: a.cohorts?.name
            };
        }));

        return assignmentsWithCounts;
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from("assignments")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(assignment: CreateAssignmentDTO) {
        const { data, error } = await supabase
            .from("assignments")
            .insert(assignment)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: UpdateAssignmentDTO) {
        const { data, error } = await supabase
            .from("assignments")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from("assignments")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
