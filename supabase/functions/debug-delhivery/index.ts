import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get recent orders
    const { data: orders, error: ordersError } = await adminClient
      .from("orders")
      .select("id, order_number, total_amount, tracking_number, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (ordersError) {
      throw ordersError;
    }

    // Check Delhivery API key
    const delhiveryKey = Deno.env.get("DELHIVERY_API_KEY");
    const hasDelhiveryKey = !!delhiveryKey;

    return new Response(
      JSON.stringify({
        success: true,
        delhivery_api_key_configured: hasDelhiveryKey,
        delhivery_api_key_length: delhiveryKey?.length || 0,
        pickup_location_name: Deno.env.get("DELHIVERY_PICKUP_LOCATION_NAME") || "Durga Elevate",
        recent_orders: orders?.map((o) => ({
          order_number: o.order_number,
          status: o.status,
          tracking_number: o.tracking_number || "Not set",
          has_tracking: !!o.tracking_number,
          created_at: o.created_at,
          total_amount: o.total_amount,
        })) || [],
        debug_info: {
          message: "Check if orders have tracking_number field. If empty, Delhivery shipment wasn't created.",
          note: "If API key is configured but shipments aren't created, check Delhivery API response in function logs.",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Debug error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
