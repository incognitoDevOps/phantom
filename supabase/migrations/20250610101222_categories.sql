
-- Create categories table for Category List page
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL,
  classification_number INTEGER UNIQUE,
  open_state BOOLEAN NOT NULL DEFAULT true,
  creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table for Article Management page
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER UNIQUE,
  picture TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  introduction TEXT,
  content TEXT,
  link_address TEXT,
  sorting INTEGER NOT NULL DEFAULT 0,
  open_state BOOLEAN NOT NULL DEFAULT true,
  release_time TIMESTAMP WITH TIME ZONE,
  confirm_button_name TEXT,
  confirm_button_path TEXT,
  creation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  operate TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_open_state ON public.articles(open_state);
CREATE INDEX IF NOT EXISTS idx_categories_open_state ON public.categories(open_state);

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can manage all categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin can manage all articles" ON public.articles FOR ALL USING (true);

-- Insert sample data for categories
INSERT INTO public.categories (category_name, classification_number, open_state) VALUES
('FAQ', 1, true),
('News', 2, true),
('Tutorial', 3, true),
('System Articles', 4, true),
('Activity', 5, true),
('System Announcement', 6, true);

-- Insert sample data for articles
INSERT INTO public.articles (serial_number, title, category, introduction, content, sorting, open_state, creation_time) VALUES
(5, 'System Announcement', 'System Announcement', 'system notification', 'Important system announcements and updates for all users', 0, true, '2021-08-09 02:32:31'),
(1, 'Company Introduction', 'System Articles', 'Company Introduction', 'Learn about our company mission, vision, and values', 1, true, '2021-08-09 02:30:12'),
(2, 'Rules', 'System Articles', 'Rules for obtaining orders', 'Complete guide on how to obtain and complete orders successfully', 2, true, '2021-08-09 02:31:03'),
(3, 'Agent Cooperation', 'System Articles', 'Introduction to Agent Cooperation', 'Information about becoming an agent and cooperation opportunities', 3, false, '2021-08-09 02:31:36'),
(4, 'Company Qualifications', 'System Articles', 'Company Qualifications', 'Our company certifications and qualifications', 4, true, '2021-08-09 02:32:31'),
(9, 'How we use your data', 'FAQ', 'How we use your data How we use your data How we use your data How we use your data How we use your data', 'Detailed explanation of our data usage policies and privacy protection measures', 100, false, '2024-06-26 21:10:35'),
(8, 'Data We Collect', 'FAQ', 'Data We Collect Data We Collect Data We Collect Data We Collect Data We Collect Data We Collect', 'Information about what data we collect and why we collect it', 100, false, '2024-06-26 21:10:23');
