
-- Create bill_records table for Bill List page
CREATE TABLE public.bill_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'Commission for grabbing orders', 'Free Gift', 'Upgrade to VIP', etc.
  previous_amount NUMERIC NOT NULL DEFAULT 0,
  operation_amount NUMERIC NOT NULL DEFAULT 0,
  after_amount NUMERIC NOT NULL DEFAULT 0,
  instructions TEXT,
  user_side_operation_instructions TEXT,
  operation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create withdrawal_records table for Withdrawal List page
CREATE TABLE public.withdrawal_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  withdrawal_order_number TEXT NOT NULL UNIQUE,
  application_amount NUMERIC NOT NULL DEFAULT 0,
  amount_of_payment NUMERIC NOT NULL DEFAULT 0,
  balance NUMERIC NOT NULL DEFAULT 0,
  agent_review_status TEXT NOT NULL DEFAULT 'pending',
  state TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  withdrawal_account_info JSONB,
  withdrawal_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  update_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  operator TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recharge_records table for Recharge List page
CREATE TABLE public.recharge_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  merchant_order_number TEXT NOT NULL UNIQUE,
  payment_methods TEXT NOT NULL DEFAULT 'RECHARGE_JACKPOT',
  payment_information JSONB,
  recharge_amount NUMERIC NOT NULL DEFAULT 0,
  recharge_status TEXT NOT NULL DEFAULT 'Paid',
  recharge_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_records table for Payment List page
CREATE TABLE public.payment_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  payment_order_number TEXT NOT NULL UNIQUE,
  bank_account_number TEXT,
  real_name TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  user_type TEXT NOT NULL DEFAULT 'user',
  previous_amount NUMERIC NOT NULL DEFAULT 0,
  payment_amount NUMERIC NOT NULL DEFAULT 0,
  after_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT,
  submission_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  update_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_levels table for Level Management page
CREATE TABLE public.user_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER UNIQUE,
  icon_url TEXT,
  name TEXT NOT NULL,
  level_value INTEGER NOT NULL DEFAULT 888,
  withdrawal_restrictions TEXT,
  order_grabbing_restrictions TEXT,
  upgrade_price NUMERIC NOT NULL DEFAULT 20.00,
  purchase_balance_limit TEXT,
  sorting INTEGER NOT NULL DEFAULT 100,
  display_status BOOLEAN NOT NULL DEFAULT true,
  open_state BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create danger_value_records table for Danger Value Record page
CREATE TABLE public.danger_value_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  username TEXT NOT NULL,
  type TEXT NOT NULL,
  value_at_risk INTEGER NOT NULL DEFAULT 100,
  instructions TEXT,
  operation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create login_records table for Login List page
CREATE TABLE public.login_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  username TEXT NOT NULL,
  login_ip TEXT,
  login_address TEXT,
  login_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create navy_addresses table for Navy Address page
CREATE TABLE public.navy_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consignee TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  nation TEXT NOT NULL DEFAULT 'Is',
  postal_code TEXT,
  province_city_county TEXT,
  detailed_address TEXT,
  user_type TEXT NOT NULL DEFAULT 'user',
  is_internal BOOLEAN NOT NULL DEFAULT true,
  creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bill_records_user_id ON public.bill_records(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_records_user_id ON public.withdrawal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_recharge_records_user_id ON public.recharge_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_user_id ON public.payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_danger_value_records_username ON public.danger_value_records(username);
CREATE INDEX IF NOT EXISTS idx_login_records_username ON public.login_records(username);

-- Enable RLS on all new tables
ALTER TABLE public.bill_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recharge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.danger_value_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navy_addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can manage all bill records" ON public.bill_records FOR ALL USING (true);
CREATE POLICY "Admin can manage all withdrawal records" ON public.withdrawal_records FOR ALL USING (true);
CREATE POLICY "Admin can manage all recharge records" ON public.recharge_records FOR ALL USING (true);
CREATE POLICY "Admin can manage all payment records" ON public.payment_records FOR ALL USING (true);
CREATE POLICY "Admin can manage all user levels" ON public.user_levels FOR ALL USING (true);
CREATE POLICY "Admin can manage all danger value records" ON public.danger_value_records FOR ALL USING (true);
CREATE POLICY "Admin can manage all login records" ON public.login_records FOR ALL USING (true);
CREATE POLICY "Admin can manage all navy addresses" ON public.navy_addresses FOR ALL USING (true);

-- Insert sample data for user_levels
INSERT INTO public.user_levels (serial_number, name, level_value, withdrawal_restrictions, order_grabbing_restrictions, upgrade_price, purchase_balance_limit) VALUES
(69, '888', 888, 'Number of withdrawals: 3 times/day\nFree withdrawal times: 3 times/day\nExcess withdrawal fee: undefined%\nMinimum withdrawal amount: $0\nMaximum withdrawal amount: $9999999\nNumber of withdrawal orders: 1 time/day', 'Balance limit: $0.00\nNumber of times per day: 1 time\nCommission rate: 8%\nCommission ratio when the superior level is insufficient: %\nCredit score limit: 60 points', 20.00, '$20.00 - $0.00');
