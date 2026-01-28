-- Add inventory management fields to products table
-- Add stock_quantity first if it doesn't exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Make SKU unique (drop existing constraint first if it exists)
DO $$
BEGIN
  -- Drop existing unique constraint if any
  ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_sku_key;
  ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_sku_unique;

  -- Add unique constraint only for non-null SKUs
  CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique_idx ON public.products (sku) WHERE sku IS NOT NULL;
END $$;

-- Create inventory_history table to track all stock changes
CREATE TABLE IF NOT EXISTS public.inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('sale', 'restock', 'adjustment', 'return', 'damaged', 'initial')),
  notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on product_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_inventory_history_product_id ON public.inventory_history(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_created_at ON public.inventory_history(created_at DESC);

-- Enable RLS on inventory_history table
ALTER TABLE public.inventory_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view inventory history" ON public.inventory_history;
DROP POLICY IF EXISTS "Admins can insert inventory history" ON public.inventory_history;

-- Create policies for inventory_history
CREATE POLICY "Admins can view inventory history"
  ON public.inventory_history
  FOR SELECT
  USING (public.get_user_admin_status(auth.uid()));

CREATE POLICY "Admins can insert inventory history"
  ON public.inventory_history
  FOR INSERT
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Create a function to automatically log inventory changes
CREATE OR REPLACE FUNCTION public.log_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if stock_quantity actually changed
  IF (TG_OP = 'UPDATE' AND OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity) THEN
    INSERT INTO public.inventory_history (
      product_id,
      quantity_change,
      new_quantity,
      reason,
      notes,
      user_id
    ) VALUES (
      NEW.id,
      NEW.stock_quantity - OLD.stock_quantity,
      NEW.stock_quantity,
      'adjustment',
      'Automatic tracking from product update',
      auth.uid()
    );
  ELSIF (TG_OP = 'INSERT' AND NEW.stock_quantity IS NOT NULL AND NEW.stock_quantity > 0) THEN
    INSERT INTO public.inventory_history (
      product_id,
      quantity_change,
      new_quantity,
      reason,
      notes,
      user_id
    ) VALUES (
      NEW.id,
      NEW.stock_quantity,
      NEW.stock_quantity,
      'initial',
      'Initial stock quantity',
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_log_inventory_change ON public.products;

-- Only create trigger if stock_quantity column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'products'
    AND column_name = 'stock_quantity'
  ) THEN
    CREATE TRIGGER trigger_log_inventory_change
      AFTER INSERT OR UPDATE OF stock_quantity ON public.products
      FOR EACH ROW
      EXECUTE FUNCTION public.log_inventory_change();
  END IF;
END $$;

-- Add comments to products table columns
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit - unique product identifier';
COMMENT ON COLUMN public.products.stock_quantity IS 'Current available stock quantity';
COMMENT ON COLUMN public.products.low_stock_threshold IS 'Alert threshold for low stock warnings';
