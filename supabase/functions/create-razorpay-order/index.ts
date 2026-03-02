import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { shipping_cost = 0 } = await req.json();

    // Fetch cart items from DB — never trust frontend amount
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("product_id, product_name, product_price, quantity, is_subscription")
      .eq("user_id", userId);

    if (cartError || !cartItems || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty or could not be loaded" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate prices against products table
    const productIds = cartItems.map((i) => i.product_id);
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: products, error: prodError } = await adminClient
      .from("products")
      .select("id, price, stock_quantity, in_stock")
      .in("id", productIds);

    if (prodError || !products) {
      return new Response(
        JSON.stringify({ error: "Failed to validate products" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    for (const item of cartItems) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product ${item.product_name} not found` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!product.in_stock || (product.stock_quantity !== null && product.stock_quantity < item.quantity)) {
        return new Response(
          JSON.stringify({ error: `${item.product_name} is out of stock` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Use DB price, apply 20% subscription discount if applicable
      let unitPrice = product.price;
      if (item.is_subscription) {
        unitPrice = unitPrice * 0.8;
      }
      subtotal += unitPrice * item.quantity;
    }

    const totalAmount = subtotal + shipping_cost;
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const receipt = `rcpt_${Date.now()}_${userId.slice(0, 8)}`;

    const rpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt,
      }),
    });

    const rpOrder = await rpResponse.json();

    if (!rpResponse.ok || !rpOrder.id) {
      console.error("Razorpay order creation failed:", rpOrder);
      return new Response(
        JSON.stringify({ error: "Failed to create payment order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        razorpay_order_id: rpOrder.id,
        amount: amountInPaise,
        currency: "INR",
        key_id: razorpayKeyId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
