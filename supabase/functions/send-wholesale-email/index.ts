
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const notificationEmail = await resend.emails.send({
      from: "Wholesale Inquiry <onboarding@resend.dev>",
      to: ["your-email@example.com"], // Replace with your actual email
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
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to the customer
    const confirmationEmail = await resend.emails.send({
      from: "The Missing Bean <onboarding@resend.dev>",
      to: [email],
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
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationId: notificationEmail.data?.id,
        confirmationId: confirmationEmail.data?.id 
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
