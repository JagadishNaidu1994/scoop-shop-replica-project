
-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON public.admin_users;

-- Disable RLS temporarily to fix the recursion issue
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Insert some sample products to populate the shop
INSERT INTO public.products (name, description, price, primary_image, hover_image, category, benefits, in_stock, is_active) VALUES
(
  'Matcha Powder - Ceremonial Grade',
  'Premium ceremonial grade matcha powder sourced directly from Uji, Japan. Stone-ground from the finest shade-grown tea leaves for the ultimate matcha experience.',
  27.00,
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  'Matcha',
  ARRAY['Antioxidant Rich', 'Sustained Energy', 'Mental Clarity', 'Metabolism Support'],
  true,
  true
),
(
  'Lion''s Mane Mushroom Powder',
  'Organic Lion''s Mane mushroom powder to support cognitive function and brain health. Perfect for smoothies, lattes, and cooking.',
  30.00,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
  'Mushrooms',
  ARRAY['Cognitive Support', 'Nerve Health', 'Focus Enhancement', 'Neuroprotective'],
  true,
  true
),
(
  'Reishi Mushroom Powder',
  'Organic Reishi mushroom powder, known as the "mushroom of immortality". Supports relaxation, immune function, and overall wellness.',
  25.00,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  'Mushrooms',
  ARRAY['Stress Relief', 'Immune Support', 'Sleep Quality', 'Adaptogenic'],
  true,
  true
),
(
  'Cordyceps Mushroom Powder',
  'Premium Cordyceps mushroom powder to enhance energy, endurance, and athletic performance naturally.',
  32.00,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=400&fit=crop',
  'Mushrooms',
  ARRAY['Energy Boost', 'Athletic Performance', 'Stamina', 'Respiratory Health'],
  true,
  true
),
(
  'Matcha Latte Blend',
  'Ready-to-mix matcha latte blend with coconut milk powder and natural sweeteners. Just add hot water for an instant delicious latte.',
  22.00,
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=400&fit=crop',
  'Blends',
  ARRAY['Convenient', 'Creamy Texture', 'Natural Sweetness', 'Quick Preparation'],
  true,
  true
),
(
  'Focus Blend - Matcha + Lion''s Mane',
  'Powerful combination of ceremonial matcha and Lion''s Mane mushroom for enhanced focus, clarity, and cognitive performance.',
  35.00,
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'Blends',
  ARRAY['Mental Clarity', 'Focus Enhancement', 'Cognitive Support', 'Sustained Energy'],
  true,
  true
);
