
-- Ensure solution_groups table exists with proper structure
CREATE TABLE IF NOT EXISTS public.solution_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER UNIQUE,
  name TEXT NOT NULL,
  agent_name TEXT,
  number_of_orders INTEGER DEFAULT 0,
  program_plan TEXT,
  associated_users INTEGER DEFAULT 0,
  open_state BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  is_team_mode BOOLEAN DEFAULT false,
  share DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert real sample data for solution groups
INSERT INTO public.solution_groups (serial_number, name, agent_name, number_of_orders, program_plan, associated_users, open_state, is_default, is_team_mode, share) VALUES
(14, 'Second order', NULL, 1, 'Basic Plan', 25, true, false, false, 15.5),
(13, 'First order', NULL, 1, 'Premium Plan', 30, true, false, true, 20.0),
(11, 'Task 1', '888888', 1, 'Standard Plan', 45, true, false, false, 12.75),
(10, '123', '888888', 60, 'Enterprise Plan', 120, true, true, true, 25.0),
(8, 'test', NULL, 20, 'Basic Plan', 35, true, false, true, 10.5),
(12, 'Task 1', NULL, 1, 'Premium Plan', 18, false, false, false, 8.25),
(9, 'Advanced Group', '888888', 3, 'Advanced Plan', 50, false, false, false, 18.75);

-- Create trigger to auto-increment serial_number if not provided
CREATE OR REPLACE FUNCTION public.set_serial_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM public.solution_groups;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_serial_number
  BEFORE INSERT ON public.solution_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.set_serial_number();
