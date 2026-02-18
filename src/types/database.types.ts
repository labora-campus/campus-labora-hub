export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string
                    email: string
                    initials: string | null
                    avatar_url: string | null
                    role: "student" | "admin"
                    cohort_id: string | null
                    created_at: string
                    updated_at: string
                    // Expanded fields
                    bio: string | null
                    github_username: string | null
                    linkedin_url: string | null
                    website_url: string | null
                    location: string | null
                }
                Insert: {
                    id: string
                    full_name: string
                    email: string
                    initials?: string | null
                    avatar_url?: string | null
                    role?: "student" | "admin"
                    cohort_id?: string | null
                    created_at?: string
                    updated_at?: string
                    // Expanded fields
                    bio?: string | null
                    github_username?: string | null
                    linkedin_url?: string | null
                    website_url?: string | null
                    location?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string
                    initials?: string | null
                    avatar_url?: string | null
                    role?: "student" | "admin"
                    cohort_id?: string | null
                    created_at?: string
                    updated_at?: string
                    // Expanded fields
                    bio?: string | null
                    github_username?: string | null
                    linkedin_url?: string | null
                    website_url?: string | null
                    location?: string | null
                }
            }
            cohorts: {
                Row: {
                    id: string
                    name: string
                    slug: string | null
                    description: string | null
                    start_date: string | null
                    end_date: string | null
                    max_students: number | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug?: string | null
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    max_students?: number | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string | null
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    max_students?: number | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            modules: {
                Row: {
                    id: string
                    cohort_id: string
                    title: string
                    description: string | null
                    order_index: number
                    is_published: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    cohort_id: string
                    title: string
                    description?: string | null
                    order_index: number
                    is_published?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    cohort_id?: string
                    title?: string
                    description?: string | null
                    order_index?: number
                    is_published?: boolean
                    created_at?: string
                }
            }
            lessons: {
                Row: {
                    id: string
                    module_id: string
                    title: string
                    description: string | null
                    video_url: string | null
                    order_index: number
                    duration_minutes: number | null
                    status: string
                    is_published: boolean
                    date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    module_id: string
                    title: string
                    description?: string | null
                    video_url?: string | null
                    order_index: number
                    duration_minutes?: number | null
                    status?: string
                    is_published?: boolean
                    date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    module_id?: string
                    title?: string
                    description?: string | null
                    video_url?: string | null
                    order_index?: number
                    duration_minutes?: number | null
                    status?: string
                    is_published?: boolean
                    date?: string | null
                    created_at?: string
                }
            }
            lesson_materials: {
                Row: {
                    id: string
                    lesson_id: string
                    title: string
                    type: string | null
                    file_url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    lesson_id: string
                    title: string
                    type?: string | null
                    file_url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    lesson_id?: string
                    title?: string
                    type?: string | null
                    file_url?: string
                    created_at?: string
                }
            }
            assignments: {
                Row: {
                    id: string
                    cohort_id: string
                    module_id: string | null
                    title: string
                    description: string | null
                    due_date: string | null
                    is_published: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    cohort_id: string
                    module_id?: string | null
                    title: string
                    description?: string | null
                    due_date?: string | null
                    is_published?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    cohort_id?: string
                    module_id?: string | null
                    title?: string
                    description?: string | null
                    due_date?: string | null
                    is_published?: boolean
                    created_at?: string
                }
            }
            submissions: {
                Row: {
                    id: string
                    assignment_id: string
                    student_id: string
                    content_text: string | null
                    file_url: string | null
                    link_url: string | null
                    status: string
                    grade: string | null
                    admin_feedback: string | null
                    submitted_at: string
                    reviewed_at: string | null
                }
                Insert: {
                    id?: string
                    assignment_id: string
                    student_id: string
                    content_text?: string | null
                    file_url?: string | null
                    link_url?: string | null
                    status?: string
                    grade?: string | null
                    admin_feedback?: string | null
                    submitted_at?: string
                    reviewed_at?: string | null
                }
                Update: {
                    id?: string
                    assignment_id?: string
                    student_id?: string
                    content_text?: string | null
                    file_url?: string | null
                    link_url?: string | null
                    status?: string
                    grade?: string | null
                    admin_feedback?: string | null
                    submitted_at?: string
                    reviewed_at?: string | null
                }
            }
            lesson_progress: {
                Row: {
                    id: string
                    student_id: string
                    lesson_id: string
                    completed: boolean
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    student_id: string
                    lesson_id: string
                    completed?: boolean
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    student_id?: string
                    lesson_id?: string
                    completed?: boolean
                    completed_at?: string | null
                }
            }
        }
    }
}
