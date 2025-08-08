BEGIN;

-- 1. First ensure the auth schema exists (just in case)
CREATE SCHEMA IF NOT EXISTS auth;

-- 2. Create test user with phone authentication
DO $$
BEGIN
  -- Delete existing test user if present
  DELETE FROM auth.users WHERE phone = '138000000000';
  
  -- Insert new user with phone auth
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    phone,
    encrypted_password,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    '138000000000',
    crypt('123456', gen_salt('bf')),
    '{"provider": "phone", "providers": ["phone"]}',
    '{"username": "138000000000", "invitation_code": "888888"}',
    now(),
    now()
  );
END $$;

-- 3. Create corresponding profile if needed
INSERT INTO public.profiles (user_id, username, phone_number)
SELECT 
  id, 
  raw_user_meta_data->>'username', 
  phone
FROM auth.users 
WHERE phone = '138000000000'
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  phone_number = EXCLUDED.phone_number;

COMMIT;