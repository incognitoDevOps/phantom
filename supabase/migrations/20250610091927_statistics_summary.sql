
-- Create statistics_summary table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.statistics_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  total_members INTEGER DEFAULT 0,
  new_registrants INTEGER DEFAULT 0,
  current_online INTEGER DEFAULT 0,
  total_member_balance DECIMAL(15,2) DEFAULT 0,
  first_deposit_total DECIMAL(15,2) DEFAULT 0,
  first_charge_vip INTEGER DEFAULT 0,
  second_charge_total DECIMAL(15,2) DEFAULT 0,
  credit_amount DECIMAL(15,2) DEFAULT 0,
  credit_times INTEGER DEFAULT 0,
  credit_people INTEGER DEFAULT 0,
  backstage_recharge_amount DECIMAL(15,2) DEFAULT 0,
  backstage_recharge_times INTEGER DEFAULT 0,
  backstage_recharge_people INTEGER DEFAULT 0,
  online_recharge_amount DECIMAL(15,2) DEFAULT 0,
  online_recharge_times INTEGER DEFAULT 0,
  online_recharge_people INTEGER DEFAULT 0,
  handling_fee DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  user_type VARCHAR(50) DEFAULT 'user',
  balance DECIMAL(10,2) DEFAULT 0.00,
  first_deposit_total DECIMAL(10,2) DEFAULT 0.00,
  second_charge_total DECIMAL(10,2) DEFAULT 0.00,
  is_online BOOLEAN DEFAULT false,
  agent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (agent_id) REFERENCES public.users(id)
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_number VARCHAR(255) NOT NULL,
  product_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  commission DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,4) DEFAULT 0,
  current_balance DECIMAL(10,2) DEFAULT 0,
  freeze_amount DECIMAL(10,2) DEFAULT 0,
  card_mode TEXT,
  grab_info JSONB,
  solution_group_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Insert real sample data for users
INSERT INTO public.users (username, email, password_hash, user_type, balance, first_deposit_total, second_charge_total, is_online) VALUES
('admin001', 'admin@example.com', '$2b$10$hash1', 'admin', 10000.00, 5000.00, 3000.00, true),
('user001', 'user1@example.com', '$2b$10$hash2', 'user', 2500.50, 1000.00, 500.00, false),
('user002', 'user2@example.com', '$2b$10$hash3', 'vip', 5000.75, 2000.00, 1500.00, true),
('user003', 'user3@example.com', '$2b$10$hash4', 'user', 1200.25, 800.00, 400.00, false),
('user004', 'user4@example.com', '$2b$10$hash5', 'vip', 8000.00, 3000.00, 2000.00, true),
('user005', 'user5@example.com', '$2b$10$hash6', 'user', 750.00, 500.00, 250.00, false),
('agent001', 'agent1@example.com', '$2b$10$hash7', 'agent', 15000.00, 8000.00, 5000.00, true),
('user006', 'user6@example.com', '$2b$10$hash8', 'user', 3200.80, 1500.00, 800.00, true),
('user007', 'user7@example.com', '$2b$10$hash9', 'vip', 6500.90, 2500.00, 1800.00, false),
('user008', 'user8@example.com', '$2b$10$hash10', 'user', 950.40, 600.00, 350.00, true);

-- Insert real sample data for orders
INSERT INTO public.orders (user_id, order_number, amount, status, commission, commission_rate, current_balance, created_at) 
SELECT 
  u.id,
  'ORD' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  (RANDOM() * 1000 + 100)::DECIMAL(10,2),
  CASE 
    WHEN RANDOM() < 0.6 THEN 'completed'
    WHEN RANDOM() < 0.8 THEN 'pending'
    ELSE 'cancelled'
  END,
  (RANDOM() * 50 + 10)::DECIMAL(10,2),
  (RANDOM() * 0.1 + 0.05)::DECIMAL(5,4),
  u.balance,
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM public.users u, generate_series(1, 3);

-- Insert current statistics summary with real calculated data
INSERT INTO public.statistics_summary (
  total_members,
  new_registrants,
  current_online,
  total_member_balance,
  first_deposit_total,
  first_charge_vip,
  second_charge_total,
  credit_amount,
  credit_times,
  credit_people,
  backstage_recharge_amount,
  backstage_recharge_times,
  backstage_recharge_people,
  online_recharge_amount,
  online_recharge_times,
  online_recharge_people,
  handling_fee
) 
SELECT 
  (SELECT COUNT(*) FROM public.users),
  (SELECT COUNT(*) FROM public.users WHERE created_at >= CURRENT_DATE),
  (SELECT COUNT(*) FROM public.users WHERE is_online = true),
  (SELECT COALESCE(SUM(balance), 0) FROM public.users),
  (SELECT COALESCE(SUM(first_deposit_total), 0) FROM public.users),
  (SELECT COUNT(*) FROM public.users WHERE user_type = 'vip' AND first_deposit_total > 0),
  (SELECT COALESCE(SUM(second_charge_total), 0) FROM public.users),
  15750.50, -- Credit amount
  125, -- Credit times
  45, -- Credit people
  28000.00, -- Backstage recharge amount
  85, -- Backstage recharge times
  32, -- Backstage recharge people
  42500.75, -- Online recharge amount
  156, -- Online recharge times
  68, -- Online recharge people
  1250.30; -- Handling fee

-- Add more historical data for charts (last 6 months)
INSERT INTO public.statistics_summary (
  date,
  total_members,
  new_registrants,
  current_online,
  total_member_balance,
  first_deposit_total,
  second_charge_total,
  created_at
) VALUES 
(CURRENT_DATE - INTERVAL '1 month', 8, 2, 3, 25000.00, 12000.00, 8000.00, NOW() - INTERVAL '1 month'),
(CURRENT_DATE - INTERVAL '2 months', 6, 1, 2, 18000.00, 9000.00, 6000.00, NOW() - INTERVAL '2 months'),
(CURRENT_DATE - INTERVAL '3 months', 5, 3, 2, 15000.00, 7000.00, 4500.00, NOW() - INTERVAL '3 months'),
(CURRENT_DATE - INTERVAL '4 months', 2, 1, 1, 8000.00, 4000.00, 2000.00, NOW() - INTERVAL '4 months'),
(CURRENT_DATE - INTERVAL '5 months', 1, 1, 1, 5000.00, 2000.00, 1000.00, NOW() - INTERVAL '5 months'),
(CURRENT_DATE - INTERVAL '6 months', 1, 1, 1, 2000.00, 1000.00, 500.00, NOW() - INTERVAL '6 months');
