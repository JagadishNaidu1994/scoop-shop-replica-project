import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DELHIVERY_API_KEY = Deno.env.get("DELHIVERY_API_KEY") || "";
const DELHIVERY_BASE_URL = "https://track.delhivery.com/api/cmu/create.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {

    // Test payload
    const testPayload = {
      shipments: [
        {
          name: "Test Customer",
          add: "123 Test Street",
          add2: "",
          pin: "500068",
          city: "Hyderabad",
          state: "Telangana",
          country: "India",
          phone: "+919999999999",
          order: `TEST-${Date.now()}`,
          payment_mode: "Prepaid",
          return_pin: "500068",
          return_city: "Hyderabad",
          return_phone: "+919876543210",
          return_add: "Durga Elevate, Hyderabad",
          return_state: "Telangana",
          return_country: "India",
          products_desc: "Test Product",
          hsn_code: "",
          cod_amount: "0",
          order_date: new Date().toISOString().split("T")[0],
          total_amount: "500",
          seller_add: "Durga Elevate, Hyderabad, Telangana",
          seller_name: "NASTEA",
          seller_inv: "",
          quantity: "1",
          waybill: "",
          shipment_width: "",
          shipment_height: "",
          weight: "",
          seller_gst_tin: "",
          shipping_mode: "Surface",
          address_type: "",
        },
      ],
      pickup_location: {
        name: "Durga Elevate",
      },
    };

    const bodyStr = `format=json&data=${JSON.stringify(testPayload)}`;

    console.log("Testing Delhivery API with payload:", testPayload);
    console.log("API Key available:", !!DELHIVERY_API_KEY);
    console.log("API Key length:", DELHIVERY_API_KEY.length);

    const response = await fetch(DELHIVERY_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Token ${DELHIVERY_API_KEY}`,
        Accept: "application/json",
      },
      body: bodyStr,
    });

    const responseText = await response.text();
    console.log("Delhivery raw response:", responseText);
    console.log("Response status:", response.status);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Non-JSON response: ${responseText}`,
          status: response.status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: result,
        api_key_set: !!DELHIVERY_API_KEY,
        message: "Test completed",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Test error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
