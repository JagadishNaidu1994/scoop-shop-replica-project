
-- First, let's create a security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.get_user_admin_status(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Direct query without RLS to avoid infinite recursion
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = check_user_id
  );
END;
$$;

-- Now let's add RLS policies to the admin_users table to prevent the infinite recursion
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own admin status
CREATE POLICY "Users can view their own admin status" 
  ON public.admin_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for admins to view all admin users (using the security definer function)
CREATE POLICY "Admins can view all admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (public.get_user_admin_status(auth.uid()));

-- Policy for admins to insert new admin users
CREATE POLICY "Admins can insert admin users" 
  ON public.admin_users 
  FOR INSERT 
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Update the check_user_admin function to use the security definer function
CREATE OR REPLACE FUNCTION public.check_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN public.get_user_admin_status(user_id);
END;
$$;

-- Create a products table for the admin product management
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  primary_image TEXT,
  hover_image TEXT,
  category TEXT,
  benefits TEXT[],
  in_stock BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active products (for shop page)
CREATE POLICY "Anyone can view active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

-- Allow admins to manage all products
CREATE POLICY "Admins can manage products" 
  ON public.products 
  FOR ALL 
  USING (public.get_user_admin_status(auth.uid()));

-- Create a journals table
CREATE TABLE public.journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT,
  category TEXT DEFAULT 'Matcha',
  read_time TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on journals table
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view published journals
CREATE POLICY "Anyone can view published journals" 
  ON public.journals 
  FOR SELECT 
  USING (is_published = true);

-- Allow admins to manage all journals
CREATE POLICY "Admins can manage journals" 
  ON public.journals 
  FOR ALL 
  USING (public.get_user_admin_status(auth.uid()));

-- Insert some sample journals
INSERT INTO public.journals (title, content, excerpt, image_url, author, read_time, is_published) VALUES
(
  'The Ultimate Guide to Matcha: From Tea Ceremony to Modern Health Benefits',
  'Matcha, the vibrant green powder that has taken the wellness world by storm, has a rich history dating back over 800 years to the Japanese tea ceremony. This finely ground powder made from specially grown and processed green tea leaves offers a unique combination of calm energy and powerful antioxidants that make it a superfood in every sense of the word.

The traditional Japanese tea ceremony, known as "chanoyu" or "sado," elevated matcha to an art form. Buddhist monks discovered that matcha helped them maintain alertness during long meditation sessions while keeping their minds calm and focused. This perfect balance of energy and tranquility comes from matcha''s unique combination of caffeine and L-theanine.

Modern science has validated what ancient practitioners knew intuitively. Matcha contains up to 137 times more antioxidants than regular green tea, particularly catechins like EGCG (epigallocatechin gallate), which support cellular health and may help protect against oxidative stress.

The production process is what makes matcha so special. Tea plants are shade-grown for 3-4 weeks before harvest, boosting chlorophyll levels and creating that signature vibrant green color. Only the youngest, most tender leaves are hand-picked, steamed, dried, and stone-ground into the fine powder we know as matcha.

Today, matcha has evolved beyond the traditional tea ceremony into lattes, smoothies, desserts, and wellness supplements. Whether you''re seeking sustained energy without the crash, supporting your meditation practice, or simply enjoying the rich, umami flavor, matcha offers a time-tested path to wellness.',
  'Discover the ancient wisdom and modern science behind matcha, from its origins in Japanese tea ceremony to its role as a contemporary superfood.',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
  'Dr. Sarah Chen',
  '8 min read',
  true
),
(
  'Ceremonial vs Culinary Grade Matcha: What''s the Difference?',
  'Not all matcha is created equal. Understanding the difference between ceremonial and culinary grade matcha can transform your matcha experience and ensure you''re getting the best value for your investment.

Ceremonial grade matcha represents the highest quality available. Made from the youngest tea leaves (typically the first and second harvest), this grade is stone-ground to achieve an ultra-fine powder with a vibrant jade green color. The flavor profile is complex yet smooth, with natural sweetness and minimal bitterness. This grade is traditionally whisked with hot water and consumed on its own, following the principles of the Japanese tea ceremony.

The color tells a story - true ceremonial grade matcha should be a bright, vibrant green, indicating high chlorophyll content and proper processing. The texture should be silky and fine, dissolving easily when whisked. When prepared correctly, ceremonial grade matcha creates a beautiful, frothy layer on top, known as "foam" or "froth."

Culinary grade matcha, while still nutritious and delicious, is designed for cooking and baking applications. It''s typically made from later harvests and has a more robust, slightly bitter flavor that holds up well when mixed with other ingredients. This grade is perfect for matcha lattes, smoothies, ice cream, and baked goods.

The price difference reflects the production process and quality. Ceremonial grade requires more careful cultivation, hand-picking of only the finest leaves, and traditional stone-grinding methods that can take hours to produce just 30 grams of powder.

For daily wellness routines, many people find a premium culinary grade offers the perfect balance of quality and value, especially when mixed into lattes or smoothies. However, for those seeking the full traditional experience or the highest concentration of beneficial compounds, ceremonial grade is unmatched.',
  'Learn how to choose the right matcha for your needs and understand what makes ceremonial grade worth the investment.',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
  'Master Tanaka',
  '6 min read',
  true
),
(
  'Matcha and Mental Clarity: The Science Behind Calm Focus',
  'In our fast-paced world, finding sustained mental clarity without jitters or crashes seems almost impossible. Enter matcha - nature''s perfect solution for balanced energy and enhanced cognitive function.

The secret lies in matcha''s unique combination of caffeine and L-theanine. While a cup of matcha contains about 70mg of caffeine (compared to coffee''s 95mg), it''s the presence of L-theanine that makes all the difference. This amino acid, found almost exclusively in tea plants, promotes alpha brain wave activity associated with relaxed alertness.

Research shows that L-theanine increases the production of GABA, dopamine, and serotonin - neurotransmitters that regulate mood, concentration, and sleep. When combined with caffeine, L-theanine smooths out caffeine''s stimulating effects, preventing the anxiety and crash often associated with coffee consumption.

Studies have demonstrated that this caffeine-L-theanine combination can improve attention span, reaction time, and memory. Participants in controlled studies showed enhanced performance on attention-switching tasks and demonstrated better sustained attention over longer periods.

The traditional preparation method also contributes to the mindfulness benefits. The meditative process of whisking matcha encourages present-moment awareness, creating a natural break from digital distractions and mental chatter.

For optimal cognitive benefits, consume matcha on an empty stomach or between meals. The absorption of L-theanine is enhanced when not competing with other amino acids from protein-rich foods. Start with half a teaspoon of high-quality matcha and adjust based on your sensitivity to caffeine.',
  'Explore the neuroscience behind matcha''s ability to enhance focus and mental clarity without the typical caffeine crash.',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
  'Dr. Michael Rodriguez',
  '7 min read',
  true
);
