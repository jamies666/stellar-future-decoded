// Edge function to handle RevenueCat webhooks
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RevenueCatWebhookEvent {
  api_version: string;
  event: {
    type: string;
    id: string;
    event_timestamp_ms: number;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms?: number;
    environment: string;
    entitlement_id?: string;
    entitlement_ids?: string[];
    presented_offering_id?: string;
    transaction_id: string;
    original_transaction_id: string;
    is_family_share: boolean;
    country_code: string;
    app_user_id: string;
    aliases?: string[];
    original_app_user_id: string;
    commission_percentage?: number;
    currency: string;
    price: number;
    price_in_purchased_currency?: number;
    subscriber_attributes?: Record<string, any>;
    store: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('RevenueCat webhook received');

    // Verify the webhook signature (optional but recommended)
    const signature = req.headers.get('authorization');
    const expectedAuth = `Bearer ${Deno.env.get('REVENUECAT_WEBHOOK_SECRET')}`;
    
    if (signature !== expectedAuth) {
      console.error('Invalid webhook signature');
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const webhookData: RevenueCatWebhookEvent = await req.json();
    console.log('Webhook data:', webhookData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { event } = webhookData;
    const userId = event.app_user_id;

    // Handle different event types
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'NON_RENEWING_PURCHASE':
        console.log('Processing purchase event for user:', userId);
        
        // Grant access to the user
        await grantUserAccess(supabase, userId, event);
        break;

      case 'CANCELLATION':
      case 'EXPIRATION':
        console.log('Processing cancellation/expiration for user:', userId);
        
        // Revoke access
        await revokeUserAccess(supabase, userId, event);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response('OK', { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error processing RevenueCat webhook:', error);
    return new Response('Internal Server Error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function grantUserAccess(supabase: any, userId: string, event: any) {
  try {
    // Create or update user subscription record
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        product_id: event.product_id,
        transaction_id: event.transaction_id,
        original_transaction_id: event.original_transaction_id,
        purchased_at: new Date(event.purchased_at_ms),
        expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
        is_active: true,
        store: event.store,
        environment: event.environment,
        updated_at: new Date()
      }, {
        onConflict: 'user_id,original_transaction_id'
      });

    if (error) {
      console.error('Error upserting subscription:', error);
      throw error;
    }

    console.log('Successfully granted access to user:', userId);
  } catch (error) {
    console.error('Error granting user access:', error);
    throw error;
  }
}

async function revokeUserAccess(supabase: any, userId: string, event: any) {
  try {
    // Update subscription to inactive
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        is_active: false,
        cancelled_at: new Date(),
        updated_at: new Date()
      })
      .eq('user_id', userId)
      .eq('original_transaction_id', event.original_transaction_id);

    if (error) {
      console.error('Error revoking subscription:', error);
      throw error;
    }

    console.log('Successfully revoked access for user:', userId);
  } catch (error) {
    console.error('Error revoking user access:', error);
    throw error;
  }
}