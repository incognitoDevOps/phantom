
-- Create agents table for Agent Management page
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id INTEGER UNIQUE,
  login_name TEXT NOT NULL,
  promotional_code TEXT,
  superior_agent TEXT,
  affiliate_links TEXT,
  nick_name TEXT,
  phone_number TEXT,
  is_agent_administrator BOOLEAN DEFAULT false,
  state TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_service table for Customer Service List page
CREATE TABLE public.customer_service (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  phone_number TEXT,
  service_account TEXT,
  service_link TEXT,
  service_hours TEXT DEFAULT '09:00 - 22:00',
  open_state BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON public.agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_state ON public.agents(state);
CREATE INDEX IF NOT EXISTS idx_customer_service_open_state ON public.customer_service(open_state);
CREATE INDEX IF NOT EXISTS idx_customer_service_service_type ON public.customer_service(service_type);

-- Enable RLS on new tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_service ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can manage all agents" ON public.agents FOR ALL USING (true);
CREATE POLICY "Admin can manage all customer service" ON public.customer_service FOR ALL USING (true);

-- Insert sample data for agents
INSERT INTO public.agents (agent_id, login_name, promotional_code, superior_agent, affiliate_links, nick_name, phone_number, is_agent_administrator, state) VALUES
(5, 'qw123123', '851720', '888888', 'http://182.16.36.178:8004/mlregister?codeNumber=851720', '123123', NULL, false, 'open'),
(3, 'kg001', '222222', NULL, 'https://54654.ml/register?codeNumber=222222', 'kg001', NULL, true, 'open'),
(1, '888888', '888888', NULL, 'http://182.16.36.178:8004/mlregister?codeNumber=888888', 'Agent 1', NULL, true, 'open'),
(2, '123123', '878190', '888888', 'http://182.16.36.178:8004/mlregister?codeNumber=878190', '123123', NULL, true, 'open');

-- Insert sample data for customer service
INSERT INTO public.customer_service (service_name, service_type, phone_number, service_account, service_link, service_hours, open_state) VALUES
('Online', 'Online Chat', NULL, NULL, 'http://www.baidu.com', '09:00 - 22:00', true),
('Telegram', 'Telegram', '11111111', NULL, 'https://baidu.com', '09:00 - 22:00', true);
