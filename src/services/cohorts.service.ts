import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type Cohort = Database["public"]["Tables"]["cohorts"]["Row"] & {
    student_count?: number;
};

export type CreateCohortDTO = Database["public"]["Tables"]["cohorts"]["Insert"];
export type UpdateCohortDTO = Database["public"]["Tables"]["cohorts"]["Update"];

export const CohortsService = {
    async getAll() {
        const { data, error } = await supabase
            .from("cohorts")
            .select("*, profiles(count)")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Map the response to include student_count flattened
        return data.map((cohort: any) => ({
            ...cohort,
            student_count: cohort.profiles?.[0]?.count || 0,
        })) as Cohort[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from("cohorts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Cohort;
    },

    async create(cohort: CreateCohortDTO) {
        const { data, error } = await supabase
            .from("cohorts")
            .insert(cohort)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: UpdateCohortDTO) {
        const { data, error } = await supabase
            .from("cohorts")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from("cohorts").delete().eq("id", id);
        if (error) throw error;
    },
};
