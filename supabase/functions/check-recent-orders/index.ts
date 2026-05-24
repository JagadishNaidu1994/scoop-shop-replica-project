import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get last 5 orders
    const { data: orders, error } = await adminClient
      .from("orders")
      .select("id, order_number, status, tracking_number, total_amount, created_at, shipping_address")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    // Check Delhivery API key
    const delhiveryKey = Deno.env.get("DELHIVERY_API_KEY");

    return new Response(
      JSON.stringify({
        success: true,
        delhivery_api_key_configured: !!delhiveryKey,
        delhivery_api_key_preview: delhiveryKey ? `${delhiveryKey.substring(0, 10)}...${delhiveryKey.substring(delhiveryKey.length - 10)}` : "NOT SET",
        recent_orders: orders?.map((o) => ({
          order_number: o.order_number,
          status: o.status,
          has_tracking: !!o.tracking_number,
          tracking_number: o.tracking_number || "NOT SET",
          total: o.total_amount,
          created_at: o.created_at,
          shipping_city: o.shipping_address?.city,
        })) || [],
        analysis: {
          total_orders: orders?.length || 0,
          orders_with_tracking: orders?.filter(o => o.tracking_number).length || 0,
          orders_without_tracking: orders?.filter(o => !o.tracking_number).length || 0,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
