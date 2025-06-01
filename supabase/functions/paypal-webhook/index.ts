
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
    console.log('PayPal webhook received');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the webhook payload
    const webhookData = await req.json();
    console.log('Webhook event type:', webhookData.event_type);
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2));

    // Extract relevant information
    const eventType = webhookData.event_type;
    const resource = webhookData.resource;

    // Handle different PayPal webhook events
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment capture completed:', resource.id);
        
        // Find the payment record using PayPal order ID
        const orderId = resource.supplementary_data?.related_ids?.order_id;
        if (orderId) {
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'completed',
              paypal_capture_data: resource
            })
            .eq('paypal_order_id', orderId);

          if (updateError) {
            console.error('Error updating payment status:', updateError);
          } else {
            console.log('Payment status updated successfully');
          }
        }
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        console.log('Payment capture denied:', resource.id);
        
        const deniedOrderId = resource.supplementary_data?.related_ids?.order_id;
        if (deniedOrderId) {
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'failed',
              paypal_capture_data: resource
            })
            .eq('paypal_order_id', deniedOrderId);

          if (updateError) {
            console.error('Error updating payment status:', updateError);
          }
        }
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('Payment refunded:', resource.id);
        
        const refundedOrderId = resource.supplementary_data?.related_ids?.order_id;
        if (refundedOrderId) {
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'refunded',
              paypal_capture_data: resource
            })
            .eq('paypal_order_id', refundedOrderId);

          if (updateError) {
            console.error('Error updating payment status:', updateError);
          }
        }
        break;

      default:
        console.log('Unhandled webhook event type:', eventType);
    }

    // Log the webhook event for debugging
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        event_type: eventType,
        payload: webhookData,
        processed_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging webhook:', logError);
    }

    // Always return 200 OK to acknowledge receipt
    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    
    // Return 200 OK even on error to prevent PayPal from retrying
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', message: error.message }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
