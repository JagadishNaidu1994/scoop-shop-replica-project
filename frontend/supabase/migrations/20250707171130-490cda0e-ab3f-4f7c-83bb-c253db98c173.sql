
-- Create page_content table to store editable content for any page
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'image', 'json')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(page_id, content_key)
);

-- Enable Row Level Security
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for page_content
CREATE POLICY "Anyone can view page content" 
  ON public.page_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage page content" 
  ON public.page_content 
  FOR ALL 
  USING (get_user_admin_status(auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_page_content_updated_at();
