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
        return_pin: "",
        return_city: "",
        return_phone: "",
        return_add: "",
        return_state: "",
        return_country: "",
        products_desc: productDesc,
        hsn_code: "",
        cod_amount: orderData.payment_method === "COD" ? orderData.total_amount.toString() : "0",
        order_date: new Date().toISOString().split("T")[0],
        total_amount: orderData.total_amount.toString(),
        seller_add: "",
        seller_name: "NASTEA",
        seller_inv: "",
        quantity: totalQty.toString(),
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
      name: "NASTEA Warehouse",
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

    // Delhivery returns { success: true, packages: [...] } on success
    if (result.success || result.packages?.length > 0) {
      return {
        success: true,
        packages: result.packages || [],
        message: "Shipment created successfully",
      };
    } else {
      return {
        success: false,
        error: result.rmk || result.error || JSON.stringify(result),
        packages: result.packages || [],
        message: "Failed to create Delhivery shipment",
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

    const { orderData } = await req.json();

    if (!orderData) {
      return new Response(
        JSON.stringify({ error: "Order data is required" }),
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
