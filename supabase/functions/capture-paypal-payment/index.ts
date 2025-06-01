
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
    console.log('=== PayPal payment capture function started ===');

    const { orderId } = await req.json();
    console.log('Request to capture PayPal order:', orderId);

    if (!orderId) {
      console.error('No orderId provided in request');
      throw new Error('Order ID is required');
    }

    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment variables check:');
    console.log('- PayPal Client ID exists:', !!paypalClientId);
    console.log('- PayPal Client Secret exists:', !!paypalClientSecret);
    console.log('- Supabase URL exists:', !!supabaseUrl);
    console.log('- Supabase Service Key exists:', !!supabaseServiceKey);

    if (!paypalClientId || !paypalClientSecret) {
      console.error('PayPal credentials not configured');
      throw new Error('PayPal credentials not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured');
      throw new Error('Supabase credentials not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized');

    // Get access token from PayPal LIVE
    console.log('Requesting PayPal access token...');
    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    console.log('PayPal auth response status:', authResponse.status);

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('PayPal authentication failed:', authResponse.status, errorText);
      throw new Error(`PayPal authentication failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    console.log('PayPal access token obtained successfully');

    // Capture the payment using LIVE endpoint
    console.log('Attempting to capture payment for order:', orderId);
    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('PayPal capture response status:', captureResponse.status);

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      console.error('PayPal capture error:', captureResponse.status, errorText);
      throw new Error(`PayPal payment capture failed: ${captureResponse.status} - ${errorText}`);
    }

    const captureData = await captureResponse.json();
    console.log('PayPal payment capture data:', JSON.stringify(captureData, null, 2));

    // Verify payment was successful
    if (captureData.status === 'COMPLETED') {
      console.log('Payment capture completed successfully');

      // Get user from auth header
      const authHeader = req.headers.get('authorization');
      console.log('Authorization header present:', !!authHeader);
      
      if (!authHeader) {
        console.error('No authorization header provided');
        throw new Error('No authorization header provided');
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('Extracting user from token...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error(`Invalid user token: ${userError.message}`);
      }
      
      if (!user) {
        console.error('No user found for token');
        throw new Error('No user found for the provided token');
      }

      console.log('User authenticated successfully:', user.id);

      // Store payment record
      console.log('Storing payment record in database...');
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          paypal_order_id: orderId,
          amount: 1.99,
          currency: 'USD',
          status: 'completed',
          paypal_capture_data: captureData
        });

      if (paymentError) {
        console.error('Error storing payment:', paymentError);
        throw new Error(`Failed to store payment record: ${paymentError.message}`);
      }

      console.log(`Payment recorded successfully for user ${user.id}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment completed successfully',
          captureId: captureData.id,
          orderId: orderId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.error('Payment capture failed with status:', captureData.status);
      throw new Error(`Payment capture failed with status: ${captureData.status}`);
    }

  } catch (error) {
    console.error('=== Error in capture-paypal-payment function ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
