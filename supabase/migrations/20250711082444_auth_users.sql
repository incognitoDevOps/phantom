BEGIN;

-- 1. First ensure the profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create test user with proper handling of auth schema
DO $$
BEGIN
  -- Check if user exists first
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '138000000000@agodamall.com') THEN
    -- Insert new user without specifying generated columns
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      '138000000000@agodamall.com',
      crypt('123456', gen_salt('bf')),
      '{"provider": "email", "providers": ["email"]}',
      '{"phone_number": "138000000000", "username": "138000000000", "invitation_code": "888888"}'
    );
  ELSE
    -- Update existing user without touching generated columns
    UPDATE auth.users SET
      encrypted_password = crypt('123456', gen_salt('bf')),
      raw_user_meta_data = '{"phone_number": "138000000000", "username": "138000000000", "invitation_code": "888888"}'
    WHERE email = '138000000000@agodamall.com';
  END IF;
END $$;

-- 3. Create/update profile entry
INSERT INTO public.profiles (user_id, username, phone_number)
SELECT 
  id, 
  raw_user_meta_data->>'username', 
  raw_user_meta_data->>'phone_number'
FROM auth.users 
WHERE email = '138000000000@agodamall.com'
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  phone_number = EXCLUDED.phone_number;

-- 4. Enable RLS on profiles if needed
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

COMMIT;