
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('PayPal order creation function started');

    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    console.log('PayPal Client ID exists:', !!paypalClientId);
    console.log('PayPal Client Secret exists:', !!paypalClientSecret);

    if (!paypalClientId || !paypalClientSecret) {
      console.error('PayPal credentials not configured');
      return new Response(
        JSON.stringify({ error: 'PayPal credentials not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Ensure credentials are properly trimmed
    const clientId = paypalClientId.trim();
    const clientSecret = paypalClientSecret.trim();
    
    console.log('Using PayPal LIVE environment');
    console.log('Client ID length:', clientId.length);
    console.log('Client Secret length:', clientSecret.length);

    // Get access token from PayPal LIVE
    const credentials = btoa(`${clientId}:${clientSecret}`);
    console.log('Generated credentials for auth');

    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: 'grant_type=client_credentials',
    });

    console.log('Auth response status:', authResponse.status);

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('PayPal auth error response:', errorText);
      console.error('Auth response headers:', Object.fromEntries(authResponse.headers.entries()));
      throw new Error(`PayPal authentication failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    console.log('PayPal access token obtained successfully');

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '1.99'
        },
        description: 'Cosmic Insights - Personalized Reading'
      }],
      application_context: {
        return_url: `${req.headers.get('origin')}/payment-success`,
        cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
        brand_name: 'Cosmic Insights',
        user_action: 'PAY_NOW'
      }
    };

    console.log('Creating PayPal order with data:', JSON.stringify(orderData, null, 2));

    const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('Order response status:', orderResponse.status);

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('PayPal order creation error response:', errorText);
      console.error('Order response headers:', Object.fromEntries(orderResponse.headers.entries()));
      throw new Error(`PayPal order creation failed: ${orderResponse.status} - ${errorText}`);
    }

    const order = await orderResponse.json();
    console.log('PayPal order created successfully:', order.id);

    // Find the approval URL
    const approvalUrl = order.links.find((link: any) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      console.error('No approval URL found in order response:', order);
      throw new Error('No approval URL found in PayPal order response');
    }

    console.log('Approval URL found:', approvalUrl);

    return new Response(
      JSON.stringify({ 
        orderId: order.id, 
        approvalUrl,
        success: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in create-paypal-order function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
