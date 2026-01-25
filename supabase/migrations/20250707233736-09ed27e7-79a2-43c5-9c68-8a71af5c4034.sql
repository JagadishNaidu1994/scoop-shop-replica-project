
-- Add INSERT policy for order_items table to allow users to create order items for their own orders
CREATE POLICY "Users can insert order items for their orders" ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Also add UPDATE policy for order_items (might be needed for order processing)
CREATE POLICY "Users can update order items for their orders" ON public.order_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);
