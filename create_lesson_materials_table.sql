-- Create lesson_materials table if it doesn't exist
CREATE TABLE IF NOT EXISTS lesson_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT, -- 'pdf', 'link', 'doc', 'other'
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_materials' AND policyname = 'Materials viewable by cohort members or admin') THEN
        CREATE POLICY "Materials viewable by cohort members or admin" ON lesson_materials
          FOR SELECT USING (
            (lesson_id IN (
              SELECT id FROM lessons 
              WHERE module_id IN (SELECT id FROM modules WHERE cohort_id = get_user_cohort_id())
            ))
            OR is_admin()
          );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_materials' AND policyname = 'Materials managed by admin') THEN
        CREATE POLICY "Materials managed by admin" ON lesson_materials
          FOR ALL USING (is_admin());
    END IF;
END $$;
