import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DELHIVERY_API_KEY = Deno.env.get("DELHIVERY_API_KEY") || "";
const DELHIVERY_BASE_URL = "https://track.delhivery.com/api";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

interface DelhiveryOrder {
  name: string;
  company_name?: string;
  address: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email?: string;
  order_type: string;
  payment_mode: string;
  order_amount: number;
  order_date: string;
  waybill?: string;
  shipping_charges: number;
  cod_charges?: number;
  discount?: number;
  total_amount: number;
  product_details: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  seller_name?: string;
  seller_address?: string;
  seller_city?: string;
  seller_state?: string;
  seller_pincode?: string;
  seller_country?: string;
}

function formatOrderData(orderData: OrderData): DelhiveryOrder {
  const productDetails = orderData.items.map(item => ({
    sku: `product_${item.product_id}`,
    name: item.product_name,
    quantity: item.quantity,
    price: item.product_price
  }));

  return {
    name: `${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}`,
    company_name: "NASTEA",
    address: orderData.shipping_address.address,
    address_line2: orderData.shipping_address.addressLine2 || "",
    city: orderData.shipping_address.city,
    state: orderData.shipping_address.state,
    pincode: orderData.shipping_address.postalCode,
    country: orderData.shipping_address.country || "India",
    phone: orderData.shipping_address.phone,
    email: orderData.user_email || "",
    order_type: "delivery",
    payment_mode: orderData.payment_method === "card" ? "Prepaid" : "COD",
    order_amount: orderData.total_amount,
    order_date: new Date().toISOString().split("T")[0],
    waybill: "",
    shipping_charges: orderData.shipping_cost || 0,
    cod_charges: 0,
    discount: 0,
    total_amount: orderData.total_amount,
    product_details: productDetails,
    seller_name: "NASTEA",
    seller_address: "Your Business Address, Sector 1",
    seller_city: "Gurugram",
    seller_state: "Haryana",
    seller_pincode: "122001",
    seller_country: "India"
  };
}

async function createDelhiveryShipment(orderData: OrderData) {
  try {
    console.log("Creating Delhivery shipment for order:", orderData.order_number);
    
    const delhiveryOrder = formatOrderData(orderData);
    
    const response = await fetch(`${DELHIVERY_BASE_URL}/c/create-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${DELHIVERY_API_KEY}`,
      },
      body: JSON.stringify({
        format: "json",
        data: {
          shipments: [delhiveryOrder]
        }
      }),
    });

    const result = await response.json();
    console.log("Delhivery response:", result);

    if (result.success) {
      return {
        success: true,
        packages: result.packages || [],
        message: "Shipment created successfully"
      };
    } else {
      return {
        success: false,
        error: result.error || "Failed to create shipment",
        message: "Failed to create Delhivery shipment"
      };
    }
  } catch (error) {
    console.error("Delhivery API Error:", error);
    return {
      success: false,
      error: (error as Error).message || "Network error",
      message: "Failed to connect to Delhivery service"
    };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
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

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error",
        message: "Failed to process shipment request"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
