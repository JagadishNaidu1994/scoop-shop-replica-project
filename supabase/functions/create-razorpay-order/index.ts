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
    console.log("create-razorpay-order function called");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid auth header");
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;
    console.log("User authenticated:", userId);

    const { shipping_cost = 0, discount_amount = 0 } = await req.json();
    console.log("Request params:", { shipping_cost, discount_amount });

    // Fetch cart items from DB — never trust frontend amount
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("product_id, product_name, product_price, quantity, is_subscription")
      .eq("user_id", userId);

    console.log("Cart fetch - Items:", cartItems?.length || 0, "Error:", cartError);

    if (cartError || !cartItems || cartItems.length === 0) {
      console.error("Cart error:", cartError);
      return new Response(
        JSON.stringify({ error: "Cart is empty or could not be loaded" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate prices against products table
    const productIds = cartItems.map((i) => i.product_id);
    console.log("Validating products:", productIds);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: products, error: prodError } = await adminClient
      .from("products")
      .select("id, price, stock_quantity, in_stock")
      .in("id", productIds);

    console.log("Products fetch - Count:", products?.length || 0, "Error:", prodError);

    if (prodError || !products) {
      console.error("Product validation error:", prodError);
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
      let unitPrice = product.price;
      if (item.is_subscription) {
        unitPrice = unitPrice * 0.8;
      }
      subtotal += unitPrice * item.quantity;
    }

    const totalAmount = subtotal - discount_amount + shipping_cost;
    const amountInPaise = Math.round(totalAmount * 100);
    console.log("Amount calculation - Subtotal:", subtotal, "Discount:", discount_amount, "Shipping:", shipping_cost, "Total:", totalAmount, "Paise:", amountInPaise);

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    console.log("RAZORPAY_KEY_ID exists:", !!razorpayKeyId);
    console.log("RAZORPAY_KEY_SECRET exists:", !!razorpayKeySecret);
    console.log("RAZORPAY_KEY_ID length:", razorpayKeyId?.length || 0);
    console.log("RAZORPAY_KEY_SECRET length:", razorpayKeySecret?.length || 0);

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials not configured");
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const receipt = `rcpt_${Date.now()}_${userId.slice(0, 8)}`;
    console.log("Creating Razorpay order - Receipt:", receipt, "Amount:", amountInPaise);

    // Create Basic Auth header for Razorpay
    const authString = `${razorpayKeyId}:${razorpayKeySecret}`;
    const encodedAuth = btoa(authString);

    console.log("Razorpay API Key ID (first 10 chars):", razorpayKeyId.substring(0, 10) + "...");
    console.log("Making request to Razorpay API");

    const rpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedAuth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt,
      }),
    });

    console.log("Razorpay API response status:", rpResponse.status);

    const rpOrder = await rpResponse.json();
    console.log("Razorpay order response:", JSON.stringify(rpOrder));

    if (!rpResponse.ok || !rpOrder.id) {
      console.error("Razorpay order creation failed:", rpOrder);
      return new Response(
        JSON.stringify({ error: "Failed to create payment order", details: rpOrder }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Razorpay order created successfully:", rpOrder.id);

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
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
