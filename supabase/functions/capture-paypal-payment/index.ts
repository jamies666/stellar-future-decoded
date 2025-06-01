
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PayPal payment capture function started');

    const { orderId } = await req.json();
    console.log('Capturing PayPal order:', orderId);

    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get access token from PayPal
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      throw new Error(`PayPal authentication failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Capture the payment
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      console.error('PayPal capture error:', errorText);
      throw new Error(`PayPal payment capture failed: ${captureResponse.status}`);
    }

    const captureData = await captureResponse.json();
    console.log('PayPal payment captured:', captureData);

    // Verify payment was successful
    if (captureData.status === 'COMPLETED') {
      // Get user from auth header
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        throw new Error('No authorization header provided');
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        throw new Error('Invalid user token');
      }

      // Store payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          paypal_order_id: orderId,
          amount: 9.99,
          currency: 'USD',
          status: 'completed',
          paypal_capture_data: captureData
        });

      if (paymentError) {
        console.error('Error storing payment:', paymentError);
        throw new Error('Failed to store payment record');
      }

      console.log(`Payment recorded for user ${user.id}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment completed successfully',
          captureId: captureData.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error(`Payment capture failed with status: ${captureData.status}`);
    }

  } catch (error) {
    console.error('Error in capture-paypal-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
