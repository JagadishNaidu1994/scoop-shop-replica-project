import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Razorpay from "https://esm.sh/razorpay@2.9.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, Content-Type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Skip auth validation for now - create a public endpoint
    console.log("Request received, processing...");
    
    const { amount, currency = "INR", receipt } = await req.json();
    
    console.log("Creating order with amount:", amount, "currency:", currency, "receipt:", receipt);
    
    // Use hardcoded credentials for Razorpay
    const razorpay = new Razorpay({
      key_id: "rzp_live_SIQxrqArP4XwxT",
      key_secret: "sCJFYsVU4Q5KxpVhNqkAkAl3",
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    });

    console.log("Order created successfully:", order);

    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
