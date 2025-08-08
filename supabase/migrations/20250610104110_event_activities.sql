
-- Create event_activities table for Event Management
CREATE TABLE public.event_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  title TEXT NOT NULL,
  introduction TEXT,
  picture TEXT,
  link_address TEXT,
  sorting INTEGER NOT NULL DEFAULT 0,
  open_state BOOLEAN NOT NULL DEFAULT true,
  creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_merchants table for Payment Management
CREATE TABLE public.payment_merchants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_code TEXT NOT NULL UNIQUE,
  merchant_name TEXT NOT NULL,
  merchant_account TEXT,
  merchant_number TEXT,
  payment_merchant_number TEXT,
  api_interface_address TEXT,
  backend_address TEXT,
  open_state BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_channels table for Channel Management
CREATE TABLE public.payment_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  payment_channels TEXT,
  payment_methods TEXT,
  exchange_rate NUMERIC NOT NULL DEFAULT 1,
  rate_percentage NUMERIC NOT NULL DEFAULT 0,
  minimum_payment_amount NUMERIC NOT NULL DEFAULT 0,
  maximum_payment_amount NUMERIC NOT NULL DEFAULT 0,
  payment_amount_options TEXT,
  sorting INTEGER NOT NULL DEFAULT 100,
  default_display_payment_amount NUMERIC NOT NULL DEFAULT 100,
  can_only_integers_be_entered BOOLEAN NOT NULL DEFAULT true,
  open_state BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout_channels table for Payment Channel Management
CREATE TABLE public.payout_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  payment_methods TEXT,
  payment_channel_account TEXT,
  rate_percentage NUMERIC NOT NULL DEFAULT 0,
  exchange_rate NUMERIC NOT NULL DEFAULT 1,
  minimum_payment_amount NUMERIC NOT NULL DEFAULT 100,
  maximum_payment_amount NUMERIC NOT NULL DEFAULT 500000,
  payment_amount_options TEXT,
  sorting INTEGER NOT NULL DEFAULT 100,
  default_display_payment_amount NUMERIC NOT NULL DEFAULT 100,
  open_state BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roles table for Role Management
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  role_name TEXT NOT NULL,
  open_state BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create administrators table for Administrator List
CREATE TABLE public.administrators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  login_name TEXT NOT NULL UNIQUE,
  nick_name TEXT,
  phone_number TEXT,
  role TEXT NOT NULL DEFAULT 'UU Group',
  state TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.event_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allowing all operations for now)
CREATE POLICY "Allow all operations on event_activities" ON public.event_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations on payment_merchants" ON public.payment_merchants FOR ALL USING (true);
CREATE POLICY "Allow all operations on payment_channels" ON public.payment_channels FOR ALL USING (true);
CREATE POLICY "Allow all operations on payout_channels" ON public.payout_channels FOR ALL USING (true);
CREATE POLICY "Allow all operations on roles" ON public.roles FOR ALL USING (true);
CREATE POLICY "Allow all operations on administrators" ON public.administrators FOR ALL USING (true);

-- Insert sample data for Event Activities
INSERT INTO public.event_activities (serial_number, title, introduction, picture, sorting, open_state) VALUES
(1, 'Recharge Activities', 'Special recharge promotion event', 'https://example.com/image.jpg', 100, true);

-- Insert sample data for Payment Merchants
INSERT INTO public.payment_merchants (merchant_code, merchant_name, merchant_account, api_interface_address, open_state) VALUES
('SYSTEMPAY', 'System offline payment', 'SYS001', 'https://api.systempay.com', true),
('TGPNEWPAY_TGPNEWPAY', 'TGPNEWPAY payment', 'A51_test', 'https://api-india.deshengpay.vip/gateway/pay', true);

-- Insert sample data for Payment Channels
INSERT INTO public.payment_channels (merchant_name, channel_name, payment_channels, payment_methods, minimum_payment_amount, maximum_payment_amount, sorting, default_display_payment_amount, open_state) VALUES
('TGPNEWPAY payment', 'BANK TGPNE', 'NOTHING', 'NOTHING', 10.00, 100000.00, 100, 100, true),
('System offline payment', 'USDT TRC20', 'USDT_TRC20', 'USDT_TRC20', 100.00, 20000.00, 100, 100, true),
('System offline payment', 'BANK CARD 2', 'BANK_2', 'BANK_2', 100.00, 20000.00, 100, 100, true),
('System offline payment', 'USDT erc20', 'USDT_ERC20', 'USDT_ERC20', 100.00, 20000.00, 100, 100, true),
('System offline payment', 'BANK CARD 1', 'BANK_1', 'BANK_1', 100.00, 20000.00, 100, 100, false);

-- Insert sample data for Payout Channels
INSERT INTO public.payout_channels (merchant_name, channel_name, payment_methods, minimum_payment_amount, maximum_payment_amount, sorting, default_display_payment_amount, open_state) VALUES
('System offline payment', 'Offline payment real card 2', 'BANK', 100.00, 500000.00, 100, 100, false),
('System offline payment', 'Offline payment real card 1', 'BANK', 100.00, 500000.00, 100, 100, false);

-- Insert sample data for Roles
INSERT INTO public.roles (serial_number, role_name, open_state) VALUES
(2, 'UU Group', true),
(1, 'System Super Administrator', true);

-- Insert sample data for Administrators
INSERT INTO public.administrators (serial_number, login_name, nick_name, role, state) VALUES
(1, 'UU88888', 'UU', 'UU Group', 'open'),
(2, 'admin', 'fdsafsaf', 'System Super Administrator', 'open');
