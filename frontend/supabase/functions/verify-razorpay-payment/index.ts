import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, Content-Type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    console.log("Received payment verification request:", { razorpay_order_id, razorpay_payment_id });
    
    // Check if Razorpay secret key is configured
    const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!key_secret) {
      console.error("RAZORPAY_KEY_SECRET environment variable is not set");
      return new Response(
        JSON.stringify({ success: false, error: "Razorpay secret key not configured" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Verifying signature with secret key");
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac("sha256", key_secret)
      .encode(body)
      .toString();

    const isValid = expectedSignature === razorpay_signature;
    console.log("Signature verification result:", isValid);

    if (isValid) {
      // Update order status in database
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { error } = await supabase
        .from("orders")
        .update({ 
          payment_status: "paid",
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: "Payment verified successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid signature" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
