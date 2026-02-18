-- Create 'materials' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public read access to everyone (so students can download)
-- OR restrict to authenticated users if you prefer privacy. 
-- For now, consistent with other buckets, let's allow authenticated read.

CREATE POLICY "Materials are viewable by everyone" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'materials' );

-- Policy: Allow authenticated users (Admins/Instructors) to upload
-- Ideally restricted to admins, but for simplicity in this prototype:
CREATE POLICY "Authenticated users can upload materials" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'materials' AND auth.role() = 'authenticated' );

-- Policy: Allow admins/owners to update/delete (optional for now, mainly Insert is needed)
