import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shipping_address,
      shipping_cost = 0,
      is_subscription = false,
      subscription_frequency = null,
    } = await req.json();

    // 1. Verify HMAC signature
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment verification not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac("sha256", keySecret).update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch for order:", razorpay_order_id);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payment signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Idempotency: check if payment already processed
    const { data: existingOrder } = await adminClient
      .from("orders")
      .select("id, order_number")
      .eq("payment_method", "razorpay")
      .eq("tracking_number", razorpay_payment_id)
      .maybeSingle();

    if (existingOrder) {
      return new Response(
        JSON.stringify({
          success: true,
          order_id: existingOrder.id,
          order_number: existingOrder.order_number,
          message: "Order already exists",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Fetch cart items from DB for server-side amount calculation
    const { data: cartItems, error: cartError } = await userClient
      .from("cart_items")
      .select("product_id, product_name, product_price, quantity, is_subscription, subscription_frequency")
      .eq("user_id", userId);

    if (cartError || !cartItems || cartItems.length === 0) {
      console.error("Cart fetch error:", cartError);
      return new Response(
        JSON.stringify({ success: false, error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Validate prices and calculate total from DB
    const productIds = cartItems.map((i) => i.product_id);
    const { data: products } = await adminClient
      .from("products")
      .select("id, price, stock_quantity")
      .in("id", productIds);

    const productMap = new Map((products || []).map((p) => [p.id, p]));

    let subtotal = 0;
    for (const item of cartItems) {
      const product = productMap.get(item.product_id);
      if (!product) continue;
      let unitPrice = product.price;
      if (item.is_subscription) unitPrice *= 0.8;
      subtotal += unitPrice * item.quantity;
    }
    const totalAmount = subtotal + shipping_cost;

    // 5. Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

    // 6. Create order (using service role to bypass RLS)
    const orderPayload: any = {
      user_id: userId,
      order_number: orderNumber,
      total_amount: totalAmount,
      shipping_cost: shipping_cost,
      status: "processing",
      payment_method: "razorpay",
      tracking_number: razorpay_payment_id, // store payment_id for idempotency
      shipping_address: shipping_address,
      billing_address: shipping_address,
    };

    if (is_subscription) {
      orderPayload.is_subscription = true;
      orderPayload.subscription_frequency = subscription_frequency;
    }

    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.is_subscription
        ? (productMap.get(item.product_id)?.price || item.product_price) * 0.8
        : productMap.get(item.product_id)?.price || item.product_price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await adminClient.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // 8. Deduct inventory
    for (const item of cartItems) {
      const product = productMap.get(item.product_id);
      if (!product || product.stock_quantity === null) continue;

      const newQty = Math.max(0, product.stock_quantity - item.quantity);
      await adminClient
        .from("products")
        .update({ stock_quantity: newQty })
        .eq("id", item.product_id);

      await adminClient.from("inventory_history").insert({
        product_id: item.product_id,
        quantity_change: -item.quantity,
        new_quantity: newQty,
        reason: "sale",
        notes: `Order ${orderNumber}`,
        user_id: userId,
      });
    }

    // 9. Clear cart (using service role)
    await adminClient.from("cart_items").delete().eq("user_id", userId);

    // 10. Trigger Delhivery shipment (fire and forget)
    try {
      const delhiveryKey = Deno.env.get("DELHIVERY_API_KEY");
      if (delhiveryKey && shipping_address) {
        const delhiveryPayload = {
          orderData: {
            order_number: orderNumber,
            user_email: userEmail,
            total_amount: totalAmount,
            shipping_cost: shipping_cost,
            payment_method: "Prepaid",
            items: cartItems.map((i) => ({
              product_id: i.product_id,
              product_name: i.product_name,
              product_price: i.product_price,
              quantity: i.quantity,
            })),
            shipping_address: shipping_address,
          },
        };

        // Call the delhivery edge function internally
        const delhiveryUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/create-delhivery-shipment`;
        const delhiveryResp = await fetch(delhiveryUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify(delhiveryPayload),
        });

        const delhiveryResult = await delhiveryResp.json();
        if (delhiveryResult.success && delhiveryResult.packages?.length > 0) {
          const awb = delhiveryResult.packages[0].waybill;
          if (awb) {
            await adminClient
              .from("orders")
              .update({ tracking_number: awb, status: "shipped" })
              .eq("id", order.id);
          }
        } else {
          console.warn("Delhivery shipment not created:", delhiveryResult);
        }
      }
    } catch (delhiveryError) {
      console.error("Delhivery error (non-fatal):", delhiveryError);
    }

    // 11. Send order confirmation email (fire and forget)
    try {
      const emailUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-confirmation`;
      await fetch(emailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          customerEmail: userEmail,
          customerName: `${shipping_address?.firstName || ""} ${shipping_address?.lastName || ""}`.trim(),
          orderNumber: orderNumber,
          totalAmount: totalAmount,
          shippingAddress: shipping_address,
          items: cartItems.map((i) => ({
            product_name: i.product_name,
            quantity: i.quantity,
            product_price: i.product_price,
          })),
        }),
      });
    } catch (emailError) {
      console.error("Email error (non-fatal):", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        order_number: orderNumber,
        message: "Payment verified and order created",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
