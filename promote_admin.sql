-- Promote user to Admin by email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'brandoncandia.labora@gmail.com';

-- Verify the change
SELECT * FROM public.profiles WHERE email = 'brandoncandia.labora@gmail.com';
