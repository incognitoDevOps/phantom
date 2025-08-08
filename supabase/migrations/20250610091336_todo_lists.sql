
-- Create a table for to-do lists
CREATE TABLE public.todo_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  withdrawal_order_number TEXT,
  name TEXT,
  phone_number TEXT,
  user_type TEXT DEFAULT 'user',
  withdrawal_account_info TEXT,
  application_amount DECIMAL(10,2) DEFAULT 0,
  amount_of_payment DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0,
  agent_review_status TEXT DEFAULT 'pending',
  withdrawal_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  operator TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add some sample data
INSERT INTO public.todo_lists (
  user_id, username, withdrawal_order_number, name, phone_number, 
  user_type, withdrawal_account_info, application_amount, 
  amount_of_payment, balance, agent_review_status, operator
) VALUES 
('1', 'user001', 'WD001', 'John Doe', '1234567890', 'user', 'Bank Account: 123456', 1000.00, 950.00, 5000.00, 'pending', 'admin1'),
('2', 'user002', 'WD002', 'Jane Smith', '0987654321', 'vip', 'PayPal: jane@email.com', 2000.00, 1900.00, 8000.00, 'approved', 'admin2'),
('3', 'user003', 'WD003', 'Bob Wilson', '5555555555', 'user', 'Bank Account: 789012', 500.00, 475.00, 2500.00, 'rejected', 'admin1');
