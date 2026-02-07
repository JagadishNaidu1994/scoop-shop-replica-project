

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const MAILERSEND_API_KEY = "mlsn.24ef5298b1a1bcd591830bbf73c693e320677accd5ef3c12d955e3022dfc02a6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WholesaleEmailRequest {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, businessType, message }: WholesaleEmailRequest = await req.json();

    console.log("Received wholesale inquiry:", { name, email, phone, businessType });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save enquiry to database first (this is the primary action)
    const { data: enquiryData, error: dbError } = await supabase
      .from('wholesale_enquiries')
      .insert([
        {
          name,
          email,
          phone,
          business_type: businessType,
          message: message || null,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save enquiry: ${dbError.message}`);
    }

    console.log("Enquiry saved to database:", enquiryData);

    // Send notification email to you (the business owner)
    const notificationEmailData = {
      from: {
        email: "MS_bJhxXl@trial-o65qngknd7v4wa12.mlsender.net",
        name: "NASTEA Wholesale"
      },
      to: [
        {
          email: "jagadish.bondada@gmail.com",
          name: "NASTEA Team"
        }
      ],
      subject: `New Wholesale Inquiry from ${name} - ${businessType}`,
      html: `
        <h2>New Wholesale Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
        <hr>
        <p>Please respond to this inquiry promptly.</p>
        <p><em>Sent via NASTEA Wholesale Contact Form</em></p>
      `,
    };

    // Try to send notification email (optional - don't fail if this doesn't work)
    try {
      const notificationResponse = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationEmailData),
      });

      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log("Notification email sent:", notificationResult);
      } else {
        const errorText = await notificationResponse.text();
        console.warn("MailerSend notification failed (non-critical):", errorText);
      }
    } catch (emailError) {
      console.warn("Email sending failed (non-critical):", emailError);
    }

    // Send confirmation email to the customer
    const confirmationEmailData = {
      from: {
        email: "MS_bJhxXl@trial-o65qngknd7v4wa12.mlsender.net",
        name: "NASTEA"
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
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Your Message:</strong></p>
        <p>${message || 'No message provided'}</p>

        <hr>
        <p>In the meantime, feel free to explore our wholesale matcha services on our website.</p>
        <p>Best regards,<br>NASTEA Wholesale Team</p>
      `,
    };

    // Try to send confirmation email (optional - don't fail if this doesn't work)
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
        console.log("Confirmation email sent:", confirmationResult);
      } else {
        const errorText = await confirmationResponse.text();
        console.warn("MailerSend confirmation failed (non-critical):", errorText);
      }
    } catch (emailError) {
      console.warn("Confirmation email failed (non-critical):", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        enquiryId: enquiryData.id,
        message: "Your enquiry has been saved successfully. We'll get back to you soon!"
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

