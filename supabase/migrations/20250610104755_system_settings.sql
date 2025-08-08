
-- Create system_settings table for storing all system configurations
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text', -- text, number, boolean, textarea, url, file
  category TEXT NOT NULL DEFAULT 'general',
  display_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dictionary_items table for dictionary management
CREATE TABLE public.dictionary_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dictionary_key TEXT NOT NULL,
  dictionary_value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  display_name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations on system_settings" ON public.system_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on dictionary_items" ON public.dictionary_items FOR ALL USING (true);

-- Insert sample system settings data
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, display_name, description, sort_order) VALUES
-- Site-related settings
('system_version_number', '0', 'text', 'site_settings', 'System version number', 'Current system version', 1),
('system_operating_country_code', 'USDT', 'text', 'site_settings', 'System operating country code', 'Country code for system operation', 2),
('system_operating_country_currency', 'USDT', 'text', 'site_settings', 'System operating country currency', 'Currency used in the system', 3),
('currency_decimal_places', '2', 'number', 'site_settings', 'Number of decimal places of currency', 'Decimal places for currency display', 4),
('platform_name', '抢单-演示站', 'text', 'site_settings', 'Platform Name', 'Name of the platform', 5),
('system_language', 'tr-TR', 'text', 'site_settings', 'System language', 'Default system language', 6),
('system_language_switch', 'true', 'boolean', 'site_settings', 'System language switch', 'Enable language switching', 7),

-- Security settings
('backend_login_ip_whitelist', '', 'textarea', 'security', 'Backend login IP whitelist', 'IP addresses allowed for backend login', 10),
('frontend_login_ip_whitelist', '', 'textarea', 'security', 'Front-end login IP whitelist', 'IP addresses allowed for frontend login', 11),
('proxy_login_ip_whitelist', '', 'textarea', 'security', 'Proxy login IP whitelist', 'IP addresses allowed for proxy login', 12),
('prohibit_domestic_ip', '0', 'boolean', 'security', 'Prohibit domestic IP login', 'Block domestic IP addresses', 13),

-- System URLs
('frontend_domain', 'http://182.16.36.178:8004', 'url', 'urls', 'Front-end domain name address', 'Main frontend URL', 20),
('file_server_address', 'http://182.16.36.178:8004/api/', 'url', 'urls', 'File server address', 'File server endpoint', 21),
('member_agent_promotion_domain', '', 'url', 'urls', 'Member agent promotion domain name', 'Domain for agent promotion', 22),

-- Date/Time formats
('datetime_format', 'yyyy-MM-dd HH:mm:ss', 'text', 'formats', 'System year-month-day-hour-minute-second format', 'DateTime format pattern', 30),
('date_format', 'yyyy-MM-dd', 'text', 'formats', 'System year, month, and day format', 'Date format pattern', 31),
('time_format', 'HH:mm:ss', 'text', 'formats', 'System hour, minute, and second format', 'Time format pattern', 32),

-- System announcements
('system_announcement', '系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告系统公告', 'textarea', 'announcements', 'System Announcement', 'Main system announcement text', 40),
('system_announcement_article_id', '5', 'text', 'announcements', 'System announcement article id', 'Article ID for system announcement', 41),

-- App settings
('app_download_switch', 'true', 'boolean', 'app_settings', 'APP download switch', 'Enable app download functionality', 50),
('android_download_url', 'http://182.16.36.178:8004/m/app', 'url', 'app_settings', 'Android app download address', 'Android app download URL', 51),
('app_download_page', 'http://52.128.231.154:8004/m/app', 'url', 'app_settings', 'APP download page address', 'App download page URL', 52),
('ios_download_url', 'http://182.16.36.178:8004/m/app', 'url', 'app_settings', 'iOS Download Link', 'iOS app download URL', 53),
('app_download_timeout', '5', 'number', 'app_settings', 'APP download button auto-hide seconds', 'Seconds before download button disappears', 54),

-- User settings
('user_level_switch', 'true', 'boolean', 'user_settings', 'User level switch', 'Enable user level system', 60),
('auto_calculate_tier', 'false', 'boolean', 'user_settings', 'Automatically calculate tier based on balance', 'Auto-calculate user tier from balance', 61),
('force_login_switch', 'false', 'boolean', 'user_settings', 'Force login switch', 'Force users to login before access', 62),
('vip_purchase_balance_limit', 'false', 'boolean', 'user_settings', 'VIP purchase balance limit switch', 'Check balance before VIP purchase', 63),

-- System configuration
('system_capital_ratio', '1', 'number', 'system_config', 'System capital ratio', 'Capital ratio for the system', 70),
('currency_symbol', '$', 'text', 'system_config', 'Currency Symbol', 'Symbol used for currency', 71),
('usd_exchange_rate', '1', 'number', 'system_config', 'US dollar exchange rate', 'USD to platform currency rate', 72),
('customer_service_hotline', '400-xxx-xxxx', 'text', 'system_config', 'Customer Service Hotline', 'Customer service phone number', 73),
('google_key', '6A6AUJJYQFLMGWDH', 'text', 'system_config', 'Google Key', 'Google authentication key', 74);

-- Insert sample dictionary items
INSERT INTO public.dictionary_items (dictionary_key, dictionary_value, category, display_name, description, sort_order) VALUES
('user_status', 'active', 'user_management', 'Active', 'User is active and can login', 1),
('user_status', 'inactive', 'user_management', 'Inactive', 'User is inactive and cannot login', 2),
('user_status', 'suspended', 'user_management', 'Suspended', 'User account is suspended', 3),
('user_status', 'banned', 'user_management', 'Banned', 'User account is banned', 4),

('order_status', 'pending', 'order_management', 'Pending', 'Order is pending processing', 1),
('order_status', 'processing', 'order_management', 'Processing', 'Order is being processed', 2),
('order_status', 'completed', 'order_management', 'Completed', 'Order has been completed', 3),
('order_status', 'cancelled', 'order_management', 'Cancelled', 'Order has been cancelled', 4),
('order_status', 'failed', 'order_management', 'Failed', 'Order processing failed', 5),

('payment_method', 'bank_card', 'payment', 'Bank Card', 'Payment via bank card', 1),
('payment_method', 'usdt_trc20', 'payment', 'USDT TRC20', 'Payment via USDT TRC20', 2),
('payment_method', 'usdt_erc20', 'payment', 'USDT ERC20', 'Payment via USDT ERC20', 3),
('payment_method', 'alipay', 'payment', 'Alipay', 'Payment via Alipay', 4),
('payment_method', 'wechat', 'payment', 'WeChat Pay', 'Payment via WeChat', 5),

('user_level', 'bronze', 'user_levels', 'Bronze', 'Bronze level user', 1),
('user_level', 'silver', 'user_levels', 'Silver', 'Silver level user', 2),
('user_level', 'gold', 'user_levels', 'Gold', 'Gold level user', 3),
('user_level', 'platinum', 'user_levels', 'Platinum', 'Platinum level user', 4),
('user_level', 'diamond', 'user_levels', 'Diamond', 'Diamond level user', 5),

('language', 'en-US', 'system', 'English (US)', 'English United States', 1),
('language', 'zh-CN', 'system', '中文 (简体)', 'Chinese Simplified', 2),
('language', 'zh-TW', 'system', '中文 (繁體)', 'Chinese Traditional', 3),
('language', 'tr-TR', 'system', 'Türkçe', 'Turkish', 4),
('language', 'ja-JP', 'system', '日本語', 'Japanese', 5),
('language', 'ko-KR', 'system', '한국어', 'Korean', 6);
