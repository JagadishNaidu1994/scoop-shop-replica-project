
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const MAILERSEND_API_KEY = "mlsn.24ef5298b1a1bcd591830bbf73c693e320677accd5ef3c12d955e3022dfc02a6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WholesaleEmailRequest {
  name: string;
  email: string;
  businessType: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, businessType, message }: WholesaleEmailRequest = await req.json();

    console.log("Received wholesale inquiry:", { name, email, businessType });

    // Send notification email to you (the business owner)
    const notificationEmailData = {
      from: {
        email: "noreply@yourdomain.com", // You'll need to replace this with your verified domain
        name: "The Missing Bean Wholesale"
      },
      to: [
        {
          email: "jagadish.bondada@gmail.com",
          name: "Jagadish Bondada"
        }
      ],
      subject: `New Wholesale Inquiry from ${name}`,
      html: `
        <h2>New Wholesale Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Please respond to this inquiry promptly.</p>
      `,
    };

    const notificationResponse = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationEmailData),
    });

    if (!notificationResponse.ok) {
      throw new Error(`MailerSend notification email failed: ${notificationResponse.statusText}`);
    }

    const notificationResult = await notificationResponse.json();
    console.log("Notification email sent:", notificationResult);

    // Send confirmation email to the customer
    const confirmationEmailData = {
      from: {
        email: "noreply@yourdomain.com", // You'll need to replace this with your verified domain
        name: "The Missing Bean"
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      subject: "Thank you for your wholesale inquiry!",
      html: `
        <h1>Thank you for your interest, ${name}!</h1>
        <p>We have received your wholesale inquiry and will get back to you within 24 hours.</p>
        
        <h3>Your inquiry details:</h3>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        
        <hr>
        <p>In the meantime, feel free to explore our wholesale services on our website.</p>
        <p>Best regards,<br>The Missing Bean Wholesale Team</p>
      `,
    };

    const confirmationResponse = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmationEmailData),
    });

    if (!confirmationResponse.ok) {
      throw new Error(`MailerSend confirmation email failed: ${confirmationResponse.statusText}`);
    }

    const confirmationResult = await confirmationResponse.json();
    console.log("Confirmation email sent:", confirmationResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationId: notificationResult.message_id || notificationResult.id,
        confirmationId: confirmationResult.message_id || confirmationResult.id
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-wholesale-email function:", error);
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
