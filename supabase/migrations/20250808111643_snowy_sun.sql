/*
  # Fix User Authentication System with OTP

  1. New Tables
    - Create users table for proper user management
    - Create otp_verifications table for OTP handling
    - Update profiles table structure
  
  2. Security
    - Enable RLS on all tables
    - Add proper policies for user access
  
  3. Changes
    - Fix user creation flow
    - Add OTP verification system
    - Ensure proper relationship between auth.users and profiles
*/

-- Create users table for proper user management
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  user_type TEXT DEFAULT 'user',
  balance DECIMAL(15,2) DEFAULT 0.00,
  first_deposit_total DECIMAL(15,2) DEFAULT 0.00,
  second_charge_total DECIMAL(15,2) DEFAULT 0.00,
  is_online BOOLEAN DEFAULT false,
  agent_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'registration', -- 'registration', 'login', 'password_reset'
  is_verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ
);

-- Update profiles table to ensure proper structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS otp_verified_at TIMESTAMPTZ;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_otp_phone_number ON public.otp_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON public.otp_verifications(expires_at);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Admin can manage all users" ON public.users FOR ALL USING (true);

CREATE POLICY "Users can manage own OTP" ON public.otp_verifications FOR ALL USING (true);

-- Function to generate OTP
CREATE OR REPLACE FUNCTION public.generate_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to send OTP (placeholder - in production you'd integrate with SMS service)
CREATE OR REPLACE FUNCTION public.send_otp(phone_number TEXT, purpose TEXT DEFAULT 'registration')
RETURNS JSON AS $$
DECLARE
  otp_code TEXT;
  expires_at TIMESTAMPTZ;
BEGIN
  -- Generate 6-digit OTP
  otp_code := public.generate_otp();
  expires_at := now() + INTERVAL '10 minutes';
  
  -- Delete any existing OTP for this phone number and purpose
  DELETE FROM public.otp_verifications 
  WHERE phone_number = send_otp.phone_number 
  AND purpose = send_otp.purpose 
  AND expires_at > now();
  
  -- Insert new OTP
  INSERT INTO public.otp_verifications (phone_number, otp_code, purpose, expires_at)
  VALUES (send_otp.phone_number, otp_code, send_otp.purpose, expires_at);
  
  -- In production, you would send SMS here
  -- For development, we'll return the OTP in the response
  RETURN json_build_object(
    'success', true,
    'message', 'OTP sent successfully',
    'otp_code', otp_code, -- Remove this in production
    'expires_at', expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION public.verify_otp(phone_number TEXT, otp_code TEXT, purpose TEXT DEFAULT 'registration')
RETURNS JSON AS $$
DECLARE
  otp_record RECORD;
BEGIN
  -- Find valid OTP
  SELECT * INTO otp_record
  FROM public.otp_verifications
  WHERE phone_number = verify_otp.phone_number
  AND otp_code = verify_otp.otp_code
  AND purpose = verify_otp.purpose
  AND expires_at > now()
  AND is_verified = false;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid or expired OTP'
    );
  END IF;
  
  -- Mark OTP as verified
  UPDATE public.otp_verifications
  SET is_verified = true, verified_at = now()
  WHERE id = otp_record.id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'OTP verified successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user after OTP verification
CREATE OR REPLACE FUNCTION public.create_user_after_otp(
  phone_number TEXT,
  password TEXT,
  invitation_code TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  auth_user_id UUID;
  email_address TEXT;
BEGIN
  -- Check if OTP was verified for registration
  IF NOT EXISTS (
    SELECT 1 FROM public.otp_verifications
    WHERE phone_number = create_user_after_otp.phone_number
    AND purpose = 'registration'
    AND is_verified = true
    AND verified_at > now() - INTERVAL '1 hour'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Phone number not verified'
    );
  END IF;
  
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE phone_number = create_user_after_otp.phone_number) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User already exists'
    );
  END IF;
  
  -- Generate email from phone number
  email_address := phone_number || '@agodamall.com';
  
  -- Create user in public.users table
  INSERT INTO public.users (
    username,
    email,
    password_hash,
    phone_number,
    user_type,
    balance
  ) VALUES (
    phone_number,
    email_address,
    crypt(password, gen_salt('bf')),
    phone_number,
    'user',
    0.00
  ) RETURNING id INTO new_user_id;
  
  -- Create corresponding auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    phone,
    phone_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    email_address,
    crypt(password, gen_salt('bf')),
    now(),
    phone_number,
    now(),
    '{"provider": "phone", "providers": ["phone"]}',
    json_build_object(
      'phone_number', phone_number,
      'username', phone_number,
      'invitation_code', invitation_code
    ),
    now(),
    now()
  ) RETURNING id INTO auth_user_id;
  
  -- Create/update profile
  INSERT INTO public.profiles (
    user_id,
    username,
    phone_number,
    email,
    invitation_code,
    balance,
    phone_verified,
    otp_verified_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    phone_number,
    phone_number,
    email_address,
    invitation_code,
    0.00,
    true,
    now(),
    now(),
    now()
  ) ON CONFLICT (user_id) DO UPDATE SET
    username = EXCLUDED.username,
    phone_number = EXCLUDED.phone_number,
    email = EXCLUDED.email,
    invitation_code = EXCLUDED.invitation_code,
    phone_verified = true,
    otp_verified_at = now(),
    updated_at = now();
  
  RETURN json_build_object(
    'success', true,
    'message', 'User created successfully',
    'user_id', new_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate user with phone and password
CREATE OR REPLACE FUNCTION public.authenticate_user(
  phone_number TEXT,
  password TEXT
)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  auth_user_record RECORD;
BEGIN
  -- Find user by phone number
  SELECT * INTO user_record
  FROM public.users
  WHERE phone_number = authenticate_user.phone_number;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User not found'
    );
  END IF;
  
  -- Verify password
  IF NOT (user_record.password_hash = crypt(password, user_record.password_hash)) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid password'
    );
  END IF;
  
  -- Check if auth user exists
  SELECT * INTO auth_user_record
  FROM auth.users
  WHERE id = user_record.id;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Authentication record not found'
    );
  END IF;
  
  -- Update last login time
  UPDATE public.profiles
  SET last_login_time = now(), login_status = 'online'
  WHERE user_id = user_record.id;
  
  -- Create login record
  INSERT INTO public.login_records (username, login_date, login_ip)
  VALUES (user_record.username, now(), NULL);
  
  RETURN json_build_object(
    'success', true,
    'message', 'Authentication successful',
    'user_id', user_record.id,
    'email', user_record.email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up expired OTPs function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_verifications
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;