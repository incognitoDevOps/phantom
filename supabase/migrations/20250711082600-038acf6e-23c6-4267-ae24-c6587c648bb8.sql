-- Confirm the test user's email so they can log in
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = '138000000000@agodamall.com' AND email_confirmed_at IS NULL;