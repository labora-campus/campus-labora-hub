import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type Module = Database["public"]["Tables"]["modules"]["Row"] & {
    lessons?: Database["public"]["Tables"]["lessons"]["Row"][];
};

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];

export type CreateModuleDTO = Database["public"]["Tables"]["modules"]["Insert"];
export type UpdateModuleDTO = Database["public"]["Tables"]["modules"]["Update"];

export type CreateLessonDTO = Database["public"]["Tables"]["lessons"]["Insert"];
export type UpdateLessonDTO = Database["public"]["Tables"]["lessons"]["Update"];

export const ModulesService = {
    async getByCohortId(cohortId: string) {
        const { data, error } = await supabase
            .from("modules")
            .select("*, lessons(*)")
            .eq("cohort_id", cohortId)
            .order("order_index", { ascending: true });

        if (error) throw error;

        // Sort lessons by order_index within each module
        const modulesWithSortedLessons = data.map((mod) => ({
            ...mod,
            lessons: mod.lessons?.sort((a, b) => a.order_index - b.order_index) || [],
        }));

        return modulesWithSortedLessons as Module[];
    },

    async create(module: CreateModuleDTO) {
        const { data, error } = await supabase.from("modules").insert(module).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: UpdateModuleDTO) {
        const { data, error } = await supabase.from("modules").update(updates).eq("id", id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from("modules").delete().eq("id", id);
        if (error) throw error;
    },
};

export const LessonsService = {
    async create(lesson: CreateLessonDTO) {
        const { data, error } = await supabase.from("lessons").insert(lesson).select().single();
        if (error) throw error;
        return data;
    },

    async update(id: string, updates: UpdateLessonDTO) {
        const { data, error } = await supabase.from("lessons").update(updates).eq("id", id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from("lessons").delete().eq("id", id);
        if (error) throw error;
    },
};

export const MaterialsService = {
    async getByLessonId(lessonId: string) {
        const { data, error } = await supabase
            .from("lesson_materials")
            .select("*")
            .eq("lesson_id", lessonId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data as Database["public"]["Tables"]["lesson_materials"]["Row"][];
    },

    async create(material: Database["public"]["Tables"]["lesson_materials"]["Insert"]) {
        const { data, error } = await supabase.from("lesson_materials").insert(material).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase.from("lesson_materials").delete().eq("id", id);
        if (error) throw error;
    },

    async uploadFile(file: File) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("materials")
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from("materials").getPublicUrl(filePath);
        return data.publicUrl;
    }
};
