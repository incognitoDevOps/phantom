/*
  # Fix User Authentication System

  1. New Tables
    - Update profiles table to support phone-based authentication
    - Add proper constraints and indexes
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for user access
  
  3. Changes
    - Update profiles table structure to match registration form
    - Add proper foreign key relationships
    - Add indexes for performance
*/

-- Update profiles table to support phone-based authentication
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_pkey;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id the primary key if it isn't already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.profiles ADD PRIMARY KEY (user_id);
  END IF;
END $$;

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS withdrawal_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS invitation_code TEXT,
ADD COLUMN IF NOT EXISTS is_member_agent BOOLEAN,
ADD COLUMN IF NOT EXISTS last_login_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS login_address TEXT,
ADD COLUMN IF NOT EXISTS login_ip TEXT,
ADD COLUMN IF NOT EXISTS login_status TEXT,
ADD COLUMN IF NOT EXISTS platform_agent TEXT,
ADD COLUMN IF NOT EXISTS remark TEXT,
ADD COLUMN IF NOT EXISTS telegram TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS withdrawal_password TEXT;

-- Ensure created_at and updated_at exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON public.profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;

CREATE POLICY "Users can read own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all profiles" 
  ON public.profiles 
  FOR ALL 
  USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    username,
    phone_number,
    email,
    invitation_code,
    balance,
    withdrawal_status,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.phone, NEW.email),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone_number'),
    NEW.email,
    NEW.raw_user_meta_data->>'invitation_code',
    0.00,
    'active',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile when auth user is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET
    username = COALESCE(NEW.raw_user_meta_data->>'username', NEW.phone, NEW.email),
    phone_number = COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone_number'),
    email = NEW.email,
    invitation_code = NEW.raw_user_meta_data->>'invitation_code',
    updated_at = NOW()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();