BEGIN;

-- First create the tasks table with proper constraints
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,  -- Added UNIQUE constraint here
    description TEXT,
    reward_amount DECIMAL(10,2) NOT NULL,
    number_of_orders INTEGER NOT NULL,
    open_state BOOLEAN DEFAULT TRUE,
    sorting INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on title for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_title ON public.tasks(title);

-- Insert sample data with conflict handling
INSERT INTO public.tasks (title, reward_amount, number_of_orders, open_state, sorting) VALUES
('Daily Login Bonus', 5.00, 1, true, 1),
('Complete First Order', 10.00, 1, true, 2),
('Weekly Shopping Challenge', 25.00, 5, true, 3),
('Monthly VIP Task', 50.00, 10, true, 4),
('Refer a Friend', 15.00, 1, true, 5),
('Product Review Task', 8.00, 3, true, 6),
('Social Media Share', 3.00, 1, false, 7),
('Premium Member Task', 100.00, 20, true, 8),
('Survey Completion', 12.00, 1, true, 9),
('Holiday Special Task', 30.00, 7, false, 10)
ON CONFLICT (title) DO NOTHING;

-- Enable Row Level Security if needed
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

COMMIT;