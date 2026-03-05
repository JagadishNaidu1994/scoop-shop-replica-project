
-- Create product_reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  is_important BOOLEAN NOT NULL DEFAULT false,
  admin_reply TEXT,
  admin_reply_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, order_id, product_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.product_reviews
  FOR SELECT
  USING (is_approved = true AND is_archived = false);

-- Authenticated users can view their own reviews (even unapproved)
CREATE POLICY "Users can view own reviews"
  ON public.product_reviews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Authenticated users can insert reviews
CREATE POLICY "Users can insert reviews"
  ON public.product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
  ON public.product_reviews
  FOR ALL
  TO authenticated
  USING (get_user_admin_status(auth.uid()));
