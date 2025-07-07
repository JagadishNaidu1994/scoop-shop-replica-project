
-- Create a table to store individual product page content
CREATE TABLE IF NOT EXISTS public.product_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  hero_image TEXT,
  features_title TEXT DEFAULT 'Key Features',
  features_list JSONB DEFAULT '[]'::jsonb,
  benefits_title TEXT DEFAULT 'Benefits',
  benefits_description TEXT,
  benefits_image TEXT,
  ingredients_title TEXT DEFAULT 'Ingredients',
  ingredients_list JSONB DEFAULT '[]'::jsonb,
  how_to_use_title TEXT DEFAULT 'How to Use',
  how_to_use_steps JSONB DEFAULT '[]'::jsonb,
  testimonials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  UNIQUE(product_id)
);

-- Enable RLS
ALTER TABLE public.product_page_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view product page content" 
  ON public.product_page_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage product page content" 
  ON public.product_page_content 
  FOR ALL 
  USING (get_user_admin_status(auth.uid()));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_product_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_page_content_updated_at
  BEFORE UPDATE ON public.product_page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_page_content_updated_at();
