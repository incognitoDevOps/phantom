BEGIN;

-- 1. First create the financial_orders table
CREATE TABLE IF NOT EXISTS public.financial_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  product_name TEXT,
  purchase_amount NUMERIC NOT NULL DEFAULT 0,
  daily_income NUMERIC NOT NULL DEFAULT 0,
  current_income NUMERIC NOT NULL DEFAULT 0,
  fees NUMERIC NOT NULL DEFAULT 0,
  valid_days INTEGER NOT NULL DEFAULT 0,
  revenue_time INTEGER NOT NULL DEFAULT 0,
  return_principal_and_interest NUMERIC NOT NULL DEFAULT 0,
  order_status TEXT NOT NULL DEFAULT 'active',
  buy_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create wheel_draw_records if it doesn't exist (empty table)
CREATE TABLE IF NOT EXISTS public.wheel_draw_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Now add columns to wheel_draw_records
ALTER TABLE public.wheel_draw_records 
ADD COLUMN IF NOT EXISTS winning_info TEXT,
ADD COLUMN IF NOT EXISTS activity_id UUID;

-- 4. Create coupon_records if it doesn't exist (empty table)
CREATE TABLE IF NOT EXISTS public.coupon_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Add columns to coupon_records
ALTER TABLE public.coupon_records
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS special_offers TEXT,
ADD COLUMN IF NOT EXISTS distribution_time TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS update_time TIMESTAMPTZ DEFAULT now();

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_financial_orders_user_id ON public.financial_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_orders_status ON public.financial_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_wheel_draw_records_user_id ON public.wheel_draw_records(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_records_user_id ON public.coupon_records(user_id);

-- 7. Enable RLS
ALTER TABLE public.financial_orders ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policy
CREATE POLICY "Admin can manage all financial orders" 
  ON public.financial_orders 
  FOR ALL 
  USING (true);

COMMIT;