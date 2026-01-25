
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const MAILERSEND_API_KEY = "mlsn.24ef5298b1a1bcd591830bbf73c693e320677accd5ef3c12d955e3022dfc02a6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  product_price: number;
}

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    country: string;
  };
  items: OrderItem[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      customerEmail,
      customerName,
      orderNumber,
      totalAmount,
      shippingAddress,
      items
    }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation email:", { orderId, customerEmail, orderNumber });

    // Generate order items HTML
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.product_name}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ₹${item.product_price.toFixed(2)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ₹${(item.product_price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const subtotal = items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    const shippingCost = 160;

    // Send confirmation email to customer
    const confirmationEmailData = {
      from: {
        email: "MS_bJhxXl@trial-o65qngknd7v4wa12.mlsender.net",
        name: "NASTEA"
      },
      to: [
        {
          email: customerEmail,
          name: customerName
        }
      ],
      subject: `Order Confirmation - #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #fff; }
            .order-details { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background-color: #f3f4f6; padding: 12px; text-align: left; }
            .total-row { font-weight: bold; font-size: 1.1em; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .button { background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NASTEA</h1>
              <p>Thank you for your order!</p>
            </div>

            <div class="content">
              <h2>Order Confirmation</h2>
              <p>Hi ${customerName},</p>
              <p>We've received your order and it's being processed. Here are your order details:</p>

              <div class="order-details">
                <p><strong>Order Number:</strong> #${orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
              </div>

              <h3>Shipping Address</h3>
              <p>
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.address}<br>
                ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                ${shippingAddress.country}<br>
                Phone: ${shippingAddress.phone}
              </p>

              <h3>Order Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr>
                    <td colspan="3" style="padding: 12px; text-align: right;"><strong>Subtotal:</strong></td>
                    <td style="padding: 12px; text-align: right;">₹${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 12px; text-align: right;"><strong>Shipping:</strong></td>
                    <td style="padding: 12px; text-align: right;">₹${shippingCost.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="3" style="padding: 12px; border-top: 2px solid #000; text-align: right;">Total:</td>
                    <td style="padding: 12px; border-top: 2px solid #000; text-align: right;">₹${totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div style="text-align: center;">
                <a href="${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/orders/${orderId}" class="button">
                  Track Your Order
                </a>
              </div>

              <p style="margin-top: 30px;">
                We'll send you another email when your order ships. If you have any questions,
                please don't hesitate to contact us.
              </p>
            </div>

            <div class="footer">
              <p>Thank you for shopping with NASTEA!</p>
              <p>&copy; ${new Date().getFullYear()} NASTEA. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Try to send confirmation email
    try {
      const confirmationResponse = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationEmailData),
      });

      if (confirmationResponse.ok) {
        const confirmationResult = await confirmationResponse.json();
        console.log("Order confirmation email sent successfully:", confirmationResult);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Order confirmation email sent successfully"
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      } else {
        const errorText = await confirmationResponse.text();
        console.error("MailerSend API error:", errorText);

        // Return success anyway since the order was placed successfully
        return new Response(
          JSON.stringify({
            success: true,
            message: "Order placed successfully (email failed)",
            warning: "Email notification could not be sent"
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Return success anyway since the order was placed successfully
      return new Response(
        JSON.stringify({
          success: true,
          message: "Order placed successfully (email failed)",
          warning: "Email notification could not be sent"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
