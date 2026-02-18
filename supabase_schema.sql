-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  initials TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  cohort_id UUID, -- FK added later
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COHORTS
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  start_date DATE,
  end_date DATE,
  max_students INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add Foreign Key to profiles
ALTER TABLE profiles 
ADD CONSTRAINT fk_profiles_cohort 
FOREIGN KEY (cohort_id) REFERENCES cohorts(id);

-- 3. MODULES
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. LESSONS
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'available', -- 'locked', 'available', 'completed' (managed via logic + progress)
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. LESSON MATERIALS
CREATE TABLE lesson_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT, -- 'pdf', 'link', 'doc', 'other'
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ASSIGNMENTS
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SUBMISSIONS
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_text TEXT,
  file_url TEXT,
  link_url TEXT,
  status TEXT DEFAULT 'submitted', -- 'submitted', 'reviewed', 'revision_requested'
  grade TEXT,
  admin_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 8. LESSON PROGRESS
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION get_user_cohort_id() RETURNS UUID AS $$
  SELECT cohort_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT (role = 'admin') FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies

-- PROFILES
CREATE POLICY "Profiles viewable by self or admin" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Profiles editable by self or admin" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

-- COHORTS
CREATE POLICY "Cohorts viewable by members or admin" ON cohorts
  FOR SELECT USING (id = get_user_cohort_id() OR is_admin());

CREATE POLICY "Cohorts managed by admin" ON cohorts
  FOR ALL USING (is_admin());

-- MODULES
CREATE POLICY "Modules viewable by cohort members or admin" ON modules
  FOR SELECT USING ((cohort_id = get_user_cohort_id() AND is_published = true) OR is_admin());

CREATE POLICY "Modules managed by admin" ON modules
  FOR ALL USING (is_admin());

-- LESSONS
CREATE POLICY "Lessons viewable by cohort members or admin" ON lessons
  FOR SELECT USING (
    (module_id IN (SELECT id FROM modules WHERE cohort_id = get_user_cohort_id() AND is_published = true) AND is_published = true)
    OR is_admin()
  );

CREATE POLICY "Lessons managed by admin" ON lessons
  FOR ALL USING (is_admin());

-- LESSON MATERIALS
CREATE POLICY "Materials viewable by cohort members or admin" ON lesson_materials
  FOR SELECT USING (
    (lesson_id IN (
      SELECT id FROM lessons 
      WHERE module_id IN (SELECT id FROM modules WHERE cohort_id = get_user_cohort_id())
    ))
    OR is_admin()
  );

CREATE POLICY "Materials managed by admin" ON lesson_materials
  FOR ALL USING (is_admin());

-- ASSIGNMENTS
CREATE POLICY "Assignments viewable by cohort members or admin" ON assignments
  FOR SELECT USING ((cohort_id = get_user_cohort_id() AND is_published = true) OR is_admin());

CREATE POLICY "Assignments managed by admin" ON assignments
  FOR ALL USING (is_admin());

-- SUBMISSIONS
CREATE POLICY "Submissions viewable by owner or admin" ON submissions
  FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Submissions creatable by students" ON submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Submissions updatable by admin" ON submissions
  FOR UPDATE USING (is_admin());

-- LESSON PROGRESS
CREATE POLICY "Progress viewable by owner or admin" ON lesson_progress
  FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Progress managed by owner or admin" ON lesson_progress
  FOR ALL USING (student_id = auth.uid() OR is_admin());

-- TRIGGERS

-- Handle new user creation (auto-create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, initials)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', 'U'), 1) ||
          LEFT(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), ' ', 2), 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STORAGE BUCKETS (You must create these manually in Supabase Dashboard -> Storage)
-- buckets: 'materials', 'submissions', 'avatars'
-- But we can add policies for them:

-- STORAGE POLICIES (Example for submissions)
-- CREATE POLICY "Submissions images are publicly accessible"
-- ON storage.objects FOR SELECT
-- USING ( bucket_id = 'submissions' );

-- CREATE POLICY "Anyone can upload an avatar"
-- ON storage.objects FOR INSERT
-- WITH CHECK ( bucket_id = 'submissions' );
