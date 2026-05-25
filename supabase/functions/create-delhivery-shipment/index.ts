import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DELHIVERY_API_KEY = Deno.env.get("DELHIVERY_API_KEY") || "";
const DELHIVERY_BASE_URL = "https://track.delhivery.com/api/cmu/create.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface OrderItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  country?: string;
}

interface OrderData {
  order_number: string;
  user_email: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
}

function buildDelhiveryPayload(orderData: OrderData) {
  const productDesc = orderData.items
    .map((i) => `${i.product_name} x${i.quantity}`)
    .join(", ");

  const totalQty = orderData.items.reduce((sum, i) => sum + i.quantity, 0);

  // Get environment variables with logging
  const returnPin = Deno.env.get("DELHIVERY_RETURN_PIN") || "500068";
  const returnCity = Deno.env.get("DELHIVERY_RETURN_CITY") || "Hyderabad";
  const returnPhone = Deno.env.get("DELHIVERY_RETURN_PHONE") || "9999999999";
  const returnAdd = Deno.env.get("DELHIVERY_RETURN_ADDRESS") || "Durga Elevate, Hyderabad";
  const returnState = Deno.env.get("DELHIVERY_RETURN_STATE") || "Telangana";
  const sellerAdd = Deno.env.get("DELHIVERY_SELLER_ADDRESS") || "Durga Elevate, Hyderabad, Telangana";
  const sellerGst = Deno.env.get("DELHIVERY_SELLER_GST") || "";
  const pickupName = Deno.env.get("DELHIVERY_PICKUP_LOCATION_NAME") || "Durga Elevate";

  console.log("Delhivery environment vars:", {
    returnPin,
    returnCity,
    returnPhone: returnPhone ? "***set***" : "***not set***",
    returnState,
    sellerGst: sellerGst ? "***set***" : "***not set***"
  });

  return {
    shipments: [
      {
        name: `${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}`,
        add: orderData.shipping_address.address,
        add2: orderData.shipping_address.addressLine2 || "",
        pin: orderData.shipping_address.postalCode,
        city: orderData.shipping_address.city,
        state: orderData.shipping_address.state,
        country: orderData.shipping_address.country || "India",
        phone: orderData.shipping_address.phone,
        order: orderData.order_number,
        payment_mode: orderData.payment_method === "COD" ? "COD" : "Prepaid",
        return_pin: returnPin,
        return_city: returnCity,
        return_phone: returnPhone,
        return_add: returnAdd,
        return_state: returnState,
        return_country: "India",
        products_desc: productDesc,
        hsn_code: "",
        cod_amount: orderData.payment_method === "COD" ? orderData.total_amount.toString() : "0",
        order_date: new Date().toISOString().split("T")[0],
        total_amount: orderData.total_amount.toString(),
        seller_add: sellerAdd,
        seller_name: "NASTEA",
        seller_inv: "",
        quantity: totalQty.toString(),
        waybill: "",
        shipment_width: "",
        shipment_height: "",
        weight: "",
        seller_gst_tin: sellerGst,
        shipping_mode: "Surface",
        address_type: "",
      },
    ],
    pickup_location: {
      name: pickupName,
    },
  };
}

async function createDelhiveryShipment(orderData: OrderData) {
  try {
    console.log("Creating Delhivery shipment for order:", orderData.order_number);

    if (!DELHIVERY_API_KEY) {
      console.error("DELHIVERY_API_KEY not set");
      return {
        success: false,
        error: "Delhivery API key not configured",
        packages: [],
      };
    }

    const payload = buildDelhiveryPayload(orderData);
    const bodyStr = `format=json&data=${JSON.stringify(payload)}`;

    console.log("Delhivery request body:", bodyStr);

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

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse Delhivery response as JSON");
      return {
        success: false,
        error: `Non-JSON response: ${responseText.slice(0, 200)}`,
        packages: [],
      };
    }

    console.log("Delhivery parsed response:", JSON.stringify(result));

    // Log detailed response for debugging
    console.log("Response keys:", Object.keys(result));
    console.log("Response success field:", result.success);
    console.log("Response packages:", result.packages);
    console.log("Response error/rmk:", result.error || result.rmk || result.message);

    // Delhivery returns { success: true, packages: [...] } on success
    if (result.success || result.packages?.length > 0) {
      console.log("✅ Shipment creation successful");
      return {
        success: true,
        packages: result.packages || [],
        message: "Shipment created successfully",
      };
    } else {
      console.log("❌ Shipment creation failed:", result);
      return {
        success: false,
        error: result.rmk || result.error || result.message || JSON.stringify(result),
        packages: result.packages || [],
        message: "Failed to create Delhivery shipment",
        full_response: result,
      };
    }
  } catch (error) {
    console.error("Delhivery API Error:", error);
    return {
      success: false,
      error: (error as Error).message || "Network error",
      packages: [],
      message: "Failed to connect to Delhivery service",
    };
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestBody = await req.json();
    console.log("Received request body:", JSON.stringify(requestBody));

    const orderData = requestBody.orderData || requestBody;

    if (!orderData) {
      return new Response(
        JSON.stringify({ error: "Order data is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!orderData.order_number || !orderData.shipping_address) {
      return new Response(
        JSON.stringify({ error: "Missing required order fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await createDelhiveryShipment(orderData);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        message: "Failed to process shipment request",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
