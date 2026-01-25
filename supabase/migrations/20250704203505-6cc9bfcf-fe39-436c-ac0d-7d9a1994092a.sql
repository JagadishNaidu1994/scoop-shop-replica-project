
-- Create shipping zones table for pincode-based shipping
CREATE TABLE public.shipping_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name text NOT NULL,
  pincodes text[] NOT NULL,
  base_rate numeric NOT NULL DEFAULT 0,
  per_kg_rate numeric NOT NULL DEFAULT 0,
  free_shipping_threshold numeric DEFAULT 500,
  delivery_days text DEFAULT '3-5 days',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create shipping methods table
CREATE TABLE public.shipping_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  base_rate numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  estimated_days text DEFAULT '3-5 days',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add shipping columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_method_id uuid REFERENCES public.shipping_methods(id),
ADD COLUMN IF NOT EXISTS shipping_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS shipped_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS estimated_delivery_date date;

-- Create order tracking table
CREATE TABLE public.order_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  message text,
  location text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create returns table
CREATE TABLE public.returns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id),
  user_id uuid NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'requested',
  refund_amount numeric NOT NULL,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create return items table
CREATE TABLE public.return_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id uuid NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES public.order_items(id),
  quantity integer NOT NULL DEFAULT 1,
  reason text
);

-- Insert default shipping zones for India with Hyderabad as source
INSERT INTO public.shipping_zones (zone_name, pincodes, base_rate, per_kg_rate, free_shipping_threshold, delivery_days) VALUES
('Local Hyderabad', ARRAY['500001','500002','500003','500004','500005','500006','500007','500008','500009','500010','500011','500012','500013','500014','500015','500016','500017','500018','500019','500020','500021','500022','500023','500024','500025','500026','500027','500028','500029','500030','500031','500032','500033','500034','500035','500036','500037','500038','500039','500040','500041','500042','500043','500044','500045','500046','500047','500048','500049','500050','500051','500052','500053','500054','500055','500056','500057','500058','500059','500060','500061','500062','500063','500064','500065','500066','500067','500068','500069','500070','500071','500072','500073','500074','500075','500076','500077','500078','500079','500080','500081','500082','500083','500084','500085','500086','500087','500088','500089','500090','500091','500092','500093','500094','500095','500096','500097','500098','500099','500100'], 50, 10, 300, '1-2 days'),
('Telangana', ARRAY['501101','501102','501103','501104','501105','501106','501107','501108','501109','501110','501111','501112','501113','501114','501115','501116','501117','501118','501119','501120','501121','501122','501123','501124','501125','501126','501127','501128','501129','501130','501131','501132','501133','501134','501135','501136','501137','501138','501139','501140','501141','501142','501143','501144','501145','501146','501147','501148','501149','501150','501151','501152','501153','501154','501155','501156','501157','501158','501159','501160','501161','501162','501163','501164','501165','501166','501167','501168','501169','501170','501171','501172','501173','501174','501175','501176','501177','501178','501179','501180','501181','501182','501183','501184','501185','501186','501187','501188','501189','501190','501191','501192','501193','501194','501195','501196','501197','501198','501199','501200'], 80, 15, 400, '2-3 days'),
('Andhra Pradesh', ARRAY['515001','515002','515003','515004','515005','515006','515007','515008','515009','515010','515011','515012','515013','515014','515015','515016','515017','515018','515019','515020','515021','515022','515023','515024','515025','515026','515027','515028','515029','515030','515031','515032','515033','515034','515035','515036','515037','515038','515039','515040','515041','515042','515043','515044','515045','515046','515047','515048','515049','515050','515051','515052','515053','515054','515055','515056','515057','515058','515059','515060','515061','515062','515063','515064','515065','515066','515067','515068','515069','515070','515071','515072','515073','515074','515075','515076','515077','515078','515079','515080','515081','515082','515083','515084','515085','515086','515087','515088','515089','515090','515091','515092','515093','515094','515095','515096','515097','515098','515099','515100'], 120, 20, 500, '3-4 days'),
('South India', ARRAY['560001','560002','560003','560004','560005','600001','600002','600003','600004','600005','680001','680002','680003','680004','680005','530001','530002','530003','530004','530005'], 150, 25, 600, '4-5 days'),
('West India', ARRAY['400001','400002','400003','400004','400005','380001','380002','380003','380004','380005','411001','411002','411003','411004','411005'], 180, 30, 700, '5-6 days'),
('North India', ARRAY['110001','110002','110003','110004','110005','201001','201002','201003','201004','201005','302001','302002','302003','302004','302005'], 200, 35, 800, '6-7 days'),
('East India', ARRAY['700001','700002','700003','700004','700005','751001','751002','751003','751004','751005','800001','800002','800003','800004','800005'], 220, 40, 900, '7-8 days'),
('Remote Areas', ARRAY['796001','796002','796003','796004','796005','370001','370002','370003','370004','370005','191001','191002','191003','191004','191005'], 300, 50, 1000, '10-15 days');

-- Insert default shipping methods
INSERT INTO public.shipping_methods (name, description, base_rate, estimated_days) VALUES
('Standard Shipping', 'Regular delivery within estimated time', 0, '3-7 days'),
('Express Shipping', 'Faster delivery with priority handling', 100, '1-3 days'),
('Overnight Shipping', 'Next day delivery for urgent orders', 250, '1 day');

-- Enable RLS on new tables
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shipping zones (public read)
CREATE POLICY "Anyone can view shipping zones" ON public.shipping_zones FOR SELECT USING (true);
CREATE POLICY "Admins can manage shipping zones" ON public.shipping_zones FOR ALL USING (get_user_admin_status(auth.uid()));

-- Create RLS policies for shipping methods (public read)
CREATE POLICY "Anyone can view shipping methods" ON public.shipping_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage shipping methods" ON public.shipping_methods FOR ALL USING (get_user_admin_status(auth.uid()));

-- Create RLS policies for order tracking
CREATE POLICY "Users can view tracking for their orders" ON public.order_tracking FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_tracking.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can manage order tracking" ON public.order_tracking FOR ALL USING (get_user_admin_status(auth.uid()));

-- Create RLS policies for returns
CREATE POLICY "Users can view their own returns" ON public.returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create returns for their orders" ON public.returns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their pending returns" ON public.returns FOR UPDATE USING (auth.uid() = user_id AND status = 'requested');
CREATE POLICY "Admins can manage all returns" ON public.returns FOR ALL USING (get_user_admin_status(auth.uid()));

-- Create RLS policies for return items
CREATE POLICY "Users can view return items for their returns" ON public.return_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid()));
CREATE POLICY "Users can create return items for their returns" ON public.return_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid()));
CREATE POLICY "Admins can manage return items" ON public.return_items FOR ALL USING (get_user_admin_status(auth.uid()));
